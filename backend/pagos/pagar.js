import {
    createAuthenticatedClient,
    OpenPaymentsClientError,
    isFinalizedGrant,
} from "@interledger/open-payments";

/**
 * Inicia el proceso de pago y obtiene la URL de redirección si es necesaria.
 * @param {Object} params - Parámetros de configuración
 * @returns {Promise<Object>} - Objeto con la URL de redirección o el resultado final del pago
 */
async function executeInterledgerPayment({
    value,
    privateKey,
    keyId,
    clientWalletUrl,
    sendingWalletUrl,
    receivingWalletUrl
}) {
    try {
        const client = await createAuthenticatedClient({
            walletAddressUrl: clientWalletUrl,
            privateKey: privateKey,
            keyId: keyId
        });

        const sendingWalletAddress = await client.walletAddress.get({ url: sendingWalletUrl });
        const receivingWalletAddress = await client.walletAddress.get({ url: receivingWalletUrl });

        console.log("Obtenidas direcciones de wallet. Configurando pago entre wallets.");

        // Crear incoming payment
        const incomingPaymentGrant = await client.grant.request(
            { url: receivingWalletAddress.authServer }, 
            { access_token: { access: [{ type: "incoming-payment", actions: ["create"] }] } }
        );
        if (!isFinalizedGrant(incomingPaymentGrant)) {
            throw new Error(`El grant de incoming payment no está finalizado.`);
        }

        const incomingPayment = await client.incomingPayment.create(
            { url: receivingWalletAddress.resourceServer, accessToken: incomingPaymentGrant.access_token.value },
            { walletAddress: receivingWalletAddress.id, incomingAmount: { assetCode: receivingWalletAddress.assetCode, assetScale: receivingWalletAddress.assetScale, value: value } }
        );
        console.log("Creado incoming payment", { incomingPayment });

        // Crear quote
        const quoteGrant = await client.grant.request(
            { url: receivingWalletAddress.authServer },
            { access_token: { access: [{ type: "quote", actions: ["create"] }] } }
        );
        if (!isFinalizedGrant(quoteGrant)) {
            throw new Error(`El grant de quote no está finalizado.`);
        }

        const quote = await client.quote.create(
            { url: receivingWalletAddress.resourceServer, accessToken: quoteGrant.access_token.value }, 
            { walletAddress: sendingWalletAddress.id, receiver: incomingPayment.id, method: "ilp" }
        );
        console.log("Creado quote", { quote });

        // Solicitar grant para outgoing payment
        const outgoingPaymentGrant = await client.grant.request(
            { url: sendingWalletAddress.authServer },
            {
                access_token: {
                    access: [{
                        type: "outgoing-payment",
                        actions: ["create"],
                        limits: { debitAmount: quote.debitAmount },
                        identifier: sendingWalletAddress.id
                    }]
                },
                interact: { start: ["redirect"] },
            }
        );

        console.log("Obtenido outgoing payment grant", { outgoingPaymentGrant });

        // Si se necesita la aprobación del usuario
        if (outgoingPaymentGrant.interact && outgoingPaymentGrant.interact.redirect) {
            return {
                redirectUrl: outgoingPaymentGrant.interact.redirect,
                continueUri: outgoingPaymentGrant.continue.uri,
                continueAccessToken: outgoingPaymentGrant.continue.access_token.value,
                quoteId: quote.id,
                sendingWalletUrl: sendingWalletAddress.id
            };
        } else {
            // Si el grant se finaliza automáticamente
            console.log("El grant de pago saliente se ha finalizado automáticamente. Creando pago.");
            const outgoingPayment = await client.outgoingPayment.create(
                {
                    url: sendingWalletAddress.resourceServer,
                    accessToken: outgoingPaymentGrant.access_token.value
                },
                {
                    walletAddress: sendingWalletAddress.id,
                    quoteId: quote.id
                }
            );

            console.log("Creado outgoing payment", { outgoingPayment });
            return { success: true, outgoingPayment };
        }
    } catch (error) {
        console.error("Error durante la ejecución del pago:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Continúa el proceso de pago después de que el usuario lo aprueba en el navegador.
 * @param {Object} params - Parámetros para continuar el grant
 * @returns {Promise<Object>} - Resultado del pago saliente
 */
async function continueInterledgerPayment({ 
    continueUri, 
    continueAccessToken, 
    quoteId, 
    sendingWalletUrl, 
    privateKey, 
    keyId 
}) {
    try {
        console.log('Continuando pago con los siguientes parámetros:', {
            continueUri,
            sendingWalletUrl,
            quoteId
        });

        const client = await createAuthenticatedClient({
            walletAddressUrl: sendingWalletUrl,
            privateKey: privateKey,
            keyId: keyId
        });

        // 1. Intentar finalizar el grant tras la aprobación del usuario
        console.log('Intentando finalizar el grant...');
        let finalizedOutgoingPaymentGrant;
        
        try {
            finalizedOutgoingPaymentGrant = await client.grant.continue({
                url: continueUri,
                accessToken: continueAccessToken
            });
        } catch (grantError) {
            console.error('Error al continuar el grant:', {
                message: grantError.message,
                status: grantError.status,
                code: grantError.code,
                description: grantError.description
            });

            // Crear un error estructurado con toda la información
            const error = new Error(grantError.message || 'Error al continuar el grant');
            error.status = grantError.status || 500;
            error.code = grantError.code || 'grant_continue_failed';
            error.description = grantError.description || grantError.message;
            
            // Si es un error de OpenPayments, extraer más información
            if (grantError instanceof OpenPaymentsClientError) {
                error.status = grantError.status;
                error.code = grantError.code;
                error.description = grantError.description || grantError.message;
                error.validationErrors = grantError.validationErrors;
            }
            
            throw error;
        }

        console.log('Grant finalizado:', finalizedOutgoingPaymentGrant);

        // 2. Verificar que el grant está finalizado
        if (!isFinalizedGrant(finalizedOutgoingPaymentGrant)) {
            const error = new Error("El grant de pago saliente no se pudo finalizar después de la aprobación");
            error.status = 400;
            error.code = 'grant_not_finalized';
            error.description = 'El grant no está en estado finalizado después de la aprobación del usuario';
            throw error;
        }

        // 3. Obtener la dirección de la wallet emisora
        console.log('Obteniendo información de la wallet emisora...');
        const sendingWalletAddress = await client.walletAddress.get({ url: sendingWalletUrl });

        // 4. Crear el outgoing payment
        console.log('Creando el outgoing payment...');
        let outgoingPayment;
        
        try {
            outgoingPayment = await client.outgoingPayment.create(
                {
                    url: sendingWalletAddress.resourceServer,
                    accessToken: finalizedOutgoingPaymentGrant.access_token.value,
                },
                {
                    walletAddress: sendingWalletAddress.id,
                    quoteId: quoteId,
                }
            );
        } catch (paymentError) {
            console.error('Error al crear el outgoing payment:', {
                message: paymentError.message,
                status: paymentError.status,
                code: paymentError.code,
                description: paymentError.description
            });

            const error = new Error(paymentError.message || 'Error al crear el pago saliente');
            error.status = paymentError.status || 500;
            error.code = paymentError.code || 'outgoing_payment_failed';
            error.description = paymentError.description || paymentError.message;
            
            if (paymentError instanceof OpenPaymentsClientError) {
                error.status = paymentError.status;
                error.code = paymentError.code;
                error.description = paymentError.description || paymentError.message;
                error.validationErrors = paymentError.validationErrors;
            }
            
            throw error;
        }

        console.log("Pago completado exitosamente", { outgoingPayment });
        return { 
            success: true, 
            outgoingPayment,
            message: 'Pago realizado exitosamente',
            details: 'Pago completado'
        };

    } catch (error) {
        console.error("Error al continuar el pago:", {
            message: error.message,
            status: error.status,
            code: error.code,
            description: error.description,
            stack: error.stack
        });

        // Lanzar el error estructurado para que la API lo pueda manejar
        const structuredError = new Error(error.message);
        structuredError.status = error.status || 500;
        structuredError.code = error.code || 'unknown_error';
        structuredError.description = error.description || error.message;
        
        throw structuredError;
    }
}

// Exportar ambas funciones
export { executeInterledgerPayment, continueInterledgerPayment };
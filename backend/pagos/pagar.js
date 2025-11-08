import {
    createAuthenticatedClient,
    OpenPaymentsClientError,
    isFinalizedGrant,
} from "@interledger/open-payments";
// Ya no se necesita Readline ni open en el backend.
// import Readline from "readline";
// import open from "open";

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

        // Solicitar grant para outgoing payment. Aquí es donde se podría necesitar la interacción.
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
            // Devolver la URL de redirección y los datos para continuar el pago al frontend.
            return {
                redirectUrl: outgoingPaymentGrant.interact.redirect,
                continueUri: outgoingPaymentGrant.continue.uri,
                continueAccessToken: outgoingPaymentGrant.continue.access_token.value,
                quoteId: quote.id,
                sendingWalletUrl: sendingWalletAddress.id
            };
        } else {
            // Si el grant se finaliza automáticamente, procede con el pago.
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
async function continueInterledgerPayment({ continueUri, continueAccessToken, quoteId, sendingWalletUrl, privateKey, keyId }) {
    try {
        // ✅ AHORA se usan los parámetros recibidos, no los valores hardcodeados
        const client = await createAuthenticatedClient({
            walletAddressUrl: sendingWalletUrl,
            privateKey: privateKey,
            keyId: keyId
        });

        // 1. Finalizar el grant tras la aprobación del usuario
        const finalizedOutgoingPaymentGrant = await client.grant.continue({
            url: continueUri,
            accessToken: continueAccessToken
        });

        if (!isFinalizedGrant(finalizedOutgoingPaymentGrant)) {
            throw new Error("El grant de pago saliente no se pudo finalizar después de la aprobación.");
        }

        // 2. Obtener la dirección de la wallet emisora
        const sendingWalletAddress = await client.walletAddress.get({ url: sendingWalletUrl });

        // 3. Crear el outgoing payment
        const outgoingPayment = await client.outgoingPayment.create(
            {
                url: sendingWalletAddress.resourceServer, // ✅ usa el resourceServer correcto
                accessToken: finalizedOutgoingPaymentGrant.access_token.value,
            },
            {
                walletAddress: sendingWalletAddress.id,
                quoteId: quoteId,
            }
        );

        console.log("Pago completado exitosamente", { outgoingPayment });
        return { success: true, outgoingPayment };

    } catch (error) {
        console.error("Error al continuar el pago:", error);
        return { success: false, error: error.message };
    }
}


// Exportar ambas funciones para que puedan ser usadas por `payment.cjs`.
export { executeInterledgerPayment, continueInterledgerPayment };

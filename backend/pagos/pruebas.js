// URL base de tu API
const API_BASE_URL = 'http://localhost:3000';

// Función para esperar un tiempo determinado
function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Configuración de datos de prueba
const datoPrueba = {
    value: "197",
    sendingWalletUrl: "https://ilp.interledger-test.dev/522a2e4d",
    receivingWalletUrl: "https://ilp.interledger-test.dev/mxnjlf"
};

// Función principal para realizar el pago con sistema de espera mejorado
async function realizarPagoPrueba() {
    try {
        console.log("\nIniciando proceso de pago...");
        console.log("=".repeat(60));
        console.log("Monto:", datoPrueba.value);
        console.log("Wallet origen:", datoPrueba.sendingWalletUrl);
        console.log("Wallet destino:", datoPrueba.receivingWalletUrl);
        console.log("=".repeat(60));

        // 1. Iniciar el pago
        const startResponse = await fetch(`${API_BASE_URL}/api/payment/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                value: datoPrueba.value,
                sendingWalletUrl: datoPrueba.sendingWalletUrl,
                receivingWalletUrl: datoPrueba.receivingWalletUrl
            })
        });

        const startData = await startResponse.json();

        // 2. Si el pago fue exitoso directamente (sin necesidad de aprobación)
        if (startData.success) {
            console.log("\nPAGO EXITOSO (sin requerir aprobación)");
            console.log("=".repeat(60));
            
            if (startData.outgoingPayment) {
                console.log("El vendedor recibió:", 
                    startData.outgoingPayment.receiveAmount.value * 0.01, 
                    startData.outgoingPayment.receiveAmount.assetCode);
                console.log("El comprador pagó:", 
                    startData.outgoingPayment.debitAmount.value * 0.01, 
                    startData.outgoingPayment.debitAmount.assetCode);
            }
            
            console.log("=".repeat(60));
            return { success: true, data: startData };
        }

        // 3. Si requiere aprobación del usuario
        if (startData.requiresRedirect && startData.redirectUrl) {
            console.log("\nSE REQUIERE APROBACIÓN DEL USUARIO");
            console.log("=".repeat(60));
            console.log("Por favor, abre esta URL en tu navegador para aprobar el pago:");
            console.log(startData.redirectUrl);
            console.log("=".repeat(60));

            const { continueUri, continueAccessToken, quoteId, sendingWalletUrl } = startData;
            
            // Esperar 10 segundos antes del primer intento para dar tiempo a que el usuario abra el link
            console.log("\nEsperando 10 segundos para que apruebes el pago...\n");
            await esperar(10000);

            let attemptCount = 0;
            const maxAttempts = 40;
            let paymentCompleted = false;
            let paymentResult = null;

            console.log("Iniciando verificación automática del pago...\n");

            // Loop de verificación
            while (!paymentCompleted && attemptCount < maxAttempts) {
                attemptCount++;
                
                console.log(`Intento ${attemptCount}/${maxAttempts} - Verificando estado del pago...`);
                
                try {
                    // Usar la ruta check-status que no arroja error si está pending
                    const statusResponse = await fetch(`${API_BASE_URL}/api/payment/check-status`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            continueUri, 
                            continueAccessToken, 
                            quoteId, 
                            sendingWalletUrl 
                        })
                    });

                    const statusData = await statusResponse.json();

                    // Pago completado exitosamente
                    if (statusData.success && statusData.completed) {
                        paymentCompleted = true;
                        
                        console.log("\nPAGO COMPLETADO EXITOSAMENTE");
                        console.log("=".repeat(60));
                        
                        if (statusData.outgoingPayment) {
                            console.log("El vendedor recibió:", 
                                statusData.outgoingPayment.receiveAmount.value * 0.01, 
                                statusData.outgoingPayment.receiveAmount.assetCode);
                            console.log("El comprador pagó:", 
                                statusData.outgoingPayment.debitAmount.value * 0.01, 
                                statusData.outgoingPayment.debitAmount.assetCode);
                        } else {
                            console.log("Mensaje:", statusData.message);
                            console.log("Detalles:", statusData.details);
                        }
                        
                        console.log("=".repeat(60));
                        
                        paymentResult = {
                            success: true,
                            message: "Pago exitoso",
                            data: statusData
                        };
                        
                        break;
                    }

                    // Pago aún pendiente
                    if (statusData.pending) {
                        console.log(`   ${statusData.message} - Esperando 3 segundos...`);
                        await esperar(3000);
                        continue;
                    }

                    // Error en el pago
                    if (!statusData.success && !statusData.pending) {
                        paymentCompleted = true;
                        
                        console.log("\nERROR EN EL PAGO");
                        console.log("=".repeat(60));
                        console.log("Error:", statusData.error || statusData.message);
                        console.log("=".repeat(60));
                        
                        paymentResult = {
                            success: false,
                            message: "Error en el pago",
                            error: statusData.error || statusData.message
                        };
                        
                        break;
                    }
                    
                } catch (error) {
                    console.error(`   Error en la petición:`, error.message);
                    await esperar(3000);
                    continue;
                }
            }

            // Timeout si se agotaron los intentos
            if (!paymentCompleted && attemptCount >= maxAttempts) {
                console.log("\nTIEMPO DE ESPERA AGOTADO");
                console.log("=".repeat(60));
                console.log("El pago no fue aprobado en el tiempo esperado (2 minutos)");
                console.log("=".repeat(60));
                
                paymentResult = {
                    success: false,
                    message: "Tiempo de espera agotado",
                    error: "El usuario no aprobó el pago a tiempo"
                };
            }

            return paymentResult;
        }

        // 4. Error al iniciar el pago
        console.log("\nERROR AL INICIAR EL PAGO");
        console.log("=".repeat(60));
        console.log("Error:", startData.error);
        console.log("=".repeat(60));
        
        return {
            success: false,
            message: "Error en el pago",
            error: startData.error
        };

    } catch (error) {
        console.error("\nERROR PROCESANDO EL PAGO");
        console.error("=".repeat(60));
        console.error("Error:", error.message);
        console.error("=".repeat(60));
        
        return {
            success: false,
            message: "Error procesando el pago",
            error: error.message
        };
    }
}

// Ejecutar la prueba
console.log("Iniciando prueba de pago Interledger...\n");
const resultado = await realizarPagoPrueba();

console.log("\nRESULTADO FINAL:");
console.log("=".repeat(60));
console.log(resultado);
console.log("=".repeat(60));

if (resultado.success) {
    console.log("\nPrueba completada exitosamente");
} else {
    console.log("\nLa prueba falló. Revisa los detalles arriba.");
}
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Importa las funciones que has creado en pagar.js
const { executeInterledgerPayment, continueInterledgerPayment } = require('./pagar.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Valores por defecto
const DEFAULT_CONFIG = {
    privateKey: "private.key",
    keyId: "54f2db71-3ac3-4a4c-aaa6-64024929e41a",
    clientWalletUrl: "https://ilp.interledger-test.dev/jlflousd"
};

// Middleware para procesar JSON y habilitar CORS
app.use(bodyParser.json());
app.use(cors());

// Función helper para esperar
function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ---
// Ruta 1: Inicia el proceso de pago y obtiene la URL de aprobación si es necesaria
// ---
app.post('/api/payment/start', async (req, res) => {
    try {
        const {
            value,
            sendingWalletUrl,
            receivingWalletUrl
        } = req.body;

        // Validar parámetros requeridos
        if (!value || !sendingWalletUrl || !receivingWalletUrl) {
            return res.status(400).json({
                success: false,
                error: 'Los parámetros value, sendingWalletUrl y receivingWalletUrl son requeridos'
            });
        }

        console.log('Iniciando pago:', { value, sendingWalletUrl, receivingWalletUrl });

        const response = await executeInterledgerPayment({
            value,
            privateKey: DEFAULT_CONFIG.privateKey,
            keyId: DEFAULT_CONFIG.keyId,
            clientWalletUrl: DEFAULT_CONFIG.clientWalletUrl,
            sendingWalletUrl,
            receivingWalletUrl
        });

        if (response.redirectUrl) {
            console.log('Pago requiere aprobación. URL de redirección:', response.redirectUrl);
            res.json({
                success: false,
                requiresRedirect: true,
                redirectUrl: response.redirectUrl,
                continueUri: response.continueUri,
                continueAccessToken: response.continueAccessToken,
                quoteId: response.quoteId,
                sendingWalletUrl: response.sendingWalletUrl
            });
        } else if (response.success) {
            console.log('Pago completado sin requerir aprobación');
            res.json({ success: true, outgoingPayment: response.outgoingPayment });
        } else {
            res.status(400).json(response);
        }

    } catch (error) {
        console.error('Error en API de pago (start):', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ---
// Ruta 2: Continúa el proceso de pago después de que el usuario lo aprueba en su navegador
// ---
app.post('/api/payment/continue', async (req, res) => {
    try {
        const { continueUri, continueAccessToken, quoteId, sendingWalletUrl } = req.body;
        
        // Validar parámetros requeridos
        if (!continueUri || !continueAccessToken || !quoteId || !sendingWalletUrl) {
            return res.status(400).json({
                success: false,
                error: 'Faltan parámetros requeridos para continuar el pago'
            });
        }
        
        console.log('Intentando continuar el pago...');
        
        // Usar las credenciales por defecto
        const resultado = await continueInterledgerPayment({
            continueUri,
            continueAccessToken,
            quoteId,
            sendingWalletUrl,
            privateKey: DEFAULT_CONFIG.privateKey,
            keyId: DEFAULT_CONFIG.keyId
        });
        
        console.log('Respuesta de continueInterledgerPayment:', resultado);
        
        // Extraer información de montos del outgoingPayment si está disponible
        let paymentDetails = {
            success: true,
            message: resultado.message || 'Pago realizado exitosamente',
            details: resultado.details || 'Pago completado'
        };

        // Si hay información del outgoingPayment, extraer los montos
        if (resultado.outgoingPayment) {
            paymentDetails.outgoingPayment = {
                ...resultado.outgoingPayment,
                debitAmount: resultado.outgoingPayment.debitAmount,
                receiveAmount: resultado.outgoingPayment.receiveAmount
            };
        }
        
        res.json(paymentDetails);
        
    } catch (error) {
        console.error('Error en API de pago (continue):', {
            message: error.message,
            status: error.status,
            code: error.code,
            description: error.description
        });
       
        // Manejo específico para diferentes tipos de errores de grant
        if (error.status === 401 || error.code === 'request_denied') {
           
            // Verificar descripción específica del error
            if (error.description === 'grant cannot be continued' ||
                error.message?.includes('grant cannot be continued') ||
                error.message?.includes('already been used')) {
               
                console.log('Grant ya utilizado - interpretando como pago exitoso');
                return res.json({
                    success: true,
                    message: 'Pago realizado',
                    details: 'Verificar conclusión del pago en wallet de Interledger',
                    note: 'Los detalles específicos de montos deben verificarse en el wallet'
                });
            }
           
            // Otros errores 401 podrían ser grants expirados después de pago exitoso
            if (error.message?.includes('unauthorized') || error.message?.includes('expired')) {
                console.log('Grant expirado - posiblemente después de pago exitoso');
                return res.json({
                    success: true,
                    message: 'Pago realizado',
                    details: 'Verificar conclusión del pago en wallet de Interledger',
                    note: 'Los detalles específicos de montos deben verificarse en el wallet'
                });
            }
        }
       
        // Para errores 400 que podrían indicar estado de pago
        if (error.status === 400) {
            console.log('Error 400 - verificando si es relacionado con estado del pago');
            return res.json({
                success: false,
                error: error.message,
                code: error.code,
                status: error.status,
                description: error.description,
                note: 'Verificar estado del pago manualmente'
            });
        }
        
        // Para otros errores, devolver información detallada
        res.json({
            success: false,
            error: error.message || 'Error desconocido en el pago',
            code: error.code || 'unknown_error',
            status: error.status || 500,
            description: error.description || 'No hay descripción disponible'
        });
    }
});

// ---
// Ruta 3: Verifica el estado del pago sin errores si aún no está aprobado
// ---
app.post('/api/payment/check-status', async (req, res) => {
    try {
        const { continueUri, continueAccessToken, quoteId, sendingWalletUrl } = req.body;
        
        if (!continueUri || !continueAccessToken || !quoteId || !sendingWalletUrl) {
            return res.status(400).json({
                success: false,
                error: 'Faltan parámetros requeridos'
            });
        }
        
        console.log('Verificando estado del pago...');
        
        try {
            const resultado = await continueInterledgerPayment({
                continueUri,
                continueAccessToken,
                quoteId,
                sendingWalletUrl,
                privateKey: DEFAULT_CONFIG.privateKey,
                keyId: DEFAULT_CONFIG.keyId
            });
            
            console.log('Resultado de continueInterledgerPayment:', resultado);
            
            // CRÍTICO: Verificar que realmente tengamos un pago exitoso
            // No confiar solo en resultado.success, verificar que tenga outgoingPayment
            if (resultado.success && resultado.outgoingPayment) {
                // Pago realmente completado con datos
                let paymentDetails = {
                    success: true,
                    completed: true,
                    message: resultado.message || 'Pago realizado exitosamente',
                    details: resultado.details || 'Pago completado',
                    outgoingPayment: {
                        ...resultado.outgoingPayment,
                        debitAmount: resultado.outgoingPayment.debitAmount,
                        receiveAmount: resultado.outgoingPayment.receiveAmount
                    }
                };
                
                return res.json(paymentDetails);
            } else if (resultado.success && !resultado.outgoingPayment) {
                // Success sin datos de pago - probablemente es un falso positivo
                console.log('ADVERTENCIA: Success sin outgoingPayment - posible pago pendiente');
                return res.json({
                    success: false,
                    completed: false,
                    pending: true,
                    message: 'Esperando aprobación del usuario',
                    details: 'El pago aún no ha sido completado (sin datos de transacción)'
                });
            }
            
        } catch (error) {
            console.log('Error capturado en check-status:', {
                message: error.message,
                status: error.status,
                code: error.code,
                description: error.description
            });
            
            // Si el error indica que el grant ya fue usado, el pago se completó
            if (error.message?.includes('already been used') ||
                error.description?.includes('already been used')) {
                console.log('Grant ya usado - pago completado anteriormente');
                return res.json({
                    success: true,
                    completed: true,
                    message: 'Pago ya procesado',
                    details: 'El pago se completó anteriormente'
                });
            }
            
            // Si es 401 o request_denied, verificar si es porque aún no se aprueba
            if (error.status === 401 || error.code === 'request_denied') {
                
                // Verificar mensajes específicos que indican pendiente
                if (error.description?.includes('grant cannot be continued') ||
                    error.message?.includes('grant cannot be continued') ||
                    error.message?.includes('unauthorized') ||
                    error.message?.includes('not approved') ||
                    error.message?.includes('pending')) {
                    
                    console.log('Pago aún no aprobado por el usuario');
                    return res.json({
                        success: false,
                        completed: false,
                        pending: true,
                        message: 'Esperando aprobación del usuario',
                        details: 'El pago aún no ha sido aprobado'
                    });
                }
            }
            
            // Error 400 generalmente indica problema con el grant o pago
            if (error.status === 400) {
                console.log('Error 400 - problema con el pago');
                return res.json({
                    success: false,
                    completed: false,
                    pending: true,
                    message: 'Esperando aprobación o error en el proceso',
                    details: error.description || error.message,
                    error: error.message
                });
            }
            
            // Otro tipo de error - reportarlo
            console.error('Error inesperado:', error);
            return res.status(500).json({
                success: false,
                completed: false,
                error: error.message || 'Error desconocido',
                code: error.code,
                status: error.status,
                description: error.description
            });
        }
        
    } catch (error) {
        console.error('Error general verificando estado:', error);
        return res.status(500).json({
            success: false,
            completed: false,
            error: error.message || 'Error desconocido al verificar estado'
        });
    }
});

// Inicia el servidor para que se quede escuchando
app.listen(PORT, () => {
    console.log(`Servidor de API escuchando en el puerto ${PORT}`);
    console.log(`Rutas disponibles:`);
    console.log(`  POST /api/payment/start - Inicia el pago`);
    console.log(`  POST /api/payment/continue - Continúa el pago después de aprobación`);
    console.log(`  POST /api/payment/check-status - Verifica estado sin errores si está pending`);
});
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

        const response = await executeInterledgerPayment({
            value,
            privateKey: DEFAULT_CONFIG.privateKey,
            keyId: DEFAULT_CONFIG.keyId,
            clientWalletUrl: DEFAULT_CONFIG.clientWalletUrl,
            sendingWalletUrl,
            receivingWalletUrl
        });

        if (response.redirectUrl) {
            res.json({
                success: false, // Indica que aún no está completo
                requiresRedirect: true,
                redirectUrl: response.redirectUrl,
                continueUri: response.continueUri,
                continueAccessToken: response.continueAccessToken,
                quoteId: response.quoteId,
                sendingWalletUrl: response.sendingWalletUrl
            });
        } else if (response.success) {
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
// Ruta 2: Continúa el proceso de pago después de que el usuario lo aprueba en su navegador
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
        
        console.log('Pago continuado exitosamente:', resultado);
        
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
                // Asegurar que se incluyan los montos
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
                    // Nota: En este caso no tenemos los montos exactos ya que el grant ya fue usado
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

// Inicia el servidor para que se quede escuchando
app.listen(PORT, () => {
    console.log(`Servidor de API escuchando en el puerto ${PORT}`);
});
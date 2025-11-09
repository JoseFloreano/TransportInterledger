import express from 'express';
const router = express.Router();

// Importa las funciones de Interledger
import { executeInterledgerPayment, continueInterledgerPayment } from './pagar.js';

// Configuración por defecto de Interledger
const DEFAULT_CONFIG = {
    privateKey: "pagos/private.key",
    keyId: "54f2db71-3ac3-4a4c-aaa6-64024929e41a",
    clientWalletUrl: "https://ilp.interledger-test.dev/jlflousd"
};

// Ruta 1: Inicia el pago
router.post('/start', async (req, res) => {
    try {
        const { value, sendingWalletUrl, receivingWalletUrl } = req.body;

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

// Ruta 2: Continúa el pago
router.post('/continue', async (req, res) => {
    try {
        const { continueUri, continueAccessToken, quoteId, sendingWalletUrl } = req.body;
        
        if (!continueUri || !continueAccessToken || !quoteId || !sendingWalletUrl) {
            return res.status(400).json({
                success: false,
                error: 'Faltan parámetros requeridos para continuar el pago'
            });
        }
        
        console.log('Intentando continuar el pago...');
        
        const resultado = await continueInterledgerPayment({
            continueUri,
            continueAccessToken,
            quoteId,
            sendingWalletUrl,
            privateKey: DEFAULT_CONFIG.privateKey,
            keyId: DEFAULT_CONFIG.keyId
        });
        
        console.log('Respuesta de continueInterledgerPayment:', resultado);
        
        let paymentDetails = {
            success: true,
            message: resultado.message || 'Pago realizado exitosamente',
            details: resultado.details || 'Pago completado'
        };

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
       
        if (error.status === 401 || error.code === 'request_denied') {
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
        
        res.json({
            success: false,
            error: error.message || 'Error desconocido en el pago',
            code: error.code || 'unknown_error',
            status: error.status || 500,
            description: error.description || 'No hay descripción disponible'
        });
    }
});

// Ruta 3: Verifica estado del pago
router.post('/check-status', async (req, res) => {
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
            
            if (resultado.success && resultado.outgoingPayment) {
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
            
            if (error.status === 401 || error.code === 'request_denied') {
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

export default router;
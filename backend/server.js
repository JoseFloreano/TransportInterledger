import dbApp from "./bd/connect_db.js";
import paymentRoutes from "./pagos/payment.js";

const PORT = process.env.PORT || 80;

// Monta las rutas de payment bajo /api/payment
dbApp.use('/api/payment', paymentRoutes);

// Inicia el servidor
dbApp.listen(PORT, () => {
    console.log(`\n🚀 Servidor unificado escuchando en el puerto ${PORT}`);
    console.log(`\n📦 Rutas de Base de Datos:`);
    console.log(`  GET    /db/health`);
    console.log(`  *      /db/transaccion/*`);
    console.log(`  *      /db/usuario/*`);
    console.log(`  *      /db/wallet/*`);
    console.log(`  *      /db/producto/*`);
    console.log(`\n💳 Rutas de Interledger Payment:`);
    console.log(`  POST   /api/payment/start`);
    console.log(`  POST   /api/payment/continue`);
    console.log(`  POST   /api/payment/check-status\n`);
});

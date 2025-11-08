// Importar la función
import { executeInterledgerPayment } from './pagar.js';

// Usar la función
const resultado = await executeInterledgerPayment({
    value: "97", // Monto que quieres enviar
    privateKey: "private.key",
    keyId: "54f2db71-3ac3-4a4c-aaa6-64024929e41a",
    clientWalletUrl: "https://ilp.interledger-test.dev/jlflousd",
    sendingWalletUrl: "https://ilp.interledger-test.dev/522a2e4d", 
    receivingWalletUrl: "https://ilp.interledger-test.dev/jlflousd"
});

if (resultado.success) {
    console.log("¡Pago exitoso!");
    console.log("El vendedor recibio: ", resultado.outgoingPayment.receiveAmount.value * .01, resultado.outgoingPayment.receiveAmount.assetCode);
    console.log("El comprador pago: ", resultado.outgoingPayment.debitAmount.value * .01, resultado.outgoingPayment.debitAmount.assetCode);
} else {
    console.log("Error:", resultado.error);
}
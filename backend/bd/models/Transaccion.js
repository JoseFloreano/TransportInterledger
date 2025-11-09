import mongoose from "mongoose";


// Schema de Transaccion
const transaccionSchema = new mongoose.Schema({
  id_wallet_origen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  id_wallet_destino: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  valor: {
    type: Number
  }
}, {
  timestamps: true
});

export const Transaccion = mongoose.model('Transaccion', transaccionSchema);
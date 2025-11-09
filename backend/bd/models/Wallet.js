import mongoose from 'mongoose';
// Schema de Wallet
const walletSchema = new mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  nombre: {
    type: String
  },
  url: {
    type: String,
    unique: true
  },
  default: {
    type: Boolean,
    default: false
  },
  tipo: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});


export const Wallet = mongoose.model('Wallet', walletSchema);

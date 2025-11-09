import mongoose from "mongoose";


// Schema de Producto
const productoSchema = new mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  nombre: {
    type: String
  },
  precio: {
    type: Number
  }
}, {
  timestamps: true
});

export const Producto = mongoose.model('Producto', productoSchema);
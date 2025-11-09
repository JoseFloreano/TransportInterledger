import mongoose from "mongoose";

// Schema de Usuario
const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
    unique: true
  },
  contrasena: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});




// Exportar modelos
export const Usuario = mongoose.model('Usuario', usuarioSchema);

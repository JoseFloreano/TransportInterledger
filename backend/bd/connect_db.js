import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productoRoutes from "./routes/productoRoutes.js";
import transaccionRoutes from "./routes/transaccionRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

const app = express();

// Configuración de CORS
app.use(cors({
  origin: [
    'http://localhost:3000',  // Backend (si tienes frontend en otro puerto)
    'http://localhost:3001',  // React dev server común
    'http://localhost:5173',  // Vite dev server
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-token']
}));

// Middleware para parsing JSON
app.use(express.json());

// Conexión a MongoDB
mongoose.connect("url")
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch(err => console.error("❌ Error de conexión:", err));

// Rutas
app.use("/transaccion", transaccionRoutes);
app.use("/usuario", usuarioRoutes);
app.use("/wallet", walletRoutes);
app.use("/producto", productoRoutes);

// Ruta de prueba para verificar CORS
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Backend con CORS funcionando",
    timestamp: new Date().toISOString()
  });
});

export default app;
import app from "./connect_db.js";

const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

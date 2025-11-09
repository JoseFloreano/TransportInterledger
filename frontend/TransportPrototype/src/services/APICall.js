const API_URL = "https://096a0eaaea59.ngrok-free.app/db/";

async function apiCall(endpoint, method = "GET", body = null) {
  const options = { method, headers: {} };

  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, options);
    const text = await res.text(); // leer como texto primero
    let data;

    try {
      data = JSON.parse(text); // intentar parsear JSON
    } catch {
      console.error("Respuesta no es JSON:", text);
      throw new Error("El servidor no devolvió JSON");
    }

    if (!res.ok) throw new Error(data.message || "Error en la API");
    return data;
  } catch (err) {
    console.error("Error en apiCall:", err);
    throw err;
  }
}

export { apiCall };
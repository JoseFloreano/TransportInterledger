const API_URL = "https://096a0eaaea59.ngrok-free.app/db/"; // ⚠️ Verifica si tu backend usa /db/ o no

async function apiCall(endpoint, method = "GET", body = null) {
  const options = { method, headers: {} };

  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const fullURL = `${API_URL}${endpoint}`;
  
  try {
    console.log('🔗 URL completa:', fullURL);
    console.log('📤 Método:', method);
    if (body) console.log('📦 Body:', body);
    
    const res = await fetch(fullURL, options);
    console.log('📥 Status:', res.status);
    
    const text = await res.text();
    console.log('📄 Respuesta raw:', text);
    
    let data;

    try {
      data = JSON.parse(text);
      console.log('✅ JSON parseado:', data);
    } catch (parseError) {
      console.error("❌ Respuesta no es JSON:", text);
      throw new Error("El servidor no devolvió JSON");
    }

    if (!res.ok) {
      console.error('❌ Error HTTP:', res.status, data);
      throw new Error(data.message || data.error || "Error en la API");
    }
    
    return data;
  } catch (err) {
    console.error("❌ Error en apiCall:", err.message);
    throw err;
  }
}

export { apiCall };
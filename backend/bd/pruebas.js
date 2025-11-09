const API_URL = "https://096a0eaaea59.ngrok-free.app/db"; 


// --- Función de Ayuda para API ---
/**
 * Realiza una llamada fetch y maneja las respuestas y errores.
 * @param {string} endpoint - El endpoint de la API (ej. /usuario)
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
 * @param {object|null} body - El cuerpo (body) de la solicitud
 * @returns {Promise<any>} - Los datos JSON de la respuesta
 */
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {},
  };

  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, options);
    const data = await res.json();

    if (!res.ok) {
      // Si la respuesta no es 2xx, lanza un error con el detalle del backend
      throw new Error(`Error ${res.status} en ${method} ${endpoint}: ${data.detalle || data.error || data.message}`);
    }
    
    return data; // Retorna los datos si todo fue bien

  } catch (error) {
    console.error("Error en apiCall:", error.message);
    // Propaga el error para detener la ejecución de la prueba
    throw error;
  }
}

async function probarIntegracionCompleta(){
    const res = await apiCall('/health');
    console.log(res);

    const usuario_ejemplo = {
        "correo": "1@1.com",
        "contrasena": "1234",
        "nombre": "Ejemplo",
        "rol": "seller"
    };

    const res2 = await apiCall('/usuario', 'POST', usuario_ejemplo);
    console.log(res2);

    const res3 = await apiCall('/usuario', 'GET');
    console.log(res3);
    }

probarIntegracionCompleta();
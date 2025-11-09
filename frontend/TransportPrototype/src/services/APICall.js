import { useEffect } from "react";

const API_URL = "https://096a0eaaea59.ngrok-free.app/db/";

async function apiCall(endpoint, method = "GET", body = null) {
  const options = { method, headers: {} };

  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error en la API");
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default apiCall;
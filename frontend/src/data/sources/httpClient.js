// Cliente HTTP básico usando fetch

export async function httpPost(url, body, extraHeaders = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let msg = "Error en solicitud POST";
    try {
      const data = await res.json();
      msg = data.message || data.error || msg;
    } catch {
      // ignoramos error parseando JSON
    }
    throw new Error(msg);
  }

  return res.json();
}

export async function httpGet(url) {
  const res = await fetch(url);

  if (!res.ok) {
    let msg = "Error en solicitud GET";
    try {
      const data = await res.json();
      msg = data.message || data.error || msg;
    } catch {
      // ignoramos error parseando JSON
    }
    throw new Error(msg);
  }

  return res.json();
}

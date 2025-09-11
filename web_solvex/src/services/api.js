const BASE = "http://172.16.205.27:5000";

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 204) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const api = {
  listar: () => req("/api/sensores"),
  ultimo: () => req("/api/sensores/ultimo"),
  penultimo: () => req("/api/sensores/penultimo"),
  crear: (payload) => req("/api/sensores", { method: "POST", body: JSON.stringify(payload) }),
};

export async function getUltimo() {
  const res = await fetch(`${BASE}/api/sensores/ultimo`);
  if (res.status === 204) return null; // sin datos
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getPenultimo() {
  const res = await fetch(`${BASE}/api/sensores/penultimo`);
  if (res.status === 204) return null; // sin datos
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default { getUltimo, getPenultimo }; // ✅ export default
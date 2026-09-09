// Esta función es la "base de datos" del proyecto.
// Usa Netlify Blobs, un almacenamiento incluido gratis en cualquier sitio de Netlify
// (no necesitas crear cuenta en otro servicio ni configurar nada aparte).
//
// GET  /api/entries   -> devuelve el registro guardado
// POST /api/entries   -> guarda el registro completo (reemplaza el anterior)

import { getStore } from "@netlify/blobs";

const DEFAULT_STATE = {
  startDate: "2026-09-01",
  entries: {}
};

export default async (req) => {
  const store = getStore("gantt-tec");

  if (req.method === "GET") {
    const data = await store.get("state", { type: "json" });
    return new Response(JSON.stringify(data || DEFAULT_STATE), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      await store.setJSON("state", body);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: String(err) }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return new Response("Método no permitido", { status: 405 });
};

// Esto hace que la función responda en /api/entries en vez de la ruta larga
// /.netlify/functions/entries
export const config = {
  path: "/api/entries"
};

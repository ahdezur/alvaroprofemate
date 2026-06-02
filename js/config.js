// Configuración del sitio web Álvaro Profemate
const CONFIG = {
  // Credenciales de administración para pruebas locales (LocalStorage)
  // Nota: En producción (Netlify), define las variables de entorno ADMIN_USER y ADMIN_PASS
  // desde tu panel de Netlify. Esas variables tendrán prioridad sobre estas.
  ADMIN_USER: "admin",
  ADMIN_PASS: "admin123",

  // Endpoint de la API Serverless (Netlify Functions)
  // Cuando se despliega en Netlify, esta ruta (/api/posts) apunta automáticamente a Postgres.
  // Localmente, si no levantas Netlify CLI, el sistema lo detectará y usará LocalStorage.
  API_URL: "/api/posts",

  // Configuración heredada de Supabase (Si prefieres usar Supabase en vez de Postgres, colócalas aquí)
  SUPABASE_URL: "",
  SUPABASE_KEY: ""
};

// Exportar la configuración para uso global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  window.CONFIG = CONFIG;
}

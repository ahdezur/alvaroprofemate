// Configuración del sitio web Álvaro Profemate
const CONFIG = {
  // Credenciales de administración para el panel (/admin.html)
  // Se recomienda cambiarlas antes de subir a producción
  ADMIN_USER: "admin",
  ADMIN_PASS: "admin123",

  // Configuración de Supabase (Opcional)
  // Si se dejan vacíos, el sistema guardará las lecturas localmente en el navegador (LocalStorage)
  // Para producción, crea un proyecto en Supabase, crea una tabla llamada 'posts' y coloca aquí los datos.
  SUPABASE_URL: "",
  SUPABASE_KEY: ""
};

// Exportar la configuración para uso global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  window.CONFIG = CONFIG;
}

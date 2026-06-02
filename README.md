# Álvaro Hernández – Profesor de Matemáticas (Sitio Web Corporativo)

Este es el repositorio del sitio web corporativo del Profesor Álvaro Hernández, listo para montar en **Netlify** con una base de datos **Netlify PostgreSQL** integrada.

## Características

*   **Diseño Premium y Responsivo:** Diseñado desde cero con variables CSS3, gradientes modernos y efectos de vidrio (*glassmorphism*).
*   **Gestión de Lecturas (Blog):** Panel de administración privado (`/admin.html`) para crear, editar y eliminar publicaciones.
*   **Editor Enriquecido con Modo HTML:** Permite alternar entre edición visual sencilla e inserción directa de código HTML (videos de YouTube, widgets, scripts interactivos o GeoGebra).
*   **Arquitectura Serverless Híbrida:**
    *   **Modo Local:** Si se abre el sitio sin conexión o sin Netlify, utiliza `LocalStorage` para pruebas rápidas.
    *   **Modo Producción:** Conectado a una base de datos PostgreSQL en la nube a través de **Netlify Serverless Functions**.

## Estructura del Proyecto

```text
├── index.html          # Vista principal de la Landing Page
├── admin.html          # Portal privado del Administrador
├── netlify.toml        # Redirecciones de API y configuración de Netlify
├── package.json        # Dependencias de compilación de funciones (pg client)
├── css/
│   └── style.css       # Hoja de estilos premium
├── js/
│   ├── config.js       # Endpoints de API y credenciales de fallback
│   ├── db.js           # Capa de datos híbrida (Postgres / LocalStorage)
│   ├── app.js          # Controladores interactivos de la Landing Page
│   └── admin.js        # Controladores del panel de administración
└── netlify/
    └── functions/
        └── posts.js    # API Endpoint en Node.js que conecta a Postgres
```

## Instrucciones de Despliegue en Netlify

1.  **Conecta tu repositorio:** Vincula esta rama a un nuevo sitio en Netlify.
2.  **Configura las Variables de Entorno:**
    *   `ADMIN_USER`: Nombre de usuario para el panel administrativo.
    *   `ADMIN_PASS`: Contraseña de acceso para el panel.
3.  **Habilita Netlify PostgreSQL:** Agrega la integración oficial desde el panel de Netlify. Esto creará una base de datos serverless e inyectará la variable `DATABASE_URL`.
4.  **¡Listo!** El sistema creará las tablas necesarias en la base de datos de manera automática en el primer acceso.

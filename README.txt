TOQUE SMART ENTREGAS — MVP v1

FUNCIONES
- Crear y guardar entregas localmente.
- Listado de borradores recientes.
- Recorrido por pasos: proyecto, sistemas, verificación, pendientes, términos y firmas.
- Foto personalizada o imagen predeterminada.
- Firma con dedo o Apple Pencil.
- Vista previa final de 5 páginas.
- Imprimir / guardar como PDF.
- Compartir el documento desde el iPad.
- Abrir un correo al cliente con copia a soporte@toquesmart.com.
- PWA instalable y funcionamiento offline cuando se publica por HTTPS.

ARCHIVOS
- index.html: aplicación principal.
- app.js / styles.css: lógica y diseño.
- manifest.webmanifest / sw.js: instalación como PWA.
- standalone.html: versión de un solo archivo para probar localmente.
- assets/: logos, imagen predeterminada e íconos.

INSTALACIÓN EN IPAD
1. Publicar la carpeta completa en Netlify, Vercel o cualquier servidor HTTPS.
2. Abrir la URL en Safari.
3. Compartir > Añadir a pantalla de inicio.

LIMITACIÓN DE V1
El envío automático del PDF adjunto requiere un backend seguro. Esta versión abre el correo dirigido al cliente con copia a soporte y permite imprimir/compartir el documento. Nunca se deben guardar claves de correo dentro del HTML.

DATOS
Los borradores se guardan mediante localStorage en el dispositivo. No se sincronizan entre equipos hasta conectar un backend.

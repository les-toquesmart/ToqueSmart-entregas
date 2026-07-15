# Toque Smart Entregas

Aplicación React + TypeScript + Tailwind CSS para recorridos de entrega en iPad.

## Incluye

- PWA instalable y offline.
- Borradores en IndexedDB.
- Eliminación de borradores.
- Recorrido por pasos.
- Firma con Apple Pencil o dedo.
- Documento premium de 5 páginas.
- PDF multipágina con jsPDF + html2canvas.
- GitHub Actions para despliegue automático a GitHub Pages.
- Ejemplo de endpoint de correo con Resend.

## Desarrollo local

```bash
npm install
npm run dev
```

Node.js 22 recomendado.

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages

1. Subir el repositorio a GitHub.
2. En **Settings → Pages**, seleccionar **GitHub Actions** como fuente.
3. Cada push a `main` ejecutará `.github/workflows/deploy.yml`.

## Email automático

GitHub Pages no ejecuta backend. El ejemplo `api/send-delivery.ts` puede desplegarse en Vercel.
Configurar:

- `RESEND_API_KEY`
- `FROM_EMAIL` con dominio verificado

Luego conectar el frontend al endpoint para enviar el PDF al cliente y copiar a `soporte@toquesmart.com`.

## Estado de esta entrega

Esta es la primera base profesional. La siguiente iteración debe conectar el PDF generado al endpoint de correo y añadir autenticación/sincronización central.

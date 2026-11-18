# Luvania

Sitio de Luvania, red de clínicas estéticas en Bogotá (marca de CIFES). Experimento B: catálogo navegable, ficha por tratamiento y agenda por WhatsApp.

## Cómo correrlo

```bash
npm install
npm run check
npm run dev
```

El servidor de desarrollo queda en el puerto que indique Next. Para un puerto fijo:

```bash
npx next dev -p 43123
```

## Datos

Los tratamientos, sedes, ofertas y textos viven en `src/data`. Lo que el equipo médico o comercial debe confirmar está marcado con `TODO` en `src/data/site.ts` (`clientTodos`) y en cada sede (`todo`).

Las 18 ofertas usan los precios del rastreo del 17 de noviembre de 2026. No hay backend: el formulario abre WhatsApp con el mensaje armado.

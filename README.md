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

Los tratamientos, sedes, ofertas y textos viven en `src/data`. Cada ficha tiene `status`: `VERIFIED` (publicado en luvania.com), `NEEDS_REVIEW` (fuera del inventario o ficha incompleta; `noindex` y fuera del sitemap) o, en el caso de `x`, `ARCHIVED` con respuesta 410. La matriz está en `src/data/revision.json`.

Teléfonos y WhatsApp por sede, el webhook de leads y GA4 se configuran en `.env.example`. Si no hay variable, se usa el número ya publicado.

Las 18 ofertas usan los precios del rastreo del 17 de noviembre de 2026. No hay backend: el formulario abre WhatsApp con el mensaje armado.

## Fotos de tratamientos

Cada ficha puede tener una foto propia. Si el campo no está, la ficha, las tarjetas y las promociones muestran un marco de marca. No se inventan fotos de antes y después.

1. Guarda el archivo en `public/tratamientos/{slug}.webp`. El nombre es el slug del tratamiento. Ejemplo: `public/tratamientos/hidrolipoclasia.webp`.
2. En `src/data/treatments.json`, dentro de ese tratamiento, agrega:

```json
"image": "/tratamientos/hidrolipoclasia.webp"
```

La ruta empieza con `/` y coincide con el archivo de `public/`. Una sola imagen por tratamiento, la del protocolo, no un antes/después.

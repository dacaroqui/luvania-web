# Palabras clave — 19 de noviembre de 2026

Fuente: Google Trends, `today 12-m` (19 nov 2025 – 19 nov 2026), geos `CO` y `CO-DC` (Bogotá). Los números son interés relativo de 0 a 100 **dentro de cada consulta de cinco términos**, no volúmenes de búsqueda. Para comparar lotes, cada consulta incluye `botox` y el interés se expresa como media del término / media de `botox` en esa misma consulta. Datos crudos: [trends-2026-11-19.json](./trends-2026-11-19.json).

Las consultas relacionadas y «en aumento» no se obtuvieron: ese endpoint respondió 429 después de las series. No hay volúmenes inventados.

`botox` y `ácido hialurónico` bajan del primer al último trimestre y siguen siendo los términos de marca estética más altos. Un movimiento de 0 a 0.15 en términos casi en cero es ruido y no se describe como tendencia.

## Las siete guías de la primera tanda

| Orden | Ficha | Keyword principal | Interés CO / botox | Interés Bogotá / botox | Por qué entra |
| --- | --- | --- | --- | --- | --- |
| 1 | Toxina botulínica tipo A | botox | 1.00 | 1.00 | Ancla de la consulta. El nombre médico, «toxina botulínica», queda en 0.12 (CO) y 0.03 (Bogotá). |
| 2 | Acné | acne | 2.32 | 2.31 | En la misma consulta supera a botox. Es un síntoma amplio, no solo el protocolo de la ficha. |
| 3 | Eliminar ojeras | ojeras | 0.89 | 0.80 | Segundo término estético, detrás de botox y del ácido hialurónico en Bogotá. |
| 4 | Aumento y/o perfilamiento de labios | acido hialuronico | 0.87 | 0.83 | No hay ficha vieja llamada ácido hialurónico. Labios es el procedimiento que el archivo anterior asociaba a ese material. |
| 5 | Celulitis | celulitis | 0.85 | 0.66 | Alto en el país. «Tratamiento celulitis» queda en 0.01. |
| 6 | Levantamiento de glúteos | gluteos | 0.69 | 0.56 | Consulta amplia: también incluye ejercicio. Se usa como pista de demanda, no como nombre del protocolo. |
| 7 | Hair loss | caida del cabello | 0.33 | 0.25 | En CO queda apenas sobre papada (0.31). En Bogotá papada (0.28) queda sobre caída (0.25). Se prioriza la ficha capilar por el archivo más largo (2899 palabras frente a 1605 de papada). Papada es la siguiente guía. |

Depilación láser mide 0.27 en CO y 0.25 en Bogotá, pero no está entre las 41 páginas archivadas. No se redacta guía para no inventar clínica.

## Tabla de fichas con guía

| Tratamiento | Keyword principal | Secundarias observadas | CO | Bogotá | Dirección (solo si la media es > 2) |
| --- | --- | --- | --- | --- | --- |
| Toxina botulínica tipo A | botox | toxina botulinica, botox bogota | 1.00 | 1.00 | Baja: 81.7 → 66.1 en CO |
| Acné | acne | tratamiento del acne | 2.32 | 2.31 | Baja leve: 58.9 → 52.7 en CO |
| Eliminar ojeras | ojeras | reducir ojeras (0 en ambas geos) | 0.89 | 0.80 | Estable en CO (64.5 → 64.2) |
| Labios | acido hialuronico | relleno de labios (0.001 CO, 0 Bogotá) | 0.87 | 0.83 | Baja: 71.7 → 56.1 en CO |
| Celulitis | celulitis | tratamiento celulitis (0.01) | 0.85 | 0.66 | Estable en CO (21.8 → 21.7) |
| Levantamiento de glúteos | gluteos | — | 0.69 | 0.56 | Baja: 52.1 → 45.1 en CO |
| Hair loss | caida del cabello | — | 0.33 | 0.25 | Estable en CO (9.0 → 8.5) |

Otras pistas, sin guía en esta tanda: papada 0.31 / 0.28, limpieza facial 0.29 / 0.22, dermapen 0.22 / 0.06, hidroxiapatita 0.09 / 0.02, hiperhidrosis 0.09 / 0.01, plasma rico en plaquetas 0.08 / 0.03, lifting facial 0.08 / 0.02, hilos tensores 0.06 / 0.01, rinomodelación 0.04 / 0.00. «Hilos rusos», «prp facial» y «reducir ojeras» midieron 0.

## Títulos

El H1 visible de la ficha sigue siendo el nombre del tratamiento. El `<title>` se diferencia cuando chocaba con una página de necesidad:

| Página | Title |
| --- | --- |
| Ficha acné | Tratamiento del acné en Bogotá \| Luvania |
| Necesidad acné | Acné: cómo se valora \| Luvania |
| Ficha ojeras | Ojeras: valoración en Bogotá \| Luvania |
| Necesidad ojeras | Ojeras y mirada cansada \| Luvania |
| Ficha celulitis | Celulitis: protocolo en Bogotá \| Luvania |
| Necesidad celulitis | Celulitis en piernas y glúteos \| Luvania |
| Ficha caída | Caída del cabello: protocolo \| Luvania |
| Necesidad caída | Caída del cabello: primeras pistas \| Luvania |
| Ficha manchas | Manchas en la piel, Bogotá \| Luvania |
| Necesidad manchas | Manchas: por dónde empezar \| Luvania |

Las siete guías usan un title propio, distinto de la ficha y de la necesidad. Ver `src/data/guides/batch.ts`.

## Propuesta, sin aplicar

El orden del catálogo y del mega menú se deja como está en el mockup. Si más adelante se reordena por demanda observada, el orden sugerido de los protocolos con guía es: toxina (bajo la palabra botox), acné, ojeras, labios, celulitis, glúteos, caída del cabello, y enseguida papada, limpieza facial y dermapen. En el mega menú, «Botox» puede aparecer como alias visible de toxina botulínica, y «Ácido hialurónico» como alias de labios, sin cambiar el nombre clínico de la ficha.

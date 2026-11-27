# Luvania · Diagnóstico SEO, AEO y SEM

Revisión del 25 de noviembre de 2026, hora de Colombia.

## Estado del dominio público

| Comprobación HTTP | Resultado | Acción |
| --- | --- | --- |
| `/robots.txt` | 200 | Confirmar la regla de OAI-SearchBot y el acceso en el CDN tras el despliegue. |
| `/sitemap.xml` y `/blog` | 404 | Validar las nuevas rutas en el dominio público y enviar el sitemap en Search Console. |
| Fichas de perfilamiento maxilar, papada e hilos tensores | 200 | Conservar las URL y los canónicos durante la migración. |
| Guías del rediseño | Revisión médica pendiente | Revisar autoría, fuentes y afirmaciones por guía. Registrar quién revisó y la fecha antes de publicar. |

El PR conserva la autorización explícita a OAI-SearchBot, el sitemap con `/blog` y el noindex del preview. El sitemap de las guías incorpora la URL de su imagen cuando la guía está aprobada. La medición pública de rendimiento, cobertura e indexación está pendiente del despliegue y de los datos de Search Console.

## Prioridad editorial y búsqueda pagada

La prioridad combina fichas verificadas de Luvania, preguntas observadas en resultados para Bogotá y la posibilidad de responder una intención distinta en cada guía. La consulta de series de Google Trends para Colombia devolvió HTTP 429. La priorización de la tabla es cualitativa y queda pendiente contrastarla con un export de Trends y Keyword Planner.

| Guía nueva | Consulta objetivo | Preguntas secundarias para SEO y AEO | Prueba SEM en la ficha verificada |
| --- | --- | --- | --- |
| Perfilamiento mandibular | perfilamiento mandibular Bogotá | Perfilamiento maxilar, mandíbula y mentón, cómo se cotiza, riesgos del relleno. | Concordancia exacta o de frase en consultas locales de valoración. |
| Papada sin cirugía | papada sin cirugía Bogotá | Qué se valora bajo el mentón, grasa frente a firmeza, sesiones y presupuesto. | Grupo propio de papada. Separar intención quirúrgica de la valoración ofrecida. |
| Hilos tensores faciales | hilos tensores faciales Bogotá | Duración, recuperación, riesgos, diferencia frente a lifting quirúrgico. | Grupo propio de hilos. Medir solicitudes de valoración por término. |

[Comparación preparada en Google Trends para Colombia, últimos 12 meses](https://trends.google.com/trends/explore?date=today%2012-m&geo=CO&q=papada,perfilamiento%20mandibular,hilos%20tensores&hl=es). Exportar las mismas series para Bogotá si hay datos suficientes. El índice 0-100 es relativo al conjunto comparado. Para dimensionar SEM, usar un export de Keyword Planner segmentado a Bogotá con promedio mensual, competencia y rangos de puja. Conservar fecha, geografía y periodo de cada export.

## Implementación editorial y visual

- Tres guías ilustradas con respuestas breves bajo encabezados descriptivos, nueve preguntas frecuentes en total, títulos y metadescripciones por URL, referencias y enlaces a sus fichas. Las consultas secundarias orientan la redacción.
- Tres imágenes WebP de 1200 × 800, alt descriptivo en la guía, pie de foto visible y marcado Article con la imagen. La imagen de la tarjeta comparte enlace con el título. Las imágenes ilustrativas se identifican como generadas con IA.
- Revisar el contenido clínico y las fuentes antes de marcar cada guía como aprobada. Mantener las fichas como entrada local y usar las guías para responder dudas en detalle.
- Tras el despliegue, verificar canónicos, estado HTTP, JSON-LD y carga de imágenes en móvil. Medir Core Web Vitals con datos de campo cuando estén disponibles.

## Medición inicial

En Search Console comparar impresiones, clics, CTR y consultas por URL. En ChatGPT Search repetir las tres consultas locales y una pregunta por artículo, y registrar fecha y fuente citada. En SEM medir términos reales de búsqueda y coste por valoración válida. Activar una campaña requiere acceso a la cuenta, medición de conversión y presupuesto autorizado.

## Fuentes de metodología

- [Google Trends · Preguntas frecuentes sobre los datos](https://support.google.com/trends/answer/4365533?hl=es)
- [Google Ads · Planificador de palabras clave](https://support.google.com/google-ads/answer/7337243)
- [Google Search Central · SEO para imágenes](https://developers.google.com/search/docs/appearance/google-images)
- [OpenAI · Rastreadores](https://developers.openai.com/api/docs/bots)

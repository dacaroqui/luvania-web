# Tono editorial de las guías

Esta es la pauta para `/tratamientos/[slug]/guia`, para `/blog` y para cualquier guía que se escriba después. Las siete primeras siguen en `medicalReview: pendiente` hasta que un médico las firme. Mientras tanto se ven en el preview, con el aviso «Contenido en revisión médica», y en producción la ruta responde 404.

## Voz

Escribe como un médico que enseña, del modo en que un profesor le explica algo a un paciente. Primero el concepto. Después, en sencillo: qué pasa en la piel o en el cuerpo, por qué funciona, qué se puede esperar y qué no hace.

Persuade por comprensión. Una persona que entiende el mecanismo decide mejor que una persona a la que le prometieron un resultado.

- Español de Colombia, segunda persona del singular (`tu`, `te`, `tu cara`).
- Cálido y claro. Frases cortas. Una idea por oración cuando el mecanismo se pone denso.
- Se puede usar el nombre con el que la gente busca (`bótox`) y, enseguida, el nombre del fármaco o del tejido.
- No vendas. No uses «tiempo récord», «piel nueva», «sin riesgo», «resultado garantizado» ni un porcentaje de mejoría de la clínica.

## Qué se afirma y qué se suelta

Cada afirmación de mecanismo, origen, plazo o efecto tiene que apoyarse en una fuente real: una revisión con revisión por pares, una sociedad de dermatología (AAD u otra equivalente) o un etiquetado de la FDA o de INVIMA.

- La sección `Referencias` lleva el título, quién publica y el enlace. Antes de publicar, abre cada URL y confirma que responde. La fecha de consulta va en la página.
- No inventes estudios, autores, cifras, citas entre comillas ni números de registro.
- Si dos fuentes dan plazos distintos, di las dos y di que ninguna es la fecha de esa persona. El control mira el caso.
- Si una afirmación no se puede sostener, se quita o se suaviza («se confirma en la valoración», «la ficha no cierra la marca»).
- No copies dosis del etiquetado como si fueran el protocolo de Luvania. Las unidades de una marca no se convierten a las de otra.
- No repitas el texto de una página vieja como si fuera instrucción vigente. El archivo está en `content/legacy/` y no se renderiza.
- El consentimiento y los textos legales siguen su propio documento. Esta pauta no los reemplaza.

## Estructura que no se rompe

Cada guía conserva los bloques que la ficha ya enlaza: `que-es`, `como-funciona`, `procedimiento`, `preparacion`, `cuidados`, `efectos`, `sesiones`, `cuando-consultar`. Los cuatro del medio llevan `card`, porque esa frase es la que sale en la ficha.

Siguen el índice lateral, las preguntas frecuentes con schema `FAQPage`, el enlace a la ficha y el schema `Article` con `citation` hacia las referencias. `medicalReview` se queda en `pendiente` hasta la firma. No entran al sitemap ni a `llms.txt` mientras tanto.

## Imágenes

La imagen explica lo que el párrafo acaba de decir: capas de la piel, un folículo, la unión del nervio con el músculo, los pasos de un ciclo. Es un esquema, en SVG, con los colores de la marca (crema, arena, durazno, coral, clay).

- Cada figura lleva pie y la etiqueta visible `Ilustración`, para que nadie la tome por un resultado de paciente.
- No se generan antes y después, ni fotos clínicas, ni rostros que parezcan de un paciente.
- Un antes y después real solo entra cuando exista la foto autorizada. Hoy no existe: no se rellena el hueco con una imagen generada.

## Cómo se revisa una guía nueva

1. Escribe el mecanismo con tus palabras y marca cada frase que afirme un hecho.
2. Ábrele una fuente a cada frase. Si no aparece, bórrala.
3. Comprueba que cada enlace abre.
4. Lee en voz alta. Si suena a anuncio, reescríbela como explicación.
5. Deja `medicalReview: pendiente` y el aviso de revisión.

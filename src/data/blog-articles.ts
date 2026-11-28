interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  image: { src: string; alt: string; width: number; height: number };
  summary: string;
  sections: { title: string; paragraphs: string[] }[];
  links: { href: string; label: string }[];
}

export const blogArticles: BlogArticle[] = [
  {
    slug: "como-preparar-tu-valoracion-estetica",
    title: "Cómo preparar tu valoración estética en Bogotá",
    description: "Qué contar en tu primera valoración estética, qué fotos llevar y qué preguntar sobre el plan, las sesiones y el precio antes de decidir.",
    image: {"src":"/images/blog/preparar-valoracion.webp","alt":"Profesional y paciente conversando en un consultorio","width":1024,"height":680},
    summary: "Para preparar tu primera valoración estética, define qué te gustaría revisar, anota desde cuándo notas el cambio y reúne la información de tratamientos previos. Usa la cita para entender las opciones, el costo y los pasos siguientes.",
    sections: [
      {
        title: "Qué contar al comenzar la valoración",
        paragraphs: [
          "Empieza con una sola prioridad. Por ejemplo: «Noto menos volumen en la parte superior del cabello», «Me preocupa el contorno de la mandíbula» o «Quiero entender qué opciones hay para mi piel». Cuenta cuándo empezaste a notar el cambio, si fue gradual y qué te gustaría conservar tal como está. Los ejemplos concretos orientan mejor la conversación que llegar con un nombre de tratamiento decidido de antemano.",
          "Si ya consultaste por el mismo tema, lleva los nombres y fechas que recuerdes de productos, procedimientos u otras valoraciones. Comenta en privado con el profesional los medicamentos, alergias y antecedentes pertinentes. Si te falta algún dato, igualmente puedes agendar y señalar qué información queda pendiente.",
        ],
      },
      {
        title: "Qué fotos o documentos pueden ayudar",
        paragraphs: [
          "Si tienes fotos anteriores que muestran el cambio, selecciona dos o tres con fechas aproximadas. Una foto de frente y otra desde el ángulo de la zona que quieres comentar suelen dar contexto. En una consulta capilar, por ejemplo, puedes traer imágenes de la línea frontal y de la parte superior de la cabeza. Para comparar imágenes, procura buscar fotos con iluminación y encuadre parecidos.",
          "Ten a mano los informes o indicaciones que ya hayas recibido sobre esa misma zona. Si la valoración es virtual, lleva esos archivos listos en tu dispositivo. Pregunta antes de enviarlos qué canal usa el equipo para recibir fotos o documentos personales.",
        ],
      },
      {
        title: "Qué preguntar sobre un plan y su precio",
        paragraphs: [
          "Pide una explicación sencilla de las opciones que el profesional considere para tu caso. Pregunta qué revisarán antes de recomendarte un procedimiento, qué alcance tendría y en qué circunstancias convendría esperar o pedir otra valoración. Puedes ir solo a informarte y decidir después.",
          "Si te proponen un plan, pregunta cuántas visitas contempla, qué incluye cada visita y cómo se hará el seguimiento. En la parte económica, distingue el valor de la valoración, el precio por sesión y el costo total si te ofrecen un paquete. Si ves una promoción, confirma en qué sede aplica, durante cuánto tiempo y qué se cobra aparte.",
        ],
      },
      {
        title: "Presencial o virtual: cómo elegir",
        paragraphs: [
          "Si necesitas resolver dudas iniciales y tienes poco tiempo de desplazamiento, pregunta por la modalidad virtual y qué información podrán revisar por videollamada. Si te interesa explorar una zona en persona, pregunta por una cita presencial y confirma la dirección antes de salir. El equipo puede indicar si necesita una visita en sede para completar la valoración.",
          "Antes de cerrar la conversación, resume el siguiente paso que entendiste: volver a consultar al equipo, confirmar una sede, revisar un presupuesto o reservar una cita. Si falta un precio o una fecha, pide el dato por el canal de la sede para poder compararlo después.",
        ],
      },
    ],
    links: [
      { href: "/lp/caida-del-cabello", label: "Prevaloración capilar" },
      { href: "/sedes", label: "Ver sedes en Bogotá" },
      { href: "/blog/como-comparar-precios-por-sede", label: "Comparar precios y promociones por sede" },
    ],
  },
  {
    slug: "como-comparar-precios-por-sede",
    title: "Cómo comparar precios y promociones por sede en Luvania",
    description: "Aprende a comparar precios en las sedes de Luvania en Bogotá y a revisar vigencia, sesiones e inclusiones antes de agendar.",
    image: {"src":"/images/blog/comparar-sedes.webp","alt":"Consultorio preparado para recibir a una paciente","width":1024,"height":680},
    summary: "Abre la ficha del tratamiento y revisa «Precios y promociones por sede». Elige la sede que te convenga y compara el valor, la vigencia y lo que incluye la oferta. Si la ficha indica «Sin promoción publicada», puedes consultar el precio con la sede al agendar.",
    sections: [
      {
        title: "Dónde ver si una promoción aplica en tu sede",
        paragraphs: [
          "Empieza por la ficha del tratamiento. En «Precios y promociones por sede» encontrarás las opciones de Chicó, Modelia, Restrepo, Venecia y Colina. La disponibilidad de una promoción puede variar según la sede. Si te interesa un lifting facial, por ejemplo, abre su ficha, baja hasta esa sección y elige la sede donde te gustaría recibir orientación.",
          "Si llegas a la web desde un anuncio o una historia, comprueba el nombre del tratamiento y la sede que menciona la comunicación. Luego revisa la ficha. Si el anuncio tiene condiciones que no aparecen en la web, consulta con la sede antes de tomar una decisión.",
        ],
      },
      {
        title: "Cómo comparar dos ofertas",
        paragraphs: [
          "Primero revisa a qué corresponde el valor visible: una sesión, un paquete o un precio inicial. Si dos ofertas tienen cantidades de sesiones distintas, pregunta por el costo total y las condiciones de cada una. Comprueba si el precio promocional incluye valoración o seguimiento y si hay cargos que dependen del plan.",
          "Un precio inicial puede cambiar cuando el equipo define qué incluye tu caso. Si la cifra publicada te interesa, pregunta qué cubre exactamente y cuándo conocerás el valor total. Guarda el nombre de la oferta y la sede para que el equipo pueda ubicarla al responderte.",
          "También conviene comparar el tiempo de desplazamiento. Si un plan requiere varias visitas, mira la dirección y consulta los horarios de atención de las sedes que estés considerando. Así podrás comparar el costo y la facilidad de asistir a las citas.",
        ],
      },
      {
        title: "Qué significa «Sin promoción publicada»",
        paragraphs: [
          "Ese mensaje indica que la web no muestra una promoción vigente para ese tratamiento en la sede seleccionada. Puedes agendar una valoración si te interesa esa ubicación y solicitar información sobre el precio. Si venías buscando una promoción concreta, consulta otras sedes o revisa la página de promociones vigentes.",
          "Cuando contactes a la sede, basta con indicar el tratamiento, la ubicación y tu duda. Por ejemplo: «Estoy mirando lifting facial en Modelia. ¿Qué incluye la valoración y cuándo me confirman el precio del tratamiento?». Si necesitas otra modalidad de atención, puedes mencionarlo en el mismo mensaje.",
        ],
      },
      {
        title: "Qué confirmar antes de agendar",
        paragraphs: [
          "Verifica que el nombre de la sede coincida con el que elegiste en la ficha. Si vas presencialmente, consulta su dirección y cómo llegar. Si te interesaba una promoción, pregunta si la fecha de la cita queda dentro de la vigencia y en qué momento se confirma el precio o se realiza el pago.",
          "Anota la fecha, la modalidad y cualquier condición que el equipo te haya confirmado. Si más adelante quieres cambiar de sede, vuelve a revisar el precio y la vigencia de la oferta en esa ubicación.",
        ],
      },
    ],
    links: [
      { href: "/tratamientos/lifting-facial#precios-por-sede", label: "Lifting facial: elegir sede" },
      { href: "/promociones", label: "Ver promociones" },
      { href: "/sedes", label: "Consultar direcciones de las sedes" },
    ],
  },
];

export function getBlogArticle(slug: string) {
  return blogArticles.find((article) => article.slug === slug);
}

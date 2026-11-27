import type { Guide } from "./types";

const review = {
  medicalReview: "pendiente",
  revisadoPor: null,
  fechaRevision: null,
  referencesCheckedOn: "2026-11-25",
} as const;

export const facialContourGuides: Guide[] = [
  {
    ...review,
    slug: "perfilamiento-maxilar-hombres",
    h1: "Perfilamiento mandibular: qué se valora en mandíbula y mentón",
    title: "Perfilamiento mandibular: guía de valoración en Bogotá | Luvania",
    description: "Conoce qué se evalúa antes de un perfilamiento mandibular en Bogotá, en qué se diferencia del tratamiento de la papada y qué preguntar sobre los riesgos.",
    keyword: "perfilamiento mandibular en Bogotá",
    secondary: ["perfilamiento maxilar", "definición de mandíbula y mentón", "precio del perfilamiento mandibular"],
    cover: {
      src: "/guias/perfil-mandibula-menton.webp",
      width: 1200,
      height: 800,
      alt: "Rostro de un hombre en tres cuartos, con el mentón y la línea de la mandíbula visibles",
      caption: "El mentón y la línea de la mandíbula se valoran en conjunto. Imagen ilustrativa generada con IA.",
    },
    blocks: [
      { id: "que-es", title: "¿Qué es el perfilamiento mandibular?", paragraphs: [
        "El perfilamiento mandibular busca modificar cómo se ve el contorno de la parte inferior del rostro. En estética, algunas personas lo llaman perfilamiento maxilar. En la cita conviene precisar si lo que quieres valorar es la línea de la mandíbula, el mentón o el volumen debajo de este.",
        "Los rellenos dérmicos son una opción en casos seleccionados. La valoración sirve para aclarar qué cambio buscas, qué alternativas tienen sentido y qué resultado es razonable para tu anatomía.",
      ] },
      { id: "valoracion", title: "¿Qué se revisa antes de decidir?", paragraphs: [
        "El profesional revisa tus objetivos y observa el contorno de frente y de perfil. Cuéntale si ya tienes rellenos, si te han operado en esa zona o si has tenido reacciones a procedimientos previos. Lleva el nombre del producto o el registro del procedimiento si lo tienes.",
        "Si lo que te preocupa es la mordida, dificultad al masticar o dolor al mover la mandíbula, coméntalo desde el inicio. Esos síntomas requieren una evaluación clínica específica.",
      ] },
      { id: "seguridad", title: "¿Qué riesgos se deben conversar?", paragraphs: [
        "Después de un relleno pueden aparecer hinchazón o moretones. La inyección accidental en un vaso sanguíneo es poco frecuente, pero puede causar una complicación grave.",
        "Antes de decidir, pregunta quién realizará el procedimiento, qué producto se usaría y cómo te atenderían ante una complicación. Si después de un relleno tienes dolor intenso o inusual, cambios de color en la piel o alteraciones de la visión, busca atención médica inmediata.",
      ] },
      { id: "costo", title: "¿Cómo se define el precio en Bogotá?", paragraphs: [
        "Pide una cotización por escrito que indique el área, el producto propuesto, la cantidad estimada y si incluye revisión posterior. Así puedes comparar propuestas equivalentes y saber qué se confirmará en tu valoración.",
      ] },
    ],
    faqs: [
      { q: "¿Perfilamiento mandibular y relleno de mentón son lo mismo?", a: "Son objetivos distintos. El primero se centra en la línea de la mandíbula y el segundo en la forma o proyección del mentón. La valoración determina si conviene tratar una zona, ambas o elegir otra alternativa." },
      { q: "¿El perfilamiento mandibular trata la papada?", a: "Definir el contorno mandibular y valorar el volumen bajo el mentón son objetivos distintos. La mejor opción depende de qué contribuye al aspecto que te preocupa." },
      { q: "¿La duración del resultado es igual para todos?", a: "Varía con el producto, la zona y la respuesta individual. Pide que te expliquen el rango esperado para la propuesta concreta." },
    ],
    references: [
      { title: "Dermal Fillers (Soft Tissue Fillers)", publisher: "FDA", href: "https://www.fda.gov/medical-devices/aesthetic-cosmetic-devices/dermal-fillers-soft-tissue-fillers" },
    ],
  },
  {
    ...review,
    slug: "dewlap-lipopapada-sin-cirugia",
    h1: "Papada sin cirugía: qué se puede valorar y cuándo",
    title: "Papada sin cirugía: guía de valoración en Bogotá | Luvania",
    description: "Aprende qué se evalúa bajo el mentón, por qué el tratamiento de papada cambia según cada persona y qué preguntas llevar a una valoración en Bogotá.",
    keyword: "papada sin cirugía en Bogotá",
    secondary: ["valoración de papada", "grasa debajo del mentón", "flacidez de cuello", "precio del tratamiento de papada"],
    cover: {
      src: "/guias/perfil-contorno-bajo-menton.webp",
      width: 1200,
      height: 800,
      alt: "Perfil de una mujer que permite ver el contorno naturalmente redondeado bajo el mentón",
      caption: "En un perfil se distingue la zona bajo el mentón que se revisa en la cita. Imagen ilustrativa generada con IA.",
    },
    blocks: [
      { id: "que-es", title: "¿Qué se evalúa cuando te preocupa la papada?", paragraphs: [
        "La papada describe la forma o el volumen que se ve debajo del mentón. La grasa, la piel y otras características del contorno pueden contribuir de forma distinta en cada persona. Por eso dos perfiles parecidos pueden requerir conversaciones y opciones diferentes.",
        "La valoración comienza por aclarar qué notas, desde cuándo y qué cambio te gustaría ver. La exploración permite hablar de opciones acordes con la causa probable y con tu historial.",
      ] },
      { id: "opciones", title: "¿Cuándo tiene sentido una opción sin cirugía?", paragraphs: [
        "Las opciones estéticas se eligen según el tejido que se quiere tratar y el estado de salud. Algunas están dirigidas a la grasa bajo el mentón y otras buscan abordar la firmeza de la piel. Pregunta cuál es el objetivo concreto del procedimiento que te proponen.",
        "Si lo que notas es un bulto nuevo, dolor, aumento rápido de volumen o dificultad para tragar, pide una consulta médica para aclarar la causa antes de tratarlo como una inquietud estética.",
      ] },
      { id: "consulta", title: "¿Qué preguntar al comparar tratamientos?", paragraphs: [
        "Pide que te expliquen el nombre exacto del procedimiento, quién lo hará, qué cambios son razonables y cuáles son sus riesgos. Si te ofrecen varias sesiones, pregunta por qué se recomiendan y cuándo revisarán la evolución.",
        "Antes de pagar, solicita que te indiquen qué incluye el presupuesto, si cubre el seguimiento y qué debes hacer si aparece una molestia fuera de lo esperado.",
      ] },
    ],
    faqs: [
      { q: "¿La papada siempre es grasa?", a: "El aspecto bajo el mentón puede depender de la grasa, la piel y la forma del contorno. En la valoración se revisa qué contribuye en tu caso." },
      { q: "¿Cuántas sesiones necesito?", a: "La cantidad depende del procedimiento y de la evaluación inicial. Pide el objetivo de cada sesión y cómo se valorará la respuesta." },
      { q: "¿Se puede definir el precio con una foto?", a: "Una foto puede orientar la conversación. Para cotizar un plan conviene confirmar primero qué se quiere tratar y qué procedimiento sería apropiado." },
    ],
    references: [
      { title: "Double Chin Surgery: Procedure, Risks", publisher: "Cleveland Clinic", href: "https://my.clevelandclinic.org/health/treatments/21534-double-chin-surgery" },
      { title: "Assessing the Submental and Neck Region", publisher: "Dermatologic Surgery", href: "https://doi.org/10.1097/DSS.0000000000004937" },
    ],
  },
  {
    ...review,
    slug: "hilos-tensores",
    h1: "Hilos tensores faciales: resultados, recuperación y riesgos",
    title: "Hilos tensores faciales en Bogotá: guía para pacientes | Luvania",
    description: "Descubre qué pueden aportar los hilos tensores faciales, cómo se compara su efecto con un lifting y qué riesgos y cuidados conviene discutir antes de decidir.",
    keyword: "hilos tensores faciales en Bogotá",
    secondary: ["cuánto duran los hilos tensores", "recuperación tras hilos tensores", "riesgos de los hilos tensores"],
    cover: {
      src: "/guias/consulta-hilos-tensores.webp",
      width: 1200,
      height: 800,
      alt: "Profesional de salud conversa con una paciente frente a una ilustración del rostro",
      caption: "La consulta es el momento de comparar el efecto esperado, la recuperación y las alternativas. Imagen ilustrativa generada con IA.",
    },
    blocks: [
      { id: "que-es", title: "¿Qué son los hilos tensores faciales?", paragraphs: [
        "Los hilos tensores son suturas que se colocan bajo la piel para dar soporte a determinados tejidos. La magnitud y la duración del efecto dependen del tipo de hilo, la zona y las características de la persona.",
        "La valoración ayuda a distinguir si lo que quieres mejorar es la firmeza, el volumen o la textura. Cada objetivo se evalúa por separado antes de recomendar una alternativa.",
      ] },
      { id: "alternativas", title: "¿Qué diferencia hay entre hilos y un lifting?", paragraphs: [
        "El lifting quirúrgico y los hilos tienen alcances, recuperación y riesgos diferentes. Si lo que buscas es un cambio importante, pide que te expliquen qué puede ofrecer cada opción en tu caso.",
        "Antes de decidir, describe el cambio que esperas y pregunta cuándo se evaluará el resultado. Esto permite acordar expectativas y saber qué seguimiento puedes necesitar.",
      ] },
      { id: "recuperacion", title: "¿Qué esperar durante la recuperación?", paragraphs: [
        "Puede haber molestias, hinchazón o moretones. Entre las posibles complicaciones están la infección, las irregularidades en la piel y que un hilo llegue a hacerse visible. El profesional debe explicarte cómo se manejan y qué cuidados seguir.",
        "Deja por escrito a quién contactar tras el procedimiento, cuándo es el control y qué signos requieren valoración. Si notas dolor cada vez mayor, fiebre o secreción, contacta al equipo de salud sin esperar a la cita de seguimiento.",
      ] },
    ],
    faqs: [
      { q: "¿Cuánto duran los hilos tensores?", a: "El efecto es temporal y su duración varía. Pide el rango esperado para la zona y el material que se está considerando para ti." },
      { q: "¿Cuántos hilos me tendrían que poner?", a: "Se define según la zona a tratar, el objetivo y el tipo de hilo. Pide que te expliquen qué cambia si se elige una cantidad diferente." },
      { q: "¿Puedo volver de inmediato a mis actividades?", a: "Depende del procedimiento y de cómo te encuentres. Pregunta por separado cuándo retomar trabajo, ejercicio y las actividades que te preocupan." },
    ],
    references: [
      { title: "Thread Lift Risks and Safety", publisher: "American Society of Plastic Surgeons", href: "https://www.plasticsurgery.org/cosmetic-procedures/thread-lift/safety" },
      { title: "Thread Lift Recovery", publisher: "American Society of Plastic Surgeons", href: "https://www.plasticsurgery.org/cosmetic-procedures/thread-lift/recovery" },
      { title: "Thread Lift Results", publisher: "American Society of Plastic Surgeons", href: "https://www.plasticsurgery.org/cosmetic-procedures/thread-lift/results" },
    ],
  },
];

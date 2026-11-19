import type { Guide } from "./types";

const pendiente = {
  medicalReview: "pendiente" as const,
  revisadoPor: null,
  fechaRevision: null,
};

const toxinaRefs: Guide["references"] = [
  {
    title: "Padda IS, Tadi P. Botulinum Toxin. StatPearls.",
    publisher: "NCBI Bookshelf",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK557387/",
  },
  {
    title: "Botulinum toxin therapy: Overview.",
    publisher: "American Academy of Dermatology",
    href: "https://www.aad.org/public/cosmetic/wrinkles/botulinum-toxin-overview",
  },
  {
    title: "Botulinum toxin therapy: FAQs.",
    publisher: "American Academy of Dermatology",
    href: "https://www.aad.org/public/cosmetic/wrinkles/botulinum-toxin-faqs",
  },
  {
    title: "Botox Cosmetic (onabotulinumtoxinA). Etiquetado.",
    publisher: "DailyMed, U.S. National Library of Medicine",
    href: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=485d9b71-6881-42c5-a620-a4360c7192ab",
  },
];

const acneRefs: Guide["references"] = [
  {
    title: "Sutaria AH, Masood S, Saleh HM, Schlessinger J. Acne Vulgaris. StatPearls.",
    publisher: "NCBI Bookshelf",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK459173/",
  },
  {
    title: "Acne: Who gets and causes.",
    publisher: "American Academy of Dermatology",
    href: "https://www.aad.org/public/diseases/acne/causes/acne-causes",
  },
  {
    title: "Acne: Signs and symptoms.",
    publisher: "American Academy of Dermatology",
    href: "https://www.aad.org/public/diseases/acne/really-acne/symptoms",
  },
];

const ojeraRefs: Guide["references"] = [
  {
    title: "Vrcek I, Ozgur O, Nakra T. Infraorbital Dark Circles: A Review of the Pathogenesis, Evaluation and Treatment. J Clin Aesthet Dermatol. 2016.",
    publisher: "PubMed Central",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4924417/",
  },
  {
    title: "Sarkar R y colaboradores. Periorbital Hyperpigmentation: A Comprehensive Review. J Clin Aesthet Dermatol. 2016.",
    publisher: "PubMed Central",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4756872/",
  },
];

const labioRefs: Guide["references"] = [
  {
    title: "Walker K, Basehore BM, Goyal A, Zito PM. Hyaluronic Acid. StatPearls.",
    publisher: "NCBI Bookshelf",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK482440/",
  },
  {
    title: "Piccinin MA, Zito PM. Anatomy, Head and Neck, Lips. StatPearls.",
    publisher: "NCBI Bookshelf",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK507900/",
  },
  {
    title: "Juvéderm Ultra XC. Etiquetado para pacientes, aumento de labios.",
    publisher: "U.S. Food and Drug Administration",
    href: "https://www.accessdata.fda.gov/cdrh_docs/pdf5/P050047S044c.pdf",
  },
];

const celulitisRefs: Guide["references"] = [
  {
    title: "Friedmann DP, Vick GL, Mishra V. Cellulite: a review with a focus on subcision. Clin Cosmet Investig Dermatol. 2017.",
    publisher: "PubMed Central",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5234561/",
  },
  {
    title: "Cellulite treatments: What really works?",
    publisher: "American Academy of Dermatology",
    href: "https://www.aad.org/public/cosmetic/fat-removal/cellulite-treatments-what-really-works",
  },
];

const gluteoRefs: Guide["references"] = [
  {
    title: "Elzanie A, Borger J. Anatomy, Bony Pelvis and Lower Limb, Gluteus Maximus Muscle. StatPearls.",
    publisher: "NCBI Bookshelf",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK538193/",
  },
];

const peloRefs: Guide["references"] = [
  {
    title: "Al Aboud AM, Syed HA, Zito PM. Alopecia. StatPearls.",
    publisher: "NCBI Bookshelf",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK538178/",
  },
  {
    title: "Hughes EC, Syed HA, Saleh D. Telogen Effluvium. StatPearls.",
    publisher: "NCBI Bookshelf",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK430848/",
  },
  {
    title: "Hair loss: Who gets and causes.",
    publisher: "American Academy of Dermatology",
    href: "https://www.aad.org/public/diseases/hair-loss/causes/18-causes",
  },
];

export const guides: Guide[] = [
  {
    slug: "toxina-botulinica-tipo-a",
    h1: "Guía de la toxina botulínica, el bótox",
    title: "Botox en Bogotá: guía de la toxina | Luvania",
    description:
      "Qué es la toxina botulínica tipo A, cómo frena la orden del nervio al músculo y qué no rellena. La dosis se define en la valoración de Luvania.",
    keyword: "botox",
    secondary: ["toxina botulinica", "toxina botulínica tipo A", "botox bogota"],
    ...pendiente,
    references: toxinaRefs,
    blocks: [
      {
        id: "que-es",
        title: "Qué es, con el nombre que se busca",
        paragraphs: [
          "Bótox es la palabra con la que casi todo el mundo busca este procedimiento. El nombre del fármaco es toxina botulínica tipo A: una proteína que fabrica la bacteria Clostridium botulinum. En estética se usa una forma purificada, en una dosis muy pequeña, para que un músculo de la cara se mueva menos durante un tiempo.",
          "Cuando frunces el ceño o cierras los ojos con fuerza, ese músculo tira de la piel y la línea se marca. Si la orden baja, la línea de movimiento se suaviza. No rellena un surco que ya está ahí con la cara quieta, ni cambia el volumen del rostro. Para eso se miran otros protocolos. En la ficha de Luvania el uso publicado es frente, entrecejo y patas de gallo.",
        ],
      },
      {
        id: "como-funciona",
        title: "De dónde viene y cómo actúa",
        figure: {
          kind: "union",
          alt: "Ilustración de la unión entre nervio y músculo: vesículas de acetilcolina, la proteína SNAP-25 cortada y un músculo que no recibe la orden.",
          caption:
            "Esquema de la unión neuromuscular. La toxina corta SNAP-25, la vesícula no suelta acetilcolina y el músculo se queda sin la orden de contraerse. No es una foto ni un resultado.",
        },
        paragraphs: [
          "El uso clínico de esta neurotoxina viene de finales de la década de 1970, según la revisión de StatPearls. El etiquetado de Botox Cosmetic en DailyMed, que recoge el rótulo de la FDA, marca una aprobación inicial en Estados Unidos en 1989 y la describe como un inhibidor de la liberación de acetilcolina: un bloqueo neuromuscular temporal.",
          "En la unión entre el nervio y el músculo hay vesículas llenas de acetilcolina. Para soltarla, unas proteínas llamadas SNARE tienen que pegar la vesícula a la membrana. La toxina corta una de ellas, SNAP-25. Sin esa unión, el músculo no recibe la orden de contraerse. StatPearls lo explica como una inhibición reversible: el efecto se acaba cuando el nervio repone esas proteínas. Por eso no es permanente.",
          "La misma molécula tiene otros usos médicos. La AAD describe el sudor excesivo de las axilas cuando lo que se pone en la piel no alcanza. Esa no es la indicación que publica esta ficha. La dosis y el punto cambian. Papada y flacidez tampoco son su trabajo principal.",
        ],
      },
      {
        id: "procedimiento",
        title: "Cómo es el procedimiento",
        card: "Se inyecta una cantidad pequeña en músculos que elegiste con el médico. La intención es relajar el que se marca y dejar el resto de la expresión.",
        paragraphs: [
          "La aplicación es con aguja fina. A veces se usa anestesia en crema. Hay quien solo siente el pinchazo. El mapa de puntos se habla antes, porque el músculo que se toca es el que va a moverse menos.",
          "Las unidades de una marca no se convierten a las de otra. El etiquetado de la FDA lo dice, y StatPearls lo repite. Por eso la dosis de tu cara no sale de una tabla de internet.",
        ],
      },
      {
        id: "preparacion",
        title: "Preparación",
        card: "Cuenta enfermedades, medicamentos, alergias y un embarazo posible. Esa conversación va antes de la primera inyección.",
        paragraphs: [
          "No es una cirugía y esta guía no pide exámenes de sangre. Sí pide que el médico sepa si tienes un trastorno neuromuscular, una alergia al producto o una infección en la zona. StatPearls lista el embarazo, la lactancia y las enfermedades del nervio y del músculo entre lo que se revisa antes.",
          "Si tomas algo que facilite el moretón, dilo. La sede te dirá qué suspender, si hace falta. Esta página no deja una lista fija de café o de aspirina: eso se confirma con quien te va a tratar.",
        ],
      },
      {
        id: "cuidados",
        title: "Cuidados posteriores",
        card: "No frotes la zona y espera antes de un esfuerzo fuerte, para que el producto no se corra a un músculo vecino.",
        paragraphs: [
          "La AAD pide no masajear donde te inyectaron. Si te maquillas, no aprietes. También pide esperar unas dos horas antes de un ejercicio que suba el pulso.",
          "Esas precauciones salen de la academia. Al salir, la sede te las deja por escrito para tu caso. Si el párpado, la ceja o la sonrisa se sienten distintos de lo acordado, vuelve. No lo corrijas masajeando.",
        ],
      },
      {
        id: "efectos",
        title: "Efectos y contraindicaciones",
        card: "Puede haber moretón o molestia del pinchazo. Si el producto llega a un músculo vecino, el gesto cambia. Embarazo, infección y enfermedades neuromusculares se revisan antes.",
        paragraphs: [
          "StatPearls describe los efectos estéticos más frecuentes como moderados y limitados: moretón, hinchazón o dolor en el punto. Menos veces, una ceja o un párpado caídos, ligados a la técnica. La AAD añade enrojecimiento y, como evento raro, debilidad de un músculo vecino.",
          "Es un fármaco, no un cuidado indiferente. El resultado tampoco está cerrado de antemano: se busca modular el gesto, y eso se acuerda antes de abrir el frasco.",
        ],
      },
      {
        id: "sesiones",
        title: "Sesiones y duración",
        paragraphs: [
          "Dos fuentes describen el tiempo de forma distinta. La AAD dice que la mayoría nota el cambio entre tres y siete días, y que la mejoría dura unos tres o cuatro meses. StatPearls habla de cerca de dos semanas para que el efecto se complete y de tres a cinco meses en la práctica estética.",
          "Ninguna de esas cifras es una fecha tuya. El músculo vuelve a moverse, y el momento de repetir se decide en el control, mirando tu cara.",
        ],
      },
      {
        id: "cuando-consultar",
        title: "Cuándo consultar",
        paragraphs: [
          "Pide valoración si las líneas que te molestan aparecen al mover la cara. Si lo que ves es papada, flacidez o un surco quieto, la ficha te orienta a otro protocolo.",
          "Si después de una aplicación algo no cuadra con lo que acordaste, la sede es el lugar. Un párpado caído no se arregla con masaje casero.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Me va a quedar la cara quieta?",
        a: "La AAD lo dice así: se pone lo justo para relajar el músculo elegido y dejar la expresión. Eso se acuerda antes, en tu cara, no en una foto de otra persona.",
      },
      {
        q: "¿Duele?",
        a: "Se usa una aguja fina. A veces, anestesia en crema. Hay quien siente un pinchazo breve.",
      },
      {
        q: "¿Sirve para la papada?",
        a: "No es la indicación de esta ficha. Papada y flacidez se valoran con otros protocolos.",
      },
      {
        q: "¿Bótox y toxina botulínica son cosas distintas?",
        a: "Bótox es el nombre con el que se busca. El fármaco es toxina botulínica tipo A. La marca y la presentación se confirman en la cita, porque las unidades no se convierten entre marcas.",
      },
    ],
  },
  {
    slug: "acne",
    h1: "Guía del acné",
    title: "Guía del acné en Bogotá | Luvania",
    description:
      "Cómo se tapa el folículo, por qué sale el brote y qué puede hacer un plan estético. Si el acné es médico, esta guía no reemplaza la dermatología.",
    keyword: "acne",
    secondary: ["acné tratamiento", "marcas de acné", "acné facial"],
    ...pendiente,
    references: acneRefs,
    blocks: [
      {
        id: "que-es",
        title: "Qué es el acné",
        paragraphs: [
          "El acné es una inflamación del folículo donde nace el vello y desemboca la glándula de sebo. La AAD lo resume en una frase útil: el poro se tapa. Lo que cambia es con qué se tapa, y por eso no todos los brotes se ven iguales.",
          "StatPearls describe cuatro hechos que se juntan: más sebo, un tapón de queratina, la bacteria Cutibacterium acnes y la inflamación. El primer paso, casi invisible, es el microcomedón. De ahí salen el punto blanco, el punto negro, la pápula y, si la pared se rompe, el nódulo.",
        ],
      },
      {
        id: "como-funciona",
        title: "Qué pasa dentro del poro",
        figure: {
          kind: "foliculo",
          alt: "Ilustración de un folículo con tapón de queratina, glándula de sebo e inflamación alrededor. No es una foto de un brote.",
          caption:
            "Corte esquemático de la piel. El sebo no sale, el poro se tapa y la pared se inflama. El punto negro no es suciedad.",
        },
        paragraphs: [
          "En la pubertad, unas hormonas llamadas andrógenos agrandan la glándula sebácea y ella fabrica más grasa. Esa grasa es alimento para C. acnes, una bacteria que ya vive en la piel sana y que puede empujar la inflamación. No es que la cara esté sucia.",
          "El punto negro tampoco es tierra. La AAD explica que el color oscuro aparece cuando el contenido del poro reacciona con el aire, parecido a lo que le pasa a una manzana cortada. Exprimirlo no lo limpia: empuja el contenido hacia adentro.",
          "El plan de Luvania es estético: limpieza, activos y, si cabe, aparatología como Dermapen, para un brote leve o para la marca que ya quedó. Si hay nódulos, dolor o un acné que no cede, se orienta a dermatología. Una sesión de cabina no sustituye ese tratamiento.",
        ],
      },
      {
        id: "procedimiento",
        title: "Cómo es el procedimiento",
        card: "Se mira el tipo de brote. La extracción, si se hace, es selectiva. Lastimar el poro empeora la marca.",
        paragraphs: [
          "La ficha no publica una receta única de mascarilla ni de antibiótico. Quien te ve decide si ese día toca limpiar, un activo o esperar, porque no toda aparatología se pone sobre una infección.",
          "Exprimir en casa empuja el contenido hacia la dermis. StatPearls describe esa ruptura como el paso que agranda la inflamación. Por eso la mano que no sabe se queda quieta.",
        ],
      },
      {
        id: "preparacion",
        title: "Preparación",
        card: "Llega sin maquillaje espeso y cuenta si usas isotretinoína, antibióticos o tienes un brote infectado.",
        paragraphs: [
          "La isotretinoína y un brote quístico se revisan con un médico antes de cualquier aparatología. Dilo en la valoración, aunque te parezca un detalle.",
          "Esta guía no deja una lista de productos de casa. La ficha sí pide pauta y fotoprotección, porque el sol oscurece la marca que el brote deja.",
        ],
      },
      {
        id: "cuidados",
        title: "Cuidados posteriores",
        card: "Un jabón que no reseque de más, nada aceitoso que vuelva a tapar el poro, y protector solar.",
        paragraphs: [
          "Después de una extracción o de una aparatología, la piel puede estar sensible. Si la sede te pidió no tapar el folículo ese día, se cumple.",
          "La mancha que queda se puede atenuar. El plazo depende de qué tan profunda sea. No hay una fecha impresa.",
        ],
      },
      {
        id: "efectos",
        title: "Efectos y contraindicaciones",
        card: "Puede haber enrojecimiento según el activo. Un brote infectado no es terreno para toda aparatología. Manipular el grano aumenta la marca.",
        paragraphs: [
          "Los efectos dependen de lo que sí te apliquen. Esta guía no inventa la lista de un producto que la ficha no cierra. Lo que sí dicen la AAD y StatPearls es que manipular el brote aumenta la inflamación y la cicatriz.",
          "Si el acné duele, deja cicatriz o no cede, el camino es dermatológico. El plan estético se queda corto ahí, y decirlo a tiempo es parte del cuidado.",
        ],
      },
      {
        id: "sesiones",
        title: "Sesiones y duración",
        paragraphs: [
          "Un plan de piel se mide en semanas, no en una cita. La ficha lo dice y esta guía no le pone un número que el equipo médico no haya cerrado.",
          "A veces el brote se ve más rojo al empezar un activo. Si pasa, se avisa en el control. No es una señal de que debas exprimirlo.",
        ],
      },
      {
        id: "cuando-consultar",
        title: "Cuándo consultar",
        paragraphs: [
          "Ven a la valoración con comedones, un brote leve o marcas. Si hay nódulos, pus profundo o estás en isotretinoína, dilo antes de que alguien te programe aparatología.",
          "Una mancha después del brote es otra conversación: se puede trabajar, y no se borra por decreto.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Me lo van a exprimir todo?",
        a: "La extracción, si se hace, es selectiva. Lastimar la pared del folículo empeora la inflamación y la marca.",
      },
      {
        q: "¿Puedo venir con brote activo?",
        a: "Sí a la valoración. No toda aparatología se aplica sobre una infección.",
      },
      {
        q: "¿Quitan las manchas del acné?",
        a: "Se pueden atenuar. El plazo depende de la profundidad de la marca y no se promete una fecha.",
      },
      {
        q: "¿El punto negro es suciedad?",
        a: "No. La AAD explica que el color oscuro es una reacción del contenido del poro con el aire.",
      },
    ],
  },
  {
    slug: "eliminar-ojeras",
    h1: "Guía de las ojeras",
    title: "Guía de ojeras en Bogotá | Luvania",
    description:
      "La ojera puede ser pigmento, un vaso que se ve a través de la piel o la sombra de un surco. Por eso no todo se trata con el mismo gesto en Luvania.",
    keyword: "ojeras",
    secondary: ["eliminar ojeras", "ojeras bogotá", "surco lagrimal"],
    ...pendiente,
    references: ojeraRefs,
    blocks: [
      {
        id: "que-es",
        title: "Qué es una ojera",
        paragraphs: [
          "La ojera no es una sola cosa. Una revisión de Vrcek y colaboradores, en 2016, junta tres familias de causa: el pigmento, lo que se transparenta a través de una piel muy delgada —vaso y músculo— y la sombra de un surco o de una bolsa.",
          "Por eso el mismo corrector no le sirve a todo el mundo. Luvania separa el motivo en la valoración y recién ahí propone despigmentación, calidad de piel o soporte. Borrar una ojera genética en una cita no es un encargo real.",
        ],
      },
      {
        id: "como-funciona",
        title: "Por qué se ve oscuro",
        figure: {
          kind: "parpado",
          alt: "Ilustración del párpado inferior: piel delgada, un vaso, pigmento y la sombra de un surco. No es la foto de un paciente.",
          caption:
            "Tres motivos que se parecen en el espejo y no se tratan igual: pigmento, un vaso que se ve a través de la piel y la sombra de un surco.",
        },
        paragraphs: [
          "La piel del párpado es de las más finas y casi no tiene grasa debajo. Lo que está debajo se ve: el músculo orbicular y la red de vasitos. Si además hay pigmento, por herencia o por una inflamación previa, el color se suma. Si el reborde se hunde, la luz hace una sombra aunque la piel no esté más oscura.",
          "Otra revisión, la de Sarkar y colaboradores en 2016, suma el edema y la herencia a esa lista. Una bolsa de grasa es volumen y tiene ficha aparte. Confundirlas es el error más común.",
        ],
      },
      {
        id: "procedimiento",
        title: "Cómo es el procedimiento",
        card: "Primero se nombra la causa: color, vaso o surco. El plan puede ser tópico, de aparatología o de soporte, y se escribe ese día.",
        paragraphs: [
          "Si el camino fuera un gel de soporte, el mecanismo es el del ácido hialurónico: ocupa un lugar y el cuerpo lo va reabsorbiendo. La marca y la cantidad se confirman en la cita. Esta guía no abre un menú cerrado de peelings ni de luces.",
          "La piel oscura y el melasma piden más cuidado, porque algunas luces pueden oscurecer en vez de aclarar. Por eso la fotoprotección pesa más aquí que en casi cualquier otra zona.",
        ],
      },
      {
        id: "preparacion",
        title: "Preparación",
        card: "Cuenta alergias, tiroides, medicamentos y qué te has puesto bajo el ojo. Llega sin maquillaje espeso.",
        paragraphs: [
          "Si la ojera cambia con la sal, el sueño o la alergia, dilo. El edema deja un tono violáceo y no se trata como una mancha.",
          "Una foto sin filtro, de frente y con luz pareja, ayuda más que un recuerdo. El color real se mira en la sede.",
        ],
      },
      {
        id: "cuidados",
        title: "Cuidados posteriores",
        card: "Protector solar y las indicaciones escritas de la técnica que sí te hicieron. El maquillaje depende de esa técnica.",
        paragraphs: [
          "Después de un soporte puede haber hinchazón los primeros días. El color, si se trabaja, cambia más lento. Son dos velocidades distintas.",
          "No te pongas un peeling casero en el párpado mientras la piel siga sensible. La sede te dice cuándo puedes volver a maquillarte.",
        ],
      },
      {
        id: "efectos",
        title: "Efectos y contraindicaciones",
        card: "La zona es delicada. Puede haber hinchazón o enrojecimiento. Un vaso, un pigmento y un surco no comparten el mismo riesgo.",
        paragraphs: [
          "La revisión de Vrcek insiste en que el plan se arma según la anatomía de esa persona. No hay un resultado cerrado de antemano ni una técnica que sirva para las tres causas.",
          "Si hay una bolsa que es grasa, un problema de tiroides o una alergia activa, se dice qué sí entra en el protocolo estético y qué se deriva.",
        ],
      },
      {
        id: "sesiones",
        title: "Sesiones y duración",
        paragraphs: [
          "El pigmento casi nunca se resuelve en una cita. Un surco con soporte se nota antes, con inflamación inicial.",
          "Esas dos velocidades pueden convivir en la misma cara. Ninguna se convierte en una fecha prometida.",
        ],
      },
      {
        id: "cuando-consultar",
        title: "Cuándo consultar",
        paragraphs: [
          "Consulta si te ves el rostro cansado aun durmiendo bien. Cuenta desde cuándo y si cambia a lo largo del día.",
          "Dolor, un párpado que se cierra mal o una hinchazón de un solo lado no son una ojera estética. Eso se mira como un problema médico.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Es lo mismo que las bolsas?",
        a: "No. La bolsa es volumen de grasa. La ojera es color, un vaso que se transparenta o la sombra de un surco. Hay ficha aparte para las bolsas.",
      },
      {
        q: "¿Con una sesión basta?",
        a: "Casi nunca cuando el motivo es pigmento. El plan se escribe en la valoración, después de separar la causa.",
      },
      {
        q: "¿Puedo maquillarme después?",
        a: "Depende de la técnica. Te lo indican por escrito al salir.",
      },
    ],
  },
  {
    slug: "aumento-y-o-perfilamiento-de-labios",
    h1: "Guía de labios y del ácido hialurónico",
    title: "Ácido hialurónico en labios | Luvania",
    description:
      "Qué es el ácido hialurónico, cómo ocupa un lugar en el labio y por qué ese volumen es temporal. La marca se confirma en la valoración de Luvania.",
    keyword: "acido hialuronico labios",
    secondary: ["perfilamiento de labios", "relleno de labios", "ácido hialurónico bogotá"],
    ...pendiente,
    references: labioRefs,
    blocks: [
      {
        id: "que-es",
        title: "Qué es el perfilamiento",
        paragraphs: [
          "Perfilar un labio es decidir proporción: hidratar, marcar el borde o sumar un volumen que siga siendo el tuyo. En este objetivo lo habitual es un gel de ácido hialurónico. La ficha de Luvania no cierra la marca: eso se confirma en la cita, con el médico.",
          "El ácido hialurónico es un azúcar que ya está en tu piel, en los ojos y en las articulaciones. StatPearls lo describe como una molécula que, por su carga, atrae agua, se hincha y da soporte. El gel de relleno es una versión modificada y entrecruzada, más resistente a que el cuerpo la deshaga de un día para otro.",
        ],
      },
      {
        id: "como-funciona",
        title: "Cómo ocupa un lugar y cómo se va",
        figure: {
          kind: "labio",
          alt: "Ilustración de un labio con un gel de ácido hialurónico en su interior y gotas que representan el agua que retiene. No es una foto clínica.",
          caption:
            "El gel se coloca en el labio, retiene agua y el cuerpo lo va degradando. El volumen que ves al inicio incluye la hinchazón.",
        },
        paragraphs: [
          "Al inyectarlo, el gel ocupa un lugar y retiene agua. StatPearls llama isovolumétrica a una parte de su degradación: mientras se deshace, el agua va ocupando ese sitio, y el volumen baja de a poco. El efecto es temporal.",
          "El etiquetado para pacientes de Juvéderm Ultra XC, un gel con lidocaína que la FDA indica para labios en adultos mayores de 21 años, dice que el volumen que aporta es temporal. StatPearls, hablando de rellenos en general, sitúa el efecto en unos meses según la zona, la marca y la técnica. No son la misma frase y no son el calendario de tu labio.",
        ],
      },
      {
        id: "procedimiento",
        title: "Cómo es el procedimiento",
        card: "Se diseña el borde y el volumen antes de inyectar. El gel va en la submucosa del labio. Puede haber anestesia en crema o la que trae el producto.",
        paragraphs: [
          "StatPearls describe la inyección de labio como submucosa. El etiquetado de ese gel de la FDA pide una técnica limpia y prohíbe inyectar dentro de un vaso.",
          "Si el resultado no convence, existe una enzima, la hialuronidasa, que degrada este gel. StatPearls la nombra para disolver un exceso o una complicación de vaso. No es un botón de deshacer automático ni un servicio que esta ficha publique aparte.",
        ],
      },
      {
        id: "preparacion",
        title: "Preparación",
        card: "Cuenta alergias, herpes, medicamentos y un embarazo posible. Un brote de herpes se espera.",
        paragraphs: [
          "El etiquetado contraindica el gel si hay alergia grave, alergia a proteínas de ciertas bacterias o alergia a la lidocaína, cuando el producto la trae. También pide aplazar la cita si hay infección o inflamación activa en el labio.",
          "Esta guía no ordena suspender aspirina, café o picante. Si algo de lo que tomas facilita el moretón, se habla en la cita.",
        ],
      },
      {
        id: "cuidados",
        title: "Cuidados posteriores",
        card: "Hielo si te lo indican, no frotar, y evitar sauna y ejercicio fuerte el primer día.",
        paragraphs: [
          "El etiquetado describe enrojecimiento, hinchazón y sensibilidad como algo de los primeros días, y nota que en el labio esa reacción suele durar más que en un pliegue de la cara. StatPearls pide hielo al terminar para bajar hinchazón y moretón.",
          "Dormir boca abajo el primer día aplasta el gel. La sede te deja el cuidado escrito. El protector entra en cuanto la piel lo tolere.",
        ],
      },
      {
        id: "efectos",
        title: "Efectos y contraindicaciones",
        card: "Lo esperable es hinchazón y, a veces, un moretón. Lo raro e importante es que el gel entre en un vaso, reactive un herpes o deje un nódulo.",
        paragraphs: [
          "StatPearls lista como efectos muy raros la infección, la necrosis si el gel tapa un vaso, el granuloma y la reactivación del herpes labial. El etiquetado de la FDA advierte lo mismo sobre el vaso: es una urgencia.",
          "Por eso el procedimiento es médico y se mira la anatomía del labio, no solo la foto. La proporción se acuerda en cantidad y en forma. No hay un molde garantizado.",
        ],
      },
      {
        id: "sesiones",
        title: "Sesiones y duración",
        paragraphs: [
          "El cambio se ve en la sesión, con la hinchazón encima. El resultado asentado se mira en el control, cuando esa hinchazón baja.",
          "Se puede avanzar por etapas. Repetir no tiene una fecha obligatoria: se conversa cuando el gel ya se reabsorbió y tú quieres seguir.",
        ],
      },
      {
        id: "cuando-consultar",
        title: "Cuándo consultar",
        paragraphs: [
          "Consulta si quieres definir o hidratar y no tienes infección ni un herpes en brote. Una expectativa de cambio extremo en una sola cita se habla antes, no después.",
          "Dolor que crece, la piel que se pone blanca o un cambio en la vista después de un relleno son motivo para volver de inmediato.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Queda artificial?",
        a: "El encargo es conservar tu gesto. El volumen se acuerda en cantidad y en forma, y se puede hacer por etapas.",
      },
      {
        q: "¿Duele?",
        a: "El labio es sensible. Se usa anestesia en crema o la que trae el producto. StatPearls también nombra el hielo.",
      },
      {
        q: "¿Qué material es?",
        a: "Lo habitual en este objetivo es un gel de ácido hialurónico. La marca y la presentación se confirman en la valoración: la ficha no las cierra.",
      },
      {
        q: "¿Se puede quitar?",
        a: "StatPearls describe la hialuronidasa, una enzima que degrada el gel. La decide un médico si hace falta. No es un deshacer automático.",
      },
    ],
  },
  {
    slug: "celulitis",
    h1: "Guía de la celulitis",
    title: "Guía de celulitis en Bogotá | Luvania",
    description:
      "Por qué la piel se ve irregular: unos tabiques tiran y la grasa empuja. Qué puede mejorar un plan de cabina y qué no borra una crema en Luvania.",
    keyword: "celulitis",
    secondary: ["piel de naranja", "celulitis en muslos", "celulitis bogotá"],
    ...pendiente,
    references: celulitisRefs,
    blocks: [
      {
        id: "que-es",
        title: "Qué es la celulitis",
        paragraphs: [
          "La celulitis es esa piel irregular, de naranja, casi siempre en muslos, cadera y glúteos. No es grasa de más a secas, ni falta de crema. Una revisión de Friedmann y colaboradores, en 2017, la describe como algo de varias causas: la forma del tejido bajo la piel, la tensión de unos tabiques y cambios de circulación que todavía se discuten.",
          "La ficha de Luvania la trabaja como plan —aparatología, drenaje, activos— y no como una sesión única. Puede mejorar y no desaparecer. La piel tiene memoria y los hábitos pesan.",
        ],
      },
      {
        id: "como-funciona",
        title: "Por qué se hunde y se abulta",
        figure: {
          kind: "septos",
          alt: "Ilustración de la piel con hoyuelos, tabiques fibrosos que tiran hacia abajo y lóbulos de grasa que empujan. No es una foto de un muslo.",
          caption:
            "Esquema del hoyuelo: el tabique fibroso ancla la piel y el lóbulo de grasa empuja al lado. No es una foto de resultado.",
        },
        paragraphs: [
          "Bajo la dermis hay lóbulos de grasa separados por tabiques que anclan la piel a la fascia. En muchas mujeres esos tabiques van más perpendiculares. Cuando la grasa empuja y el tabique tira, la superficie se hunde en unos puntos y se abulta en otros. La revisión cuenta que la resonancia ha visto tabiques más gruesos justo debajo de los hoyuelos.",
          "La AAD es franca con los tratamientos: unas técnicas que cortan el tabique tienen estudios, y muchas cremas y masajes dan un cambio breve o ninguno. El plan de cabina de Luvania no es una subcisión ni una cirugía. Busca circulación, tejido y constancia. No borra el hoyuelo por decreto.",
        ],
      },
      {
        id: "procedimiento",
        title: "Cómo es el procedimiento",
        card: "Se mira el grado: qué se ve de pie y qué aparece al pellizcar. El drenaje puede ser la base. La aparatología se suma si cabe.",
        paragraphs: [
          "No hay una receta única publicada. Quien te ve dice qué técnica entra ese día y cuál no, sobre todo si hay venas marcadas.",
          "La secuencia de tu sesión se confirma en la valoración. Esta guía no la inventa para llenar el hueco.",
        ],
      },
      {
        id: "preparacion",
        title: "Preparación",
        card: "Cuenta enfermedad, infección, embarazo, lactancia y cualquier procedimiento reciente en la zona.",
        paragraphs: [
          "Llega sin una crema espesa en el muslo, para que se pueda ver la textura.",
          "Esta guía no inventa una dieta con nombre. El movimiento y el peso cambian cómo se ve la piel. Un músculo más firme puede cambiar la superficie, y eso no es lo mismo que cortar el tabique.",
        ],
      },
      {
        id: "cuidados",
        title: "Cuidados posteriores",
        card: "Agua, movimiento suave y la pauta escrita. Algunas técnicas dejan la zona sensible ese día.",
        paragraphs: [
          "No se publica un número de días de reposo. Si hubo aparatología que calienta o presiona, la sede te dice qué evitar.",
          "Una crema no sostiene sola lo que la cabina empezó. El hábito de la semana pesa.",
        ],
      },
      {
        id: "efectos",
        title: "Efectos y contraindicaciones",
        card: "Puede doler el tejido y puede salir un moretón. Poco invasivo no significa indiferente. Venas marcadas, infección y embarazo se revisan aparte.",
        paragraphs: [
          "La AAD muestra que los resultados de muchas técnicas de cabina son modestos o temporales. Leer eso antes evita comprar un paquete como si fuera una cura.",
          "Una microinyección mal hecha sí puede hacer daño. Por eso la técnica, si entra, la hace quien está formado para ella.",
        ],
      },
      {
        id: "sesiones",
        title: "Sesiones y duración",
        paragraphs: [
          "Es de los protocolos que piden constancia. Un ciclo terminado no impide que la textura vuelva si el hábito y el tejido siguen iguales.",
          "No hay un número cerrado de sesiones en la ficha. Se fija cuando se ve el grado, de pie y al pellizcar.",
        ],
      },
      {
        id: "cuando-consultar",
        title: "Cuándo consultar",
        paragraphs: [
          "Consulta si te incomoda la textura, no si buscas bajar diez kilos. Esas son dos metas distintas.",
          "Dolor de una pierna, una vena que se inflama o un hoyuelo que crece rápido no son celulitis estética.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Se quita del todo?",
        a: "Puede mejorar y no desaparecer. Los tabiques y los hábitos siguen ahí cuando termina un ciclo.",
      },
      {
        q: "¿Duele?",
        a: "Algunas técnicas de tejido se sienten. Se avisa cuáles entran en tu sesión.",
      },
      {
        q: "¿Sirve el drenaje solo?",
        a: "Ayuda a la circulación. La AAD muestra que varias técnicas de masaje o de aparato, cuando cambian algo, lo hacen por poco tiempo. Casi nunca alcanza como único gesto.",
      },
    ],
  },
  {
    slug: "levantamiento-de-gluteos",
    h1: "Guía del levantamiento de glúteos",
    title: "Guía de glúteos sin cirugía | Luvania",
    description:
      "Qué sostiene la forma del glúteo y qué puede buscar un protocolo no quirúrgico. No es un implante. La mezcla se confirma en la valoración de Luvania.",
    keyword: "levantamiento de gluteos",
    secondary: ["gluteos sin cirugia", "glúteos bogotá", "firmeza de glúteos"],
    ...pendiente,
    references: gluteoRefs,
    blocks: [
      {
        id: "que-es",
        title: "Qué es este protocolo",
        paragraphs: [
          "El levantamiento de glúteos de Luvania es un protocolo no quirúrgico para firmeza y forma. La ficha lo describe sin implantes y sin un relleno inyectado por defecto. No aumenta una talla por decreto.",
          "La forma que ves la arman tres capas: la piel, la grasa y el músculo. StatPearls describe el glúteo mayor como el más superficial y el más grande de los tres, y como el músculo que extiende la cadera cuando te levantas, subes o corres. Un masaje no lo reemplaza. Un implante tampoco es lo que esta ficha ofrece.",
        ],
      },
      {
        id: "como-funciona",
        title: "De qué está hecha la forma",
        figure: {
          kind: "gluteo",
          alt: "Ilustración esquemática del glúteo: piel, grasa y el músculo glúteo mayor. No es una foto de un cuerpo.",
          caption:
            "Esquema de las tres capas. La forma depende de la piel, la grasa y el glúteo mayor. No representa un antes ni un después.",
        },
        paragraphs: [
          "Si el músculo está poco activo, la piel cede o la grasa se reparte de otra forma, el contorno cambia. Un protocolo de cabina puede buscar tono, circulación y piel. La mezcla exacta de cada sesión se confirma en la valoración, porque la ficha no cierra una secuencia única.",
          "Esta guía no te presta el resultado de una cirugía ni el de un aparato que aquí no está publicado. La firmeza que se pueda ganar convive con el movimiento que hagas el resto de la semana.",
        ],
      },
      {
        id: "procedimiento",
        title: "Cómo es el procedimiento",
        card: "Se mira simetría, piel y qué técnica entra ese día. No es una prótesis ni, por defecto, un relleno.",
        paragraphs: [
          "La sesión se explica antes: qué se va a sentir y qué no. Hay técnicas que son un masaje y otras que se sienten más.",
          "Entrenar no es lo mismo que una cita, y la cita no reemplaza el entrenamiento. StatPearls describe el glúteo mayor como el músculo que entra en juego al levantarte, al subir y al correr.",
        ],
      },
      {
        id: "preparacion",
        title: "Preparación",
        card: "Cuenta embarazo, infección de la piel, una cirugía reciente y si tienes un implante en la zona.",
        paragraphs: [
          "Llega hidratada. No hace falta una dieta con nombre. Sí hace falta decir si el glúteo duele o si hubo un procedimiento médico reciente.",
          "Si buscas varias tallas, dilo al empezar. El protocolo publicado no está hecho para esa meta.",
        ],
      },
      {
        id: "cuidados",
        title: "Cuidados posteriores",
        card: "Movimiento suave y la pauta de la sede. El músculo se mantiene con uso, no solo con la cita.",
        paragraphs: [
          "Si la técnica dejó la zona sensible, se evita el esfuerzo fuerte ese día. El plazo te lo escriben al salir.",
          "Caminar, subir y entrenar son parte de conservar el tono. La cabina no los sustituye.",
        ],
      },
      {
        id: "efectos",
        title: "Efectos y contraindicaciones",
        card: "Puede haber molestia o un moretón según la técnica. Embarazo, infección y una cirugía reciente se dicen antes.",
        paragraphs: [
          "No se inventa aquí una lista de efectos de un aparato que la ficha no cierra. Lo que sí se dice es que puede mejorar la forma y el tono, y puede no alcanzar lo que imaginaste.",
          "Esa conversación es la valoración, no una sorpresa al final de un paquete.",
        ],
      },
      {
        id: "sesiones",
        title: "Sesiones y duración",
        paragraphs: [
          "La duración cambia con la técnica y con el movimiento de la semana. La ficha no publica un número de sesiones ni un plazo récord.",
          "El control decide si se repite, mirando simetría y piel, no una talla de pantalón.",
        ],
      },
      {
        id: "cuando-consultar",
        title: "Cuándo consultar",
        paragraphs: [
          "Consulta si quieres un glúteo más firme y entiendes que el músculo también se construye caminando, subiendo y entrenando.",
          "Dolor que impide sentarte, un moretón que crece o fiebre después de una sesión se avisan el mismo día.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Aumenta varias tallas?",
        a: "No es una promesa. Puede mejorar forma y tono. Un implante es otra conversación, y no es este protocolo.",
      },
      {
        q: "¿Duele?",
        a: "Hay técnicas que se sienten y otras que son un masaje. Se explica la secuencia antes de empezar.",
      },
      {
        q: "¿Reemplaza el ejercicio?",
        a: "No. StatPearls describe el glúteo mayor como el músculo que trabaja al levantarte y al subir. La cabina no hace ese trabajo por ti.",
      },
    ],
  },
  {
    slug: "hair-loss",
    h1: "Guía de la caída del cabello",
    title: "Guía de caída del cabello | Luvania",
    description:
      "El cabello crece por ciclos. Esta guía separa la caída difusa de la que encoge el folículo, y qué puede mirar un protocolo estético de Luvania.",
    keyword: "caida del cabello",
    secondary: ["caída del cabello bogotá", "alopecia", "efluvio telógeno"],
    ...pendiente,
    references: peloRefs,
    blocks: [
      {
        id: "que-es",
        title: "Qué es esta caída",
        paragraphs: [
          "El cabello no crece todo el tiempo. Cada folículo pasa por una fase de crecimiento, una de frenado y una de reposo en la que el pelo se suelta. La revisión de alopecias de StatPearls llama a esas fases anagén, catagén y telogén.",
          "Caída no es una sola enfermedad. La AAD separa, entre otras, la pérdida hereditaria —el folículo se encoge—, la caída difusa después de un estrés, un parto o una enfermedad, la tracción de un peinado apretado y las infecciones del cuero. Luvania publica un protocolo estético después de mirar el cuero cabelludo. Si la causa es médica, se dice.",
        ],
      },
      {
        id: "como-funciona",
        title: "Dos caminos distintos",
        figure: {
          kind: "ciclo",
          alt: "Ilustración de tres folículos en anagén, catagén y telogén. El pelo largo crece, el intermedio se detiene y el corto se suelta. No es una foto de un cuero cabelludo.",
          caption:
            "El ciclo del folículo: crece, se detiene y se suelta. Una caída abundante puede ser muchos folículos entrando juntos a la fase de reposo.",
        },
        paragraphs: [
          "En la pérdida hereditaria, que la AAD llama la causa más común, el folículo se va achicando y el pelo sale más fino y más corto. En el hombre suele empezar en las entradas o en la coronilla. En la mujer, en la raya que se abre. StatPearls añade que, en las caídas que no dejan cicatriz, el folículo sigue ahí: a veces puede volver a dar un pelo, y a veces ya no.",
          "El efluvio telógeno es otra historia. Un disparador —fiebre, parto, déficit, un susto grande— manda muchos folículos a la fase de reposo. StatPearls sitúa la caída abundante unos meses después del evento. La AAD dice que, si el disparador cesa, muchas personas ven volver el volumen en unos meses. Eso describen esas fuentes. No es una fecha para tu almohada y no promete una melena.",
        ],
      },
      {
        id: "procedimiento",
        title: "Cómo es el procedimiento",
        card: "Se mira el cuero, el patrón y la historia. El protocolo estético puede incluir activos, plasma o aparatología. Si hay punción, se explica antes.",
        paragraphs: [
          "Esta guía no inventa una secuencia cerrada. Lo que sí exige es distinguir una caída que puede verse en cabina de una que se deriva.",
          "El nombre de la oferta publicada es Pérdida de cabello. El precio, si está vigente, se confirma en Promociones. No se decide en esta página.",
        ],
      },
      {
        id: "preparacion",
        title: "Preparación",
        card: "Cuenta partos, fiebres, dietas, peinados apretados, medicamentos y antecedentes en la familia.",
        paragraphs: [
          "Sin esa historia no se distingue un efluvio de una alopecia que no es de cabina.",
          "Si tienes análisis recientes, tráelos. No los interpretes sola: se leen en la valoración, junto con lo que se ve en el cuero.",
        ],
      },
      {
        id: "cuidados",
        title: "Cuidados posteriores",
        card: "Si hubo punción, no frotes el cuero el primer día. El calor de sauna o el esfuerzo fuerte se confirman con la sede.",
        paragraphs: [
          "Un champú no reemplaza el diagnóstico. La ficha empieza por el cuero cabelludo, no por un producto genérico.",
          "Un peinado que tira todos los días puede apagar el folículo. La AAD llama a eso alopecia por tracción, y advierte que el daño repetido puede ser definitivo.",
        ],
      },
      {
        id: "efectos",
        title: "Efectos y contraindicaciones",
        card: "Depende de la técnica. Una microinyección puede doler un momento. Un folículo ya destruido no vuelve a dar pelo.",
        paragraphs: [
          "No se inventa aquí una lista de efectos de un aparato que la ficha no cierra. Lo que sí se puede decir, con la AAD, es que un folículo dañado por tracción o por una cicatriz no vuelve a producir pelo.",
          "Una calva antigua, si el folículo ya no está activo, no siempre se repuebla. La ficha lo dice y esta guía lo sostiene. Prometer lo contrario sería inventar.",
        ],
      },
      {
        id: "sesiones",
        title: "Sesiones y duración",
        paragraphs: [
          "El pelo nuevo, cuando aparece, tarda meses, porque el ciclo es lento. La ficha no ofrece un plazo de dos semanas.",
          "Los calendarios cerrados —menos caída en tres semanas, más volumen al mes— no se republican. El control mira tu cuero, no un folleto.",
        ],
      },
      {
        id: "cuando-consultar",
        title: "Cuándo consultar",
        paragraphs: [
          "Consulta si notas más cabello en la almohada, una raya más amplia o una entrada que avanza, y aceptas que algunas caídas son médicas.",
          "Placas lisas, pus, dolor del cuero o una caída de cejas y pestañas se miran como enfermedad, no como un protocolo estético.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Me crece en zonas calvas antiguas?",
        a: "No siempre. Depende de si el folículo sigue activo. La AAD explica que, cuando el folículo se dañó de forma definitiva, de ahí no vuelve a salir pelo.",
      },
      {
        q: "¿Duele?",
        a: "Depende de si hay microinyección. Se explica antes de empezar.",
      },
      {
        q: "¿La caída después de una fiebre o un parto es la misma que la hereditaria?",
        a: "No. StatPearls separa el efluvio telógeno, que es difuso y suele ir detrás de un disparador, de la caída en la que el folículo se encoge.",
      },
    ],
  },
];

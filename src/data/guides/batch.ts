import type { Guide } from "./types";

const pendiente = {
  medicalReview: "pendiente" as const,
  revisadoPor: null,
  fechaRevision: null,
};

export const guides: Guide[] = [
  {
    slug: "toxina-botulinica-tipo-a",
    h1: "Guía de la toxina botulínica, el bótox",
    title: "Botox en Bogotá: guía de la toxina | Luvania",
    description:
      "Qué es el bótox, cómo se aplica la toxina botulínica y qué cuidados describía la ficha anterior. La dosis se define en la valoración de Luvania.",
    keyword: "botox",
    secondary: ["toxina botulinica", "toxina botulínica tipo A", "botox bogota"],
    ...pendiente,
    blocks: [
      {
        id: "que-es",
        title: "Qué es, con el nombre que la gente busca",
        paragraphs: [
          "Bótox es el nombre con el que casi todo el mundo busca este procedimiento. En la ficha el nombre es toxina botulínica tipo A: un fármaco que relaja, de forma temporal, músculos que marcan líneas al gesticular. La página publicada lo describe para frente, entrecejo y patas de gallo.",
          "La ficha anterior también hablaba de hiperhidrosis y de bruxismo. No es el mismo punto ni la misma dosis que una arruga de expresión. Papada y flacidez no son su indicación principal: eso ya está dicho en la pregunta publicada de la ficha.",
        ],
      },
      {
        id: "como-funciona",
        title: "Cómo funciona",
        paragraphs: [
          "La toxina disminuye la orden que el nervio le manda al músculo. Si el músculo se mueve menos, la línea de expresión se marca menos. La intención publicada es modular el gesto, no dejar la cara quieta.",
          "La página anterior la presentaba como una sustancia usada desde hace años en medicina, y separaba marcas y presentaciones. Esa lista no se repite aquí como catálogo de compra: la presentación la elige quien aplica, en la valoración.",
        ],
      },
      {
        id: "procedimiento",
        title: "Cómo es el procedimiento",
        card: "Se aplica con aguja fina en músculos de expresión. Los puntos y la dosis se acuerdan antes, para modular el gesto y no borrarlo.",
        paragraphs: [
          "En la ficha publicada el procedimiento es una aplicación con aguja fina. A veces se usa anestesia tópica. Hay quien solo siente el pinchazo.",
          "La página anterior insistía en que la dosis importa: poca o mal puesta no cumple el encargo, y de más puede cambiar un gesto que no se quería tocar. Por eso el mapa de puntos se habla antes de abrir el frasco.",
        ],
      },
      {
        id: "preparacion",
        title: "Preparación",
        card: "Hay que contar enfermedades, medicamentos y una sospecha de embarazo. La ficha anterior pedía evitar anticoagulantes, alcohol, picante y café antes de la cita.",
        paragraphs: [
          "La ficha anterior decía que no pedía muestras de sangre ni de orina por no ser cirugía. Sí pedía contar el estado de salud: enfermedades, medicamentos, alergias y sospecha de embarazo.",
          "También recomendaba, antes de la cita, no tomar antiinflamatorios con efecto anticoagulante (nombraba la aspirina), ni alcohol, picante o café, por el efecto sobre los vasos. Eso era una recomendación del texto viejo, no una orden nueva: confírmala en la sede.",
        ],
      },
      {
        id: "cuidados",
        title: "Cuidados posteriores",
        card: "El texto anterior pedía permanecer erguido las primeras horas, no masajear la zona y cuidar el sol, para que el producto no se desplace.",
        paragraphs: [
          "Después de la aplicación, la página anterior pedía no acostarse durante las primeras horas y mantenerse erguido. Pedía no masajear el área durante un par de días y no frotar ni tocar la zona el primer día, para que la toxina no pasara a un músculo vecino.",
          "También pedía evitar el sol directo y usar protección. Esas ventanas de tiempo salían del texto viejo. Mientras esta guía no tenga revisión médica, no las tomes como instrucción vigente: te las confirman por escrito al salir.",
        ],
      },
      {
        id: "efectos",
        title: "Efectos y contraindicaciones",
        card: "Puede haber marca del pinchazo. Si el producto se mueve, el gesto cambia. Embarazo, enfermedad activa y los medicamentos se revisan antes. No es un procedimiento sin riesgo.",
        paragraphs: [
          "La ficha publicada ya dice que duele como un pinchazo breve. El texto anterior añadía que, si la toxina migra, puede afectar un músculo que no estaba en el plan. Por eso el cuidado de no tocar es parte del procedimiento, no un detalle.",
          "No se publica como algo sin riesgo ni con resultado garantizado. Embarazo, infección en la zona y cualquier medicamento —sobre todo los que alteran la coagulación— se conversan antes. Quien aplica tiene que ser personal médico: la página anterior lo decía y la ficha actual no lo contradice.",
        ],
      },
      {
        id: "sesiones",
        title: "Sesiones y duración",
        paragraphs: [
          "La página anterior daba plazos concretos: cambios a los pocos días y una duración de unos meses, más larga cuando el uso era hiperhidrosis. Esos números eran una promesa de calendario.",
          "Aquí no se repiten. El efecto es temporal —el músculo vuelve a moverse— y el momento de repetir se decide en el control, con lo que se vea en tu cara, no con una fecha impresa.",
        ],
      },
      {
        id: "cuando-consultar",
        title: "Cuándo consultar",
        paragraphs: [
          "Pide valoración si las líneas que te molestan aparecen al mover la cara, o si el sudor de axilas, manos o cara ya se habló como hiperhidrosis. Si lo que ves es papada, flacidez o un surco quieto, la propia ficha te manda a otro protocolo.",
          "Si después de una aplicación el párpado, la ceja o la sonrisa se sienten distintos de lo acordado, vuelve a la sede. No lo corrijas masajeando.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Me va a quedar la cara quieta?",
        a: "La intención es modular el músculo, no borrar el gesto. Eso se acuerda antes.",
      },
      {
        q: "¿Duele?",
        a: "Se usa una aguja fina. A veces, anestesia tópica. Hay quien siente un pinchazo breve.",
      },
      {
        q: "¿Sirve para la papada?",
        a: "No es su indicación principal. Papada y flacidez se valoran con otros protocolos.",
      },
      {
        q: "¿Bótox y toxina botulínica son cosas distintas?",
        a: "Bótox es el nombre con el que se busca. La ficha habla de toxina botulínica tipo A. La marca y la presentación se confirman en la cita.",
      },
    ],
  },
  {
    slug: "acne",
    h1: "Guía del acné: brote, marca y qué no prometer",
    title: "Guía del acné en Bogotá | Luvania",
    description:
      "Cómo se forma el brote, qué describía la ficha anterior y por qué un plan facial no reemplaza la dermatología si el acné es médico. En Luvania.",
    keyword: "acne",
    secondary: ["acné tratamiento", "marcas de acné", "acné facial"],
    ...pendiente,
    blocks: [
      {
        id: "que-es",
        title: "Qué es el acné, sin el porcentaje",
        paragraphs: [
          "La ficha publicada lo deja en una frase: es un plan facial para brotes, marca y textura, y no sustituye un tratamiento dermatológico cuando el acné es médico. La página anterior abría con una cifra de pacientes «curados». Esa cifra no se usa.",
          "El texto viejo explicaba el brote desde la unidad pilosebácea: el folículo se tapa, se inflama y, si se lastima, deja marca. Separaba acné leve o comedónico, moderado con pápulas y pústulas, severo, y la cicatriz que queda después.",
        ],
      },
      {
        id: "como-funciona",
        title: "Cómo se aborda en cabina",
        paragraphs: [
          "La página anterior nombraba mascarilla salicílica, extracción y, en otro apartado, detoxificación y medicamentos tópicos. También advertía lo que pasa cuando alguien exprima el brote sin formación: más inflamación y más marca.",
          "La ficha actual es más estrecha: la extracción, si se hace, es selectiva. Lastimar la piel empeora la marca. No toda aparatología se aplica sobre un brote infectado. Se puede ir a la valoración con el brote activo; otra cosa es tratarlo ese día.",
        ],
      },
      {
        id: "procedimiento",
        title: "Cómo es el procedimiento",
        card: "Valoración del brote y, si cabe, limpieza selectiva. No se exprime todo. Si el acné es médico, el plan facial no lo reemplaza.",
        paragraphs: [
          "No hay una secuencia única publicada. Lo que sí está escrito es el límite: no se exprime todo el rostro, y un brote con infección no es terreno para cualquier aparato.",
          "La página anterior detallaba cómo actuaría una mascarilla salicílica sobre el folículo. Ese mecanismo se deja como antecedente del texto viejo. El protocolo del día lo arma quien te ve, no esta página.",
        ],
      },
      {
        id: "preparacion",
        title: "Preparación",
        card: "No te automediques ni toques el brote antes de la cita. Lleva la lista de cremas y medicamentos que ya estás usando.",
        paragraphs: [
          "La ficha anterior pedía no automedicarse y no tocar la zona ni los alrededores, con las manos o con productos, hasta tener indicación.",
          "También recomendaba jabón neutro, evitar jabones abrasivos, alcohol y el roce constante, y apartar cosméticos con base aceitosa. Esas son pautas del texto viejo para quien ya está en un plan, no una receta para empezar solo.",
        ],
      },
      {
        id: "cuidados",
        title: "Cuidados posteriores",
        card: "La página anterior pedía jabón neutro, cosméticos que no sean aceitosos y no tapar el folículo con cremas oclusivas.",
        paragraphs: [
          "Después de una limpieza, la piel queda más sensible. El texto viejo pedía no volver a irritarla con alcohol, almohadillas abrasivas o el cabello pegado a la frente.",
          "Si en la valoración te formulaban un tópico, el mismo texto decía que algunos resecan y que ciertos antibióticos orales aumentan la sensibilidad al sol. Luvania no publica aquí una fórmula. Si hay medicamento, lo explica quien lo prescribe, con la fotoprotección que corresponda.",
        ],
      },
      {
        id: "efectos",
        title: "Efectos y contraindicaciones",
        card: "Según el texto anterior, algunos tópicos resecan y enrojecen. Un brote infectado no se trata con cualquier aparatología.",
        paragraphs: [
          "La página anterior ataba los efectos al producto: resequedad, enrojecimiento y, con algunos antibióticos orales, reacción al sol. No los presentaba como raros ni como inexistentes.",
          "No entra en un plan de cabina quien necesite dermatología por un acné severo, ni una aparatología sobre infección. Embarazo y medicamentos se dicen en la valoración. La promesa de que el brote «se quita» o de un porcentaje de pacientes no está en esta guía.",
        ],
      },
      {
        id: "sesiones",
        title: "Sesiones y duración",
        paragraphs: [
          "La ficha publicada dice que las manchas del acné se pueden atenuar y que el plazo depende de la profundidad de la marca. No da un número de sesiones.",
          "La página anterior hablaba de notar cambios a las pocas semanas, de un empeoramiento inicial y de seguir meses o años. Esos calendarios no se republican. El plan se escribe cuando se ve el brote.",
        ],
      },
      {
        id: "cuando-consultar",
        title: "Cuándo consultar",
        paragraphs: [
          "Ven a valoración si hay brotes, marca o textura que quieras trabajar en cabina. Ven también —y dilo— si el acné es nodular, duele o no ha respondido a lo que ya probaste: ahí el camino puede ser médico, no estético.",
          "No esperes a que esta página te diga el jabón exacto. La ficha anterior ya pedía especialista antes que automedicación.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Me lo van a exprimir todo?",
        a: "La extracción, si se hace, es selectiva. Lastimar la piel empeora la marca.",
      },
      {
        q: "¿Puedo venir con brote activo?",
        a: "Sí a la valoración. No toda aparatología se aplica sobre infección.",
      },
      {
        q: "¿Quitan las manchas del acné?",
        a: "Se pueden atenuar. El plazo depende de la profundidad de la marca.",
      },
    ],
  },
  {
    slug: "eliminar-ojeras",
    h1: "Guía de ojeras: color, surco y lo que no es una bolsa",
    title: "Guía de ojeras en Bogotá | Luvania",
    description:
      "La ojera puede ser pigmento, circulación o surco. La ficha anterior listaba tipos y cuidados; el plan se escribe en la valoración, en Bogotá.",
    keyword: "ojeras",
    secondary: ["eliminar ojeras", "ojeras bogotá", "surco de ojera"],
    ...pendiente,
    blocks: [
      {
        id: "que-es",
        title: "Qué es una ojera",
        paragraphs: [
          "La ficha publicada separa tres motivos: pigmento, circulación superficial o un surco hundido. No todo se trata igual. Una bolsa no es una ojera: la bolsa es volumen y tiene ficha aparte.",
          "La página anterior abría el abanico: ojera por flacidez, hundida, pigmentada, circulatoria y transitoria. Esa clasificación ayuda a no pedir el mismo gesto para causas distintas. No autoriza a prometer que la mirada «se borra».",
        ],
      },
      {
        id: "como-funciona",
        title: "Cómo se decide el camino",
        paragraphs: [
          "Hoy la ficha dice que, después de separar el motivo, se propone despigmentación, calidad de piel o soporte. La página anterior nombraba ácido hialurónico en el reborde, peeling y otras tecnologías. Esas técnicas no se listan aquí como menú cerrado: varias no tienen ficha verificada propia.",
          "El texto viejo decía que el resultado de un relleno se veía enseguida y duraba años, y que otras técnicas hacían desaparecer las bolsas. Esas frases son promesas. No se repiten. Cada piel y cada profundidad cambian lo que se puede hacer, y eso se dice en la cita.",
        ],
      },
      {
        id: "procedimiento",
        title: "Cómo es el procedimiento",
        card: "Primero se distingue color, vasitos o surco. Recién ahí se propone piel, pigmento o soporte. Una bolsa no se trata como una ojera.",
        paragraphs: [
          "No hay un paso a paso único en la ficha actual. Lo estable es el orden: historia de la zona, tipo de ojera y recién entonces la técnica.",
          "Si el camino fuera un producto inyectado o un peeling, la página anterior pedía historia clínica previa, incluyendo medicamentos y tratamientos estéticos anteriores. La piel oscura y el melasma se nombraban como un cuidado especial, porque algunas luces pueden empeorar la mancha.",
        ],
      },
      {
        id: "preparacion",
        title: "Preparación",
        card: "La ficha anterior pedía evitar el sol los días previos y decir si tomas algo fotosensible o si tienes melasma.",
        paragraphs: [
          "El texto viejo pedía evitar el sol antes de la cita y ser explícito con medicamentos fotosensibles. También pedía contar cualquier procedimiento estético reciente.",
          "Si hay manchas o melasma, dilo aunque no sea el motivo de la cita. La misma página advertía que un equipo de luz puede oscurecerlas.",
        ],
      },
      {
        id: "cuidados",
        title: "Cuidados posteriores",
        card: "El material anterior pedía protector en la zona y no hacer peelings ni otros gestos agresivos en los días siguientes.",
        paragraphs: [
          "Después, la página anterior pedía protector solar y evitar el sol, y no aplicar peelings ni otros tratamientos agresivos mientras la piel siguiera sensible. Daba una ventana de días. Esa ventana no se convierte aquí en una regla vigente: te la confirman según la técnica que sí te hayan hecho.",
          "El maquillaje depende de la técnica. La ficha publicada ya dice que lo indican por escrito al salir.",
        ],
      },
      {
        id: "efectos",
        title: "Efectos y contraindicaciones",
        card: "El texto anterior describía hinchazón y enrojecimiento leves, y una costra si la piel es muy sensible a la luz. No hablaba de un procedimiento sin efectos.",
        paragraphs: [
          "La página anterior esperaba hinchazón y enrojecimiento que bajan en días, y una costra pequeña si la piel reacciona a la luz. También listaba riesgos poco comunes ligados a mala práctica o a un producto indebido: quistes, asimetría, irregularidades.",
          "No se publica como algo de pocos efectos ni como solución de raíz. El propio texto viejo reconocía que el gesto no quita la causa y que suele haber que repetir. Pigmento casi nunca se resuelve en una sesión: eso ya está en la ficha.",
        ],
      },
      {
        id: "sesiones",
        title: "Sesiones y duración",
        paragraphs: [
          "La ficha dice que en pigmento casi nunca basta una sesión. El plan se escribe en la valoración.",
          "Los plazos del texto anterior —efecto inmediato, duración de años, bolsas que desaparecen— no se republican. Son el tipo de calendario que esta guía deja fuera.",
        ],
      },
      {
        id: "cuando-consultar",
        title: "Cuándo consultar",
        paragraphs: [
          "Consulta si el oscuro bajo el ojo te cambia la cara aunque duermas, y si no sabes si es color, vasito o surco. Si lo que cuelga es una bolsa de volumen, mira la ficha de bolsas.",
          "Alergia, tiroides o una bolsa que es grasa se nombran en la ficha publicada: ahí se dice qué sí entra en un protocolo estético y qué no.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Es lo mismo que las bolsas?",
        a: "No. La bolsa es volumen; la ojera es color o surco. Hay ficha aparte.",
      },
      {
        q: "¿Con una sesión basta?",
        a: "Casi nunca en pigmento. El plan se escribe en la valoración.",
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
      "La ficha anterior describía el perfilamiento de labios con ácido hialurónico. La presentación vigente se confirma en la valoración, no en esta guía.",
    keyword: "acido hialuronico",
    secondary: ["relleno de labios", "perfilamiento de labios", "aumento de labios"],
    ...pendiente,
    blocks: [
      {
        id: "que-es",
        title: "Qué es, y qué nombre busca la gente",
        paragraphs: [
          "Quien busca «ácido hialurónico» en Colombia casi siempre está pensando en labios, surcos o pómulos. Esta guía es la del perfilamiento de labios. La ficha publicada habla de diseñar el labio para hidratar, definir el borde o sumar volumen, con criterio médico.",
          "La página anterior explicaba el ácido hialurónico como un gel que el cuerpo ya fabrica y que, puesto en el labio, se reabsorbe. La ficha actual todavía no cierra marca ni presentación: esa frase sigue en revisión interna. Por eso aquí se cuenta lo que el texto viejo describía, y la cita confirma el producto del día.",
        ],
      },
      {
        id: "como-funciona",
        title: "Cómo funciona",
        paragraphs: [
          "Según la página anterior, el gel ocupa un espacio, dibuja el borde o da volumen, y con los meses el organismo lo va degradando. El efecto no es definitivo. Eso es lo contrario de una promesa de por vida.",
          "El encargo publicado es conservar tu gesto. El volumen se acuerda en mililitros y en forma, no en una foto de otra persona.",
        ],
      },
      {
        id: "procedimiento",
        title: "Cómo es el procedimiento",
        card: "Se diseña borde y volumen, y se aplica con anestesia. La ficha anterior lo describía con ácido hialurónico; la presentación se confirma en la cita.",
        paragraphs: [
          "La ficha publicada dice que se usa anestesia tópica o la que trae el producto, y que el labio es una zona sensible.",
          "La página anterior no pedía exámenes de sangre por no ser cirugía, y sí una historia: enfermedades, medicamentos, alergias, embarazo. El dibujo se hace antes de inyectar. Si el resultado no convence, el mismo texto mencionaba la hialuronidasa como forma de degradar ese gel. No es un botón de deshacer automático ni está ofrecida como servicio publicado: es un dato del archivo.",
        ],
      },
      {
        id: "preparacion",
        title: "Preparación",
        card: "Cuenta enfermedades, alergias y medicamentos. El texto anterior pedía evitar anticoagulantes, alcohol, picante, café y aceite de pescado.",
        paragraphs: [
          "Igual que en otras aplicaciones con aguja, la página anterior pedía suspender —si el médico está de acuerdo— antiinflamatorios que favorecen el moretón, alcohol, picante, café y aceite de pescado.",
          "Embarazo, lactancia, alergia a anestésicos y enfermedades inmunológicas figuraban como motivos para no hacer el procedimiento. Dilos aunque nadie pregunte a la primera.",
        ],
      },
      {
        id: "cuidados",
        title: "Cuidados posteriores",
        card: "La página anterior pedía no frotar el labio el primer día, no hacer ejercicio ni sauna, no dormir boca abajo y usar protector.",
        paragraphs: [
          "El texto viejo pedía no masajear, no presionar y no hacer muecas exageradas el primer día, para que el gel no se mueva. Tampoco ejercicio, sauna o vapor en esas horas, ni dormir boca abajo los primeros días.",
          "Pedía protector solar. El hielo se mencionaba para bajar la hinchazón. Son cuidados del archivo, pendientes de que el equipo médico los confirme como instrucción actual.",
        ],
      },
      {
        id: "efectos",
        title: "Efectos y contraindicaciones",
        card: "El archivo nombra moretones, hinchazón, bolitas, asimetría, alergia e infección. Embarazo, lactancia y alergia a la anestesia figuraban como contraindicaciones.",
        paragraphs: [
          "La página anterior listaba moretones, hinchazón, granulomas, irregularidades, asimetrías, enrojecimiento, infección y reacción al producto. Decía que la alergia es poco frecuente porque el gel se parece a algo del cuerpo. «Poco frecuente» no es «sin riesgo».",
          "Contraindicado, en ese texto, para enfermedades inmunológicas, alergia a anestésicos, embarazo y lactancia. Un labio que «queda artificial» es justo lo que la ficha publicada dice que se evita acordando forma y cantidad.",
        ],
      },
      {
        id: "sesiones",
        title: "Sesiones y duración",
        paragraphs: [
          "La página anterior decía que el cambio se ve en la sesión y que el gel se reabsorbe en meses, con una horquilla amplia según la persona, el sol, el tabaco y la marca. Publicar esa horquilla como duración garantizada es el tipo de plazo que esta guía no repite.",
          "Si hace falta un retoque, se decide cuando se ve cómo quedó el labio, no con una fecha de folleto.",
        ],
      },
      {
        id: "cuando-consultar",
        title: "Cuándo consultar",
        paragraphs: [
          "Pide valoración si quieres definir el borde, hidratar o sumar un volumen que siga siendo tu boca. Trae, si las tienes, fotos de un rato en el que el labio te gustaba, no solo de una tendencia.",
          "Si ya tienes producto de otra sede y notas bolitas, asimetría o dolor, dilo antes de agregar más.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Queda artificial?",
        a: "El encargo es conservar tu gesto. El volumen se acuerda en mililitros y en forma.",
      },
      {
        q: "¿Duele?",
        a: "Se usa anestesia tópica o la que trae el producto. El labio es una zona sensible.",
      },
      {
        q: "¿Qué material es?",
        a: "La página anterior describía ácido hialurónico. La presentación que se usa hoy se confirma en la valoración: la ficha publicada aún no la cierra.",
      },
    ],
  },
  {
    slug: "celulitis",
    h1: "Guía de la celulitis, sin crema milagro",
    title: "Guía de celulitis en Bogotá | Luvania",
    description:
      "Qué describía la ficha anterior sobre la piel de naranja, qué técnicas agrupaba y por qué no se promete quitarla del todo. Valoración en Bogotá.",
    keyword: "celulitis",
    secondary: ["piel de naranja", "tratamiento celulitis", "celulitis en piernas"],
    ...pendiente,
    blocks: [
      {
        id: "que-es",
        title: "Qué es la celulitis en esta ficha",
        paragraphs: [
          "La ficha publicada la llama piel de naranja y la ata a circulación, tejido y hábitos. Dice que puede mejorar mucho y no desaparecer. La página anterior la explicaba como un cambio de la microcirculación, no como una imperfección que una crema resuelve.",
          "Ese texto separaba grados y tipos: flácida, dura, edematosa y fibrosa. La clasificación servía para no tratar todas las pieles con el mismo aparato. No se copia aquí un grado numérico como diagnóstico: eso se mira en la pierna, no en una guía.",
        ],
      },
      {
        id: "como-funciona",
        title: "Qué técnicas agrupaba la página anterior",
        paragraphs: [
          "La ficha vieja metía en el mismo capítulo drenaje linfático manual, presoterapia, cavitación, radiofrecuencia, carboxiterapia y mesoterapia. No todas tienen hoy una ficha verificada. El drenaje sí está publicado, y la ficha de celulitis ya dice que ayuda y que casi nunca alcanza solo.",
          "El objetivo que ese texto se ponía —«eliminar la celulitis»— no se mantiene. Se mantiene la idea de trabajar circulación y tejido, y de que, si vuelve el hábito que la marcó, la piel puede marcarse otra vez.",
        ],
      },
      {
        id: "procedimiento",
        title: "Cómo es el procedimiento",
        card: "Se mira el tipo de piel de naranja y se arma un plan de cabina. El drenaje ayuda y casi nunca alcanza como único gesto.",
        paragraphs: [
          "No hay una secuencia única vigente. La valoración dice qué técnica cabe. La página anterior usaba el drenaje como base y sumaba aparatología según el caso.",
          "Beber agua antes de la sesión salía en ese texto, para facilitar el trabajo linfático. Es una recomendación del archivo, no un requisito que esta página imponga.",
        ],
      },
      {
        id: "preparacion",
        title: "Preparación",
        card: "Cuenta si hay problemas de circulación, corazón, embarazo o una infección. El texto viejo pedía agua antes del drenaje.",
        paragraphs: [
          "Antes de cualquier aparatología de cuerpo, la página anterior pedía decir si hay enfermedad, y en particular procesos oncológicos, infección, embarazo o lactancia.",
          "Para el drenaje listaba motivos para no hacerlo: edemas de origen cardíaco, hipotensión, flebitis, trombosis, inflamación aguda, insuficiencia cardíaca descompensada y enfermedad renal. La presoterapia sumaba problemas circulatorios e hipertensión. Si alguno te suena, dilo antes de acostarte en la camilla.",
        ],
      },
      {
        id: "cuidados",
        title: "Cuidados posteriores",
        card: "La ficha publicada insiste en los hábitos. El texto anterior no daba una crema de cierre: decía que la piel puede volver a marcarse.",
        paragraphs: [
          "No hay en el archivo un ritual largo de cremas posteriores. Lo que sí hay, en la ficha actual, es la frase de que la piel tiene memoria y los hábitos pesan.",
          "Si la técnica fue con microinyección, el texto viejo esperaba moretón, ardor o dolor leve. Eso se cuida como cualquier punción: no lo tapes con un ungüento que nadie te indicó.",
        ],
      },
      {
        id: "efectos",
        title: "Efectos y contraindicaciones",
        card: "En microinyección, el archivo nombra moretones, ardor e irregularidades. Embarazo, infección y varias enfermedades de la circulación quedaban fuera.",
        paragraphs: [
          "La página anterior decía que las técnicas de cabina eran poco invasivas y, en el mismo párrafo, que una microinyección mal hecha sí puede hacer daño. Las dos frases no se resumen como «sin riesgo».",
          "Efectos que ese texto asociaba a las microinyecciones: hematomas, ardor, dolor leve o moderado, reacciones de la piel y hundidos. Contraindicaciones generales: pacientes oncológicos, infección activa, y embarazo o lactancia solo con el médico del control prenatal.",
        ],
      },
      {
        id: "sesiones",
        title: "Sesiones y duración",
        paragraphs: [
          "Ni la ficha actual ni esta guía dan un número de sesiones. La página anterior condicionaba cualquier resultado a un diagnóstico bien hecho y advertía que un ciclo terminado no impide que la piel de naranja vuelva.",
          "Por eso la pregunta publicada —«¿se quita del todo?»— se responde igual aquí: puede mejorar y no desaparecer.",
        ],
      },
      {
        id: "cuando-consultar",
        title: "Cuándo consultar",
        paragraphs: [
          "Ven si la textura de muslos, cadera o glúteos te importa y quieres saber qué técnica de las publicadas cabe. No vengas buscando que una sesión deje la piel lisa.",
          "Si estás embarazada, en tratamiento oncológico o con una trombosis reciente, la valoración tiene que empezar por ahí, no por el aparato.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Se quita del todo?",
        a: "Puede mejorar mucho y no desaparecer. La piel tiene memoria y los hábitos pesan.",
      },
      {
        q: "¿Duele?",
        a: "Algunas técnicas de tejido se sienten. Se avisa cuáles.",
      },
      {
        q: "¿Sirve el drenaje solo?",
        a: "Ayuda. Casi nunca alcanza como único gesto.",
      },
    ],
  },
  {
    slug: "levantamiento-de-gluteos",
    h1: "Guía del levantamiento de glúteos",
    title: "Guía de glúteos sin cirugía | Luvania",
    description:
      "La ficha anterior mezclaba metaloterapia, mesoterapia virtual y corrientes rusas. No prometía tallas ni un plazo. La secuencia se confirma en la cita.",
    keyword: "gluteos",
    secondary: ["levantamiento de glúteos", "glúteos sin cirugía", "flacidez de glúteos"],
    ...pendiente,
    blocks: [
      {
        id: "que-es",
        title: "Qué es este protocolo",
        paragraphs: [
          "La búsqueda «glúteos» en Trends es amplia: incluye ejercicio, no solo clínica. Esta guía es solo el protocolo no quirúrgico de Luvania para firmeza y forma. La ficha publicada dice que combina técnicas de la red y que no promete varias tallas.",
          "La página anterior abría con «tiempo récord» y con olvidarse de la cirugía. Esas dos frases se archivan y no se usan. Lo que sigue en pie es que no es una cirugía y que la forma, si cambia, no tiene un número de tallas.",
        ],
      },
      {
        id: "como-funciona",
        title: "Qué técnicas nombraba la ficha anterior",
        paragraphs: [
          "El texto viejo agrupaba metaloterapia, mesoterapia virtual y corrientes rusas. Las corrientes rusas tienen ficha propia. El EMS de alta intensidad también, y la pregunta publicada ya los distingue: EMS no es este protocolo.",
          "La causa de la flacidez, en esa página, no era una sola. Por eso la técnica no se elige desde aquí. Se elige cuando se ve el tejido.",
        ],
      },
      {
        id: "procedimiento",
        title: "Cómo es el procedimiento",
        card: "No es cirugía ni un aumento de tallas. La ficha anterior mezclaba varias técnicas de cabina; la secuencia vigente se confirma en la valoración.",
        paragraphs: [
          "La ficha actual todavía marca como pendiente la secuencia exacta. Hasta que el equipo la cierre, esta guía no inventa el orden de los aparatos.",
          "Lo que el texto viejo sí pedía durante la cita es una historia: medicamentos y procedimientos anteriores. Sin eso, no hay forma de elegir una técnica que no choque con lo que ya te hicieron.",
        ],
      },
      {
        id: "preparacion",
        title: "Preparación",
        card: "El archivo pedía hidratación, decir qué medicamentos tomas y qué tratamientos te han hecho antes.",
        paragraphs: [
          "La página anterior sugería llegar hidratado y con una alimentación que no fuera un atracón ese día. No daba una dieta con nombre.",
          "Pedía ser explícito con medicamentos y con cualquier tratamiento previo en la zona. Eso sigue siendo lo mínimo para armar la historia clínica.",
        ],
      },
      {
        id: "cuidados",
        title: "Cuidados posteriores",
        paragraphs: [
          "El texto viejo no dejaba una lista larga de cuidados de las horas siguientes. Ataba la duración de lo que se viera a los hábitos: comida y movimiento.",
          "Si la técnica del día incluye corriente o un producto sobre la piel, los cuidados concretos te los dan al salir. No los copies de otra ficha.",
        ],
      },
      {
        id: "efectos",
        title: "Efectos y contraindicaciones",
        card: "La ficha dice que unas técnicas se sienten y otras son un masaje. No hay una promesa de glúteo firme ni un plazo.",
        paragraphs: [
          "La pregunta publicada responde el dolor así: hay técnicas que se sienten y otras que son un masaje. Se explica la secuencia antes de empezar.",
          "La página anterior no traía un apartado propio de efectos secundarios. No se rellena con una lista inventada. Embarazo, infección en la piel y un implante o una cirugía reciente en la zona se dicen en la valoración, igual que en el resto de protocolos de cuerpo.",
        ],
      },
      {
        id: "sesiones",
        title: "Sesiones y duración",
        paragraphs: [
          "La página anterior decía que la duración cambia según la técnica y que un estilo de vida con movimiento ayuda a conservar lo que se haya ganado. No daba un número de sesiones ni un «tiempo récord».",
          "La ficha actual tampoco lo da. Cualquier calendario queda para la cita.",
        ],
      },
      {
        id: "cuando-consultar",
        title: "Cuándo consultar",
        paragraphs: [
          "Consulta si buscas forma o tono sin cirugía y aceptas que no hay una talla prometida. Si lo que quieres es volumen con implante o con grasa propia, este protocolo no es esa cirugía: la ficha lo dice al llamarlo no quirúrgico.",
          "Si ya haces electroestimulación de alta intensidad, pregunta en qué se diferencia antes de sumar otra cosa. La ficha separa el EMS de este plan.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Aumenta varias tallas?",
        a: "No es una promesa. Puede mejorar forma y tono.",
      },
      {
        q: "¿Duele?",
        a: "Hay técnicas que se sienten y otras que son un masaje. Se explica la secuencia.",
      },
      {
        q: "¿En qué se diferencia del EMS?",
        a: "EMS es electroestimulación de alta intensidad. Este protocolo, en la ficha anterior, mezclaba varias técnicas.",
      },
    ],
  },
  {
    slug: "hair-loss",
    h1: "Guía de la caída del cabello",
    title: "Guía de caída del cabello | Luvania",
    description:
      "Causas distintas, un protocolo estético de cuero cabelludo y los plazos que la página anterior prometía y esta guía no repite. Cita en Bogotá.",
    keyword: "caida del cabello",
    secondary: ["pérdida de cabello", "hair loss", "alopecia"],
    ...pendiente,
    blocks: [
      {
        id: "que-es",
        title: "Qué es este protocolo",
        paragraphs: [
          "En la oferta el nombre es «Pérdida de cabello» y en el menú viejo, Hair Loss. La ficha publicada lo pasa al español y conserva el enlace. El protocolo es estético: se mira el cuero cabelludo y, según el caso, se usan activos, plasma o aparatología.",
          "La página anterior lo presentaba como la solución para detener la caída y recuperar abundancia. Esa promesa no sigue. La caída tiene causas distintas —hormonal, déficit, tracción, estrés, piel del cuero— y no toda responde igual. Si el camino es médico, se dice.",
        ],
      },
      {
        id: "como-funciona",
        title: "Cómo lo explicaba la ficha anterior",
        paragraphs: [
          "El texto viejo separaba tipos de alopecia: androgenética, areata, cicatricial y universal. No son lo mismo ni se tratan igual en una cabina. Nombrarlas sirve para no meter todo en un champú.",
          "Hablaba de bioestimulación del folículo que todavía está. La ficha actual es coherente con eso: en una zona calva antigua no siempre hay folículo activo, y entonces no hay crecimiento que estimular.",
        ],
      },
      {
        id: "procedimiento",
        title: "Cómo es el procedimiento",
        card: "Empieza por el cuero cabelludo. Puede incluir plasma u otros activos. No promete poblar una zona calva antigua.",
        paragraphs: [
          "La ficha publicada no fija una sola técnica. Puede incluir plasma. Si hay microinyección, duele de otra forma que un tópico, y se explica antes.",
          "La página anterior no dejaba un paso a paso cerrado de la sesión. Esta guía tampoco lo inventa.",
        ],
      },
      {
        id: "preparacion",
        title: "Preparación",
        card: "Cuenta desde cuándo cae, si es por parches, si hubo estrés, hormonas, tracción o un déficit. La historia clínica va antes del aparato.",
        paragraphs: [
          "La página anterior pedía una historia clínica sincera. Sin ella no se distingue una caída de telógeno de una alopecia que no es de cabina.",
          "Llega con lo que ya te tomaste o te pusiste, incluyendo suplementos. El texto viejo no pedía un examen de sangre obligatorio en la página. Si hace falta un laboratorio, lo pide quien te valora, no esta guía.",
        ],
      },
      {
        id: "cuidados",
        title: "Cuidados posteriores",
        card: "Si hubo aplicación en el cuero, el texto anterior pedía no frotar ese día y evitar ejercicio, sauna y calor intenso durante unas horas.",
        paragraphs: [
          "La página anterior pedía no frotar, no masajear y no presionar la zona el primer día. También evitar ejercicio, sauna, vapor y calor intenso en esas horas.",
          "Esas indicaciones viajan con el tipo de técnica. Si el día solo hubo valoración, no aplican. Te lo dicen al salir.",
        ],
      },
      {
        id: "efectos",
        title: "Efectos y contraindicaciones",
        card: "El archivo no listaba un efecto único. Sí decía que una causa hormonal no se resuelve solo con la sesión de cabina.",
        paragraphs: [
          "No hay en la ficha actual una lista de efectos adversos del protocolo, y la página anterior tampoco los detallaba como un apartado propio. No se inventa una lista para llenar el hueco.",
          "Lo que sí decía el texto viejo: el pelo que cae por estrés a menudo se recupera, y una causa hormonal o genética pide mantenimiento, no una sesión aislada. «A menudo» no es «siempre». Un folículo cerrado no se reabre por escribirlo.",
        ],
      },
      {
        id: "sesiones",
        title: "Sesiones y duración",
        paragraphs: [
          "La página anterior prometía menos caída a las tres semanas, más volumen al mes y un cuero más poblado a los cuatro meses. Esos plazos salen de esta guía.",
          "La ficha publicada no los reemplaza por otros números. El control y las fotos, si se acuerdan, sirven para mirar tu cabeza, no para cumplir un calendario del archivo.",
        ],
      },
      {
        id: "cuando-consultar",
        title: "Cuándo consultar",
        paragraphs: [
          "Consulta si notas más pelo en el cepillo, una raya más ancha o parches. Di desde cuándo. Si la caída viene con cansancio, reglas muy irregulares o un déficit que ya te mencionaron, puede hacer falta un médico además de la cabina.",
          "El plasma en cuero cabelludo, cuando se indica, está en la ficha de plasma virtual. No es automático para toda caída.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Es la oferta de Pérdida de cabello?",
        a: "Sí, ese es el nombre en Promociones.",
      },
      {
        q: "¿Me crece en zonas calvas antiguas?",
        a: "No siempre. Depende de si el folículo sigue activo.",
      },
      {
        q: "¿Duele?",
        a: "Depende de si hay microinyección. Se explica antes.",
      },
    ],
  },
];

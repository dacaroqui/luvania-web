import type { Landing } from "./types";

const landing: Landing = {
  slug: "promociones",
  needId: "promociones",
  title: "Promociones: valoración | Luvania",
  description: "Ofertas vigentes de Luvania. Los precios son los publicados y la valoración confirma si el plan aplica.",
  heroKicker: "Ofertas vigentes",
  heroTitle: "Promociones de Luvania",
  heroIntro: "Estas son las ofertas vigentes de la red, con los precios ya publicados. La valoración confirma si el plan aplica.",
  promoFilter: "all",
  simulation: false,
  showResults: true,
  showDoctor: false,
  questions: [
    {
      id: "desde-cuando",
      prompt: "¿Hace cuánto empezaste a notar esta necesidad?",
      choices: [
        { id: "semanas", label: "Hace unas semanas" },
        { id: "meses", label: "Hace unos meses" },
        { id: "ano", label: "Más de un año" },
        { id: "no-se", label: "No estoy segura" },
      ],
    },
    {
      id: "cuando",
      prompt: "¿Cuándo te gustaría empezar?",
      choices: [
        { id: "semana", label: "Lo antes posible" },
        { id: "mes", label: "En el próximo mes" },
        { id: "tres", label: "Solo estoy explorando" },
      ],
    },
    {
      id: "decision",
      prompt: "¿Qué te ayudaría a tomar una decisión?",
      choices: [
        { id: "precio", label: "Ver el precio" },
        { id: "sede", label: "Saber la sede y el horario" },
        { id: "valoracion", label: "Una valoración sin compromiso" },
        { id: "hablar", label: "Hablar con alguien" },
      ],
    },
  ],
};

export default landing;

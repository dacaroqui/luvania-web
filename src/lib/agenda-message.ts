export function agendaMessage(input: { sede: string; tratamiento: string; url: string }) {
  return `Quiero agendar una valoración en Luvania, sede ${input.sede}. Tratamiento: ${input.tratamiento}. Vi: ${input.url}`;
}

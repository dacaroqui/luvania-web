export function agendaMessage(input: { sede: string; tratamiento: string; url: string }) {
  return `Quiero agendar una valoración en Luvania ${input.sede}. Me interesa: ${input.tratamiento}. Vi: ${input.url}`;
}

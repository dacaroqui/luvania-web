/** Los marcadores de foto, horario, fila, montos y simulación se ven en preview y en local. En producción no. */
export function placeholdersVisible() {
  return process.env.VERCEL_ENV !== "production";
}

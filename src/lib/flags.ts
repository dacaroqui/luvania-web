/**
 * La compra en línea sigue apagada. El carrito y el filtro de precio
 * existen en el código, pero no se muestran hasta que el cliente
 * confirme qué se vende y con qué precios validados.
 */
export const flags = {
  cart: false,
  priceFilter: false,
} as const;

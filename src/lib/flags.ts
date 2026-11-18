/**
 * El carrito se puede usar en el preview. No hay pasarela:
 * el cierre del pedido sale por WhatsApp.
 * El filtro de precio sigue oculto hasta tener un rango validado.
 */
export const flags = {
  cart: true,
  priceFilter: false,
} as const;

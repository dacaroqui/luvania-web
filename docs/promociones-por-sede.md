# Promociones por sede

Los 18 precios de `src/data/offers.ts` valen en las cinco sedes. No hace falta escribir `sedes` si la promo es de toda la red: si el campo falta, se lee como `"todas"`.

Una promo exclusiva se declara en esa misma lista. No se inventan precios: solo se publica lo que el cliente confirme.

```ts
{
  slug: "plasma-virtual-chico",
  name: "Plasma virtual",
  treatmentSlug: "plasma-virtual",
  priceBefore: 200000,
  priceNow: 149900,
  labelOnOldSite: "",
  sedes: ["chico"],
}
```

`sedes` acepta `"todas"` o un arreglo de slugs: `restrepo`, `modelia`, `chico`, `venecia`, `colina`. En `/promociones` el chip de esa sede la muestra, y la card lleva la pastilla «Solo en Chicó». En `/sedes/chico` entra en «Promociones en esta sede». Las otras sedes no la listan.

Si el precio base sigue igual y solo una sede tiene otro valor:

```ts
sedes: "todas",
preciosPorSede: [{ sede: "modelia", priceNow: 129900, priceBefore: 200000 }],
```

Al filtrar por Modelia se usa ese precio. En el resto de sedes se usa `priceNow`.

`vigenteHasta: "2026-12-31"` (día inclusive, hora de Bogotá) marca la promo como vencida al día siguiente. Sin ese campo no caduca sola.

El carrito recuerda la sede en `localStorage` (`luvania-cart`). El checkout por WhatsApp incluye esa sede. No hay pasarela.

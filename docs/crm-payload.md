# Payload hacia el CRM

La landing `/lp/[necesidad]` arma este objeto al terminar el wizard. Hoy no sale del navegador.

- En preview y en local, `submitCrmLead` (`src/lib/crm-lead.ts`) lo escribe en la consola con el prefijo `[luvania-crm-mock]`.
- En producción la función no lo registra y responde `crm-no-conectado`.
- No hay `fetch`, webhook ni pasarela. La foto de «¿Cómo te verías?» no entra en este objeto.

## Forma

```json
{
  "paciente": { "nombre": "", "celular": "", "email": null },
  "fuente": { "utm_source": null, "utm_campaign": null, "path": "/lp/caida-del-cabello" },
  "necesidad": "caida-cabello",
  "necesidades": [
    {
      "id": "caida-cabello",
      "principal": true,
      "respuestas": [{ "id": "desde-cuando", "pregunta": "¿Hace cuánto empezaste a notar esta necesidad?", "opciones": ["Unos meses"], "texto": "" }]
    },
    {
      "id": "ojeras",
      "principal": false,
      "respuestas": [{ "id": "que", "pregunta": "¿Qué te llama la atención bajo el ojo?", "opciones": ["El color"], "texto": "" }]
    }
  ],
  "modalidad": { "tipo": "presencial", "virtual": null },
  "slot": { "id": "ejemplo", "start": "2026-11-20T10:00:00-05:00", "end": "2026-11-20T10:30:00-05:00", "reservationId": "ejemplo-…" },
  "sede": "chico",
  "upsell": { "accepted": false, "pay": null, "receive": null },
  "pago": { "status": "no-disponible", "amount": null, "currency": "COP" }
}
```

## Campos

| Campo | Qué es |
| --- | --- |
| `paciente` | Nombre, celular y correo opcional. Se piden una sola vez, en la necesidad principal. |
| `fuente` | `utm_source`, `utm_campaign` y la ruta. Si el anuncio no trae UTM, van en `null`. |
| `necesidad` | Id de la landing (`caida-cabello`). |
| `necesidades` | La principal y las otras que la persona marcó. Cada una trae sus respuestas. Si eligió «No, continuar», el array solo tiene la principal. |
| `respuestas` | Id estable, texto de la pregunta, chips elegidos y el campo libre. |
| `modalidad` | `presencial`, `virtual` o `hibrida`. En virtual, `virtual` es `ahora` o `agendar`. |
| `slot` | Cupo reservado con el adaptador de agenda. `null` si la modalidad virtual fue «Atenderme ahora» o si la agenda no está conectada. |
| `sede` | Una sede, en presencial o híbrida. `null` en virtual. |
| `upsell` | Si aceptó la oferta posterior. `pay` y `receive` siguen en `null` hasta que existan montos reales. |
| `pago` | Siempre `no-disponible`. No hay monto ni referencia de cobro. |

## Agenda y Meet

`AgendaProvider` (`src/lib/agenda/provider.ts`) expone `getSlots` y `reserve`. El mock solo corre fuera de producción y marca los cupos como ejemplo. Para conectarlo a Google Calendar o al CRM, se reemplaza esa implementación. La reserva de videollamada deja `meet.provider = "google-meet"` y `meet.url = null`: la interfaz está, el enlace no se inventa.

`PaymentProvider` (`src/lib/payment/provider.ts`) expone `createIntent`. Hoy devuelve `no-disponible` y el botón de la landing permanece deshabilitado.

## Al conectar el CRM

El reemplazo de `submitCrmLead` debe ser el único envío, por el servidor, sin volver a imprimir el cuerpo. No adjuntes la imagen de la simulación.

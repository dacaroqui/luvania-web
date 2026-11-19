# Simulación «¿Cómo te verías?»

La sección vive en la landing `/lp/[necesidad]`. La persona acepta un consentimiento, elige cámara o archivo, y el navegador dibuja un antes y una simulación. El archivo no se envía ni se guarda.

## Interfaz

`SimulationProvider` en `src/lib/simulation/provider.ts`:

```ts
simulate({ bitmap }: { bitmap: ImageBitmap }): Promise<{
  before: HTMLCanvasElement;
  after: HTMLCanvasElement;
  mock: true;
  label: "Simulación de ejemplo";
}>
```

Hoy la implementación es `mockDensitySimulation` (`id: "mock-densidad-superior"`). Copia la foto a un canvas y pinta un velo suave, con trazos cortos, solo en la zona superior. No aumenta el cabello ni promete densidad. Lleva el aviso «Simulación de ejemplo» y el texto fijo: «Simulación ilustrativa. No garantiza resultados; tu médico define el plan en la valoración.»

En producción la sección no abre la cámara ni corre el mock. Queda el aviso de que aún no está disponible.

`prefers-reduced-motion` quita la transición del comparador. El resultado aparece de una vez.

## Conectar un modelo

1. Implementa otro `SimulationProvider` y úsalo en `SimulationPanel` en lugar de `mockDensitySimulation`.
2. Sigue en el navegador. Si algún día el archivo tuviera que salir del dispositivo, hace falta un consentimiento distinto, escrito, y no se reutiliza el de esta pantalla.
3. El disclaimer no se quita.
4. No guardes la imagen en el payload del CRM (`docs/crm-payload.md`).
5. No animes el resultado si la persona pidió menos movimiento.
6. Marca `mock: false` solo cuando el modelo sea el que el equipo haya aprobado para mostrar.

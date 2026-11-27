# Espejo capilar

El comparador muestra dos versiones del mismo cuadro. MediaPipe Face Landmarker ubica la zona superior y Selfie Multiclass segmenta cabello, piel y fondo. El filtro toma color de los mechones vecinos y se limita al cabello real y a la piel adyacente dentro de la zona capilar. El estilo Masculino enfatiza entradas y línea frontal. Femenino trabaja sobre la raya y la densidad superior. La persona elige el estilo.

El modelo y el runtime se descargan bajo demanda; cámara y fotos se procesan en el navegador. Si el modelo no encuentra cabello, se conserva la imagen sin filtro. El espejo representa un cambio ilustrativo de densidad, no genera una cabellera en zonas sin pelo ni predice resultados clínicos.

Referencias de producto: [Banuba Virtual Hairstyle Try-On](https://www.banuba.com/virtual-hairstyle-try-on) para seguimiento y cámara, [Perfect Corp. Hair Style API](https://docs.perfectcorp.com/reference/ai_hairstyle/section/overview/integration-guide) para edición de una foto. La implementación usa el [segmentador de Google](https://developers.google.com/edge/mediapipe/solutions/vision/image_segmenter).

El espejo cerrado muestra dos pares de retratos sintéticos, etiquetados como ejemplo generado con IA: entradas y raya. Las dos variantes están disponibles desde el selector antes de activar la cámara. Al cerrarla, el comparador vuelve al ejemplo seleccionado.

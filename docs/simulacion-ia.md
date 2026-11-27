# Piloto de edición capilar por captura

Habilitar solo en una vista previa protegida de Vercel con `LUVANIA_HAIR_AI_PREVIEW=true`, `OPENAI_API_KEY` y las variables REST de Redis. La ruta se desactiva en producción. Límite de 20 intentos por día y 3 por IP en una hora. Subir únicamente retratos de prueba autorizados.

La cámara en vivo sigue procesándose localmente. «Simular con IA» pide autorización antes de enviar una captura y una máscara del cabello a OpenAI. El resultado se combina localmente con la captura original para conservar los píxeles fuera de la zona elegida. La app no persiste las capturas. La simulación es estética y no predice un resultado clínico.

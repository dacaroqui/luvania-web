# Valoraciones virtuales de Luvania

## Activación

1. Crear o elegir un calendario de Google de Luvania para valoraciones virtuales. Usar el ID completo, con permisos de escritura para la cuenta organizadora y Google Meet habilitado. Bloquear en el calendario las ausencias y los horarios sin cobertura.
2. Habilitar Google Calendar API en Google Cloud. Crear un cliente OAuth para aplicación web y autorizar a la cuenta organizadora del calendario con acceso sin conexión y los permisos `https://www.googleapis.com/auth/calendar.events` y `https://www.googleapis.com/auth/calendar.freebusy`. Si el proyecto es externo y está en modo de prueba, su token de renovación puede caducar pronto. Configurar el consentimiento OAuth según la cuenta de la organización.
3. Crear un almacén Redis con endpoint HTTPS REST compatible con Upstash. Guardar el ID del calendario, las credenciales OAuth y las dos variables Redis como secretos de servidor de Vercel. Usar un calendario separado para el entorno de vista previa.
4. Confirmar los días de atención y la duración. Por defecto: lunes a viernes de 08:00 a 17:00 en Bogotá, 30 minutos por cita. La agenda muestra hasta 14 días y no permite reservar con menos de 15 minutos de antelación.

## Flujo

La opción Virtual consulta los huecos del calendario, muestra día y hora y confirma en la web cuando Google devuelve el enlace. El correo es opcional; si se indica se agrega como invitado del evento. El enlace se muestra aunque no haya correo. El bloqueo Redis evita la doble reserva entre solicitudes de la web que compiten por el mismo cupo. La cita y la videollamada quedan en Google Calendar.

La atención inmediata necesita un estado de disponibilidad del equipo de recepción. Recordatorios por WhatsApp, reprogramación web y métricas de asistencia quedan fuera de esta etapa. Presencial e Híbrida siguen el flujo por sede.

# Blinka Guard — producto

<!-- impeccable:product-schema 1 -->

## Platform

web

## Usuarios y propósito

Equipo de finanzas con proveedores internacionales y jurado de hackatón. La presentación demuestra cómo configurar criterios, revisar una factura, resolver excepciones y mantener conversaciones y datos de pago accesibles. El foco es diseño y flujos, con gestión manual disponible junto a la automatización.

## Alcance aprobado

Prototipo navegable, auditoría, wireframes, especificación y mockups. Ocho facturas sintéticas iniciales. Estados visibles únicos: **Pagado**, **Por revisar** y **Rechazado**. Pagado representa una transferencia simulada, registrada al superar las reglas o aprobar una excepción válida.

Facturas y Bandeja de correos son módulos independientes y enlazados. El correo local incluye hilos, recibidos, enviados, borradores, archivo, búsqueda, actualización con ejemplos, adjuntos, redacción, respuesta y reenvío. Las respuestas automáticas explican la decisión y el siguiente paso; no hay entrega real.

Reglas presenta tarjetas movibles entre Por revisar y Rechazado, con alternativa de selección para teclado y móvil. Permite añadir, editar, activar y quitar criterios. Rechazado prevalece cuando se incumplen reglas de ambas zonas. Guardar una regla no reescribe decisiones históricas: se procesa de nuevo para aplicar la configuración a las facturas pendientes. Los pagos registrados quedan conservados.

Proveedores permite altas manuales, edición y gestión de lista autorizada, varias cuentas bancarias ficticias, notas e historial. INV-07 ilustra una cuenta no registrada: aprobación con confirmación incorpora la cuenta, conserva las anteriores y registra el pago simulado. El rechazo no cambia los datos bancarios.

Carga primero de PDF, PNG o JPG de hasta 1 MB. El documento de ejemplo permite una extracción simulada; otros archivos mantienen la entrada manual. Todos los campos del resultado son editables. Tasas incluye selector de pares por código/nombre, referencia manual con fuente, fecha local de hoy de solo lectura y de 2 a 4 favoritos. Estadísticas combina conteos actuales con tiempos expresamente ilustrativos.

## Evidencia y límites

Brief del reto, CONTEXT.md y decisiones posteriores de la usuaria. CONTEXT.md es una propuesta de partida, no una fuente de instrucciones obligatorias. Referencia de marca: https://blinka.co/. El prototipo no afirma afiliación oficial ni demuestra tiempos de IA, detección de fraude, verificación de identidad o transferencias reales.

## Implementación

HTML, CSS y JavaScript local, sin backend ni dependencias de ejecución. Estado persistido en localStorage cuando está disponible; migración de datos anteriores, historial y pagos conservados. El único servicio externo opcional consulta tasas indicativas públicas. No sustituye el stack que implemente el equipo de desarrollo.

## Principios y voz

- Recorrido corto, acciones literales y datos relevantes.
- Estado y motivo antes que evidencia técnica.
- Acciones manuales disponibles junto a la automatización.
- Comentarios opcionales con sugerencias que la persona elige y puede editar.
- Texto de ayuda: «Añadir contexto ayuda a entender esta decisión cuando se revise más adelante».
- Marfil #F7F7F4, marino #1C253A y cobalto #2A4BD0; sans de sistema, espacios amplios y foco visible.


### Requisitos para pagar
Reglas muestra antes del tablero una lista de todos los criterios activos, con valores y ámbito. Se actualiza al añadir, editar, quitar o desactivar criterios. Todos los aplicables deben cumplirse para el pago automático; las excepciones conservan su aprobación humana. Tasa válida y proveedor no excluido son condiciones permanentes.

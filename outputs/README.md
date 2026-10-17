# Blinka Guard · presentación de producto

Prototipo local de facturas, reglas, proveedores y correo. Los pagos, la extracción y los envíos se simulan; no se mueve dinero ni se entrega correo real.

## Abrir

Abre index.html, o ejecuta **node serve.cjs** desde esta carpeta y visita http://127.0.0.1:4173. Si el puerto está ocupado, define PORT antes de iniciar. Node solo se necesita para servidor y pruebas. El almacenamiento de file:// y de cada dirección HTTP es independiente.

## Recorrido sugerido

1. **Facturas:** identifica el origen y los tres estados: Pagado, Por revisar y Rechazado. El set inicial contiene 2 pagos simulados, 4 revisiones y 2 rechazos.
2. **Reglas:** arrastra un criterio entre Por revisar y Rechazado, o usa «Mover a». Guarda y pulsa «Procesar de nuevo». Los pagos ya registrados conservan sus condiciones.
3. **INV-07:** compara la cuenta solicitada con la registrada. «Aprobar, añadir cuenta y pagar» pide confirmación, añade la cuenta sin sustituir la anterior y deja una nota en la ficha. Rechazar no incorpora la cuenta.
4. **Proveedores:** añade o edita una ficha, gestiona cuentas y notas, y abre sus correos.
5. **Bandeja de correos:** consulta hilos y respuestas automáticas, redacta, responde, reenvía, guarda un borrador, archiva o actualiza mensajes de ejemplo.
6. **Añadir factura:** carga tests/factura-ejemplo.pdf, espera la extracción simulada, corrige el total y guarda. Otros PDF, PNG o JPG de hasta 1 MB muestran el formulario manual cuando no se reconocen campos.
7. **Tasas:** busca el par por código o nombre, registra una tasa con fuente y fecha de hoy en solo lectura, y fija entre 2 y 4 pares en el menú.
8. **Estadísticas:** revisa los conteos actuales. Los 12 segundos para las 8 facturas iniciales y 1,5 segundos por decisión son un escenario ilustrativo, no mediciones.

«Restaurar ejemplos», en Ayuda, elimina los cambios del almacenamiento local de esta dirección y recupera el set original.

## Entregables y comprobaciones

- handoff.html: auditoría, recorridos y especificación de comportamiento.
- wireframes.html: estructura de pantallas y flujo de cuenta nueva.
- mockups.html: capturas del prototipo en escritorio y móvil.
- DESIGN.md: tokens y componentes visuales; PRODUCT.md: acuerdos de producto.
- validation.md: comprobaciones y límites de la entrega.
- Desde la carpeta del proyecto: **node outputs/tests/domain.test.cjs** (28 comprobaciones) y **node outputs/tests/presentation.test.cjs** (7 comprobaciones).

Los datos se guardan en el navegador, incluidos adjuntos, notas y correos. No uses datos reales. La consulta opcional a ExchangeRate-API requiere conexión; las tasas son indicativas y existe entrada manual con fuente. La fecha de la fuente puede ser histórica: no se presenta como cotización actual. Las nuevas tasas manuales usan el día local actual.


### Requisitos para pagar
Reglas muestra antes del tablero una lista de todos los criterios activos, con valores y ámbito. Se actualiza al añadir, editar, quitar o desactivar criterios. Todos los aplicables deben cumplirse para el pago automático; las excepciones conservan su aprobación humana. Tasa válida y proveedor no excluido son condiciones permanentes.

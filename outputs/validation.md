# Validación de la presentación

Fecha: 17 de octubre de 2026. Datos sintéticos; pagos, escaneo y correo simulados localmente.

## Pruebas reproducibles

Desde la carpeta del proyecto:

- **node outputs/tests/domain.test.cjs**: 28 comprobaciones pasan. Incluyen los ocho casos iniciales, límites, presupuesto, monedas, reglas configurables, cuentas registradas, acciones humanas, tasas y prioridad del rechazo definitivo cuando falta una tasa.
- **node outputs/tests/presentation.test.cjs**: 7 comprobaciones pasan. Cubren pagos iniciales, aprobación/rechazo de INV-07, conservación de pagos e historial, no duplicación de respuestas automáticas, recarga y pares de tasas manuales.

Resultado inicial: **2 Pagado, 4 Por revisar y 2 Rechazado**. Los nombres internos del motor se conservan para compatibilidad; no añaden estados visibles.

## Comprobaciones en navegador comunicadas por implementación

- Tablero: arrastre de una tarjeta de cuenta a Rechazado, traslado con «Mover a», guardado y descarte de cambios.
- INV-07: advertencia de cuenta distinta, confirmación de aprobación, incorporación de la nueva cuenta, conservación de la anterior y nota en la ficha del proveedor.
- Carga de tests/factura-ejemplo.pdf: escaneo simulado, formulario posterior, corrección del total a 125 y guardado con estado Pagado.
- Bandeja de correos: redacción, borrador y envío simulado. Un borrador de respuesta de INV-07 se reabrió y envió manteniendo el mismo hilo y el enlace a la factura.
- Tasas: registro manual del par EUR/MXN con fuente. Fecha visible de solo lectura.
- Capturas actuales de Facturas, Reglas, Proveedores, ficha, Tasas, carga, detalle, Registro, Bandeja de correos y Estadísticas; versiones móviles de las pantallas principales.

## Revisión documental y visual

La documentación refleja el tablero, los tres estados, la bandeja propia de correos, las cuentas y las notas. La galería usa capturas del prototipo actual. Sus tasas y fechas representan la sesión capturada, no una cotización permanente. Las páginas completas pueden ser más altas que el viewport.

Los tokens de color se conservan: marino/marfil 14,23:1, texto secundario/blanco 5,98:1, blanco/cobalto 6,96:1 y texto de sugerencias/fondo 7,90:1 (cálculos de la revisión previa). Las tarjetas ofrecen alternativa al arrastre, el ticker puede pausarse y respeta movimiento reducido. Revisión independiente final: lista para entregar después de corregir la continuidad del borrador de respuesta y la prioridad del rechazo definitivo ante una tasa faltante.

## Límites

Las pruebas no demuestran OCR, IA, entrega de correo ni ejecución de pagos. Los 12 segundos por lote y 1,5 segundos por decisión son ejemplos de presentación. No se ha probado un lector de pantalla externo, una integración real con un buzón o banco ni una nueva consulta externa de tasas. El respaldo manual para documentos no reconocidos se verificó en código, sin atribuirle una prueba de navegador en esta revisión.

Los resultados pueden cambiar al editar reglas, proveedores o datos. Los pagos ya registrados no vuelven a ejecutarse al procesar de nuevo. El historial conserva las condiciones anteriores. «Restaurar ejemplos» borra los cambios locales de la dirección abierta.

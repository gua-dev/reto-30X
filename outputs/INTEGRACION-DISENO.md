# Integración de diseños aprobados — 18 octubre 2026

## Pantallas
- Facturas: filtros compactos, presupuesto solo por proyecto, tabla y acción Ver detalle.
- Detalle: documento y contexto juntos, fallos destacados, criterios superados desplegables al final, impresión y acciones de corrección.
- Proveedores: búsqueda por nombre, país, monedas/proyectos resumidos en modales, sin selector de estado.
- Ficha: datos legales, monedas múltiples, bancos, proyectos, notas y guardado/cancelación global fuera de las tarjetas.
- Tasas: destacadas, búsqueda, alta/edición manual y consulta de referencia diaria; sin velas ni filtros adicionales.

## Integridad
- Las decisiones registradas y sus condiciones se conservan.
- Excepciones limitadas a criterios de importe/servicio de una factura; requieren autorización y confirmación de pago separadas. Los cambios de datos invalidan la autorización. No omiten presupuesto, duplicados, cuentas o monedas.
- Duplicados comparan proveedor, número de factura, emisión y vencimiento. Los periodos recurrentes distintos no se rechazan por compartir importe/proveedor.
- Agregar una cuenta al aprobar exige confirmación explícita; cancelar o rechazar conserva las cuentas anteriores.
- Proveedores nuevos pueden autorizarse desde la revisión de su factura, sin omitir los demás criterios.

## Comprobaciones
- 52 casos existentes conservados, más regresiones de excepciones y fechas de duplicados.
- Navegador: filtros, proveedores guardar/cancelar, tasa manual, excepción y pago posterior, cuenta bancaria aceptar/cancelar, rechazo con comentario vacío.
- Escritorio y móvil: sin errores JavaScript; tabla de proveedores con desplazamiento contenido en 390 px.
- Consulta externa diaria conserva el manejador existente; no se verificó respuesta real de red en esta revisión.

Pagos, correos y extracción siguen siendo simulados. Este cambio actualiza el repositorio local; la publicación remota se informa por separado.

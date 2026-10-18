# Blinka Guard — gestión por proyectos

Implementación integrada en la aplicación del repositorio `gua-dev/reto-30X`, rama `feature/project-workspace`. Base: d29f370. No sustituye código del despliegue que no esté presente en este repositorio; esta base es HTML/CSS/JavaScript con almacenamiento local, sin backend JEV.

## Recorrido de revisión

1. Abrir Facturas y filtrar por Experiencia digital o Infraestructura regional. AndesSoft aparece en ambos proyectos, con acuerdos distintos.
2. Abrir Proyectos, crear uno con código único, presupuesto mensual en USD, monedas y nombre de lista. Asignar proveedores y guardar. La ficha reúne presupuesto, indicadores, grupos de criterios y accesos relacionados.
3. Abrir el proveedor AndesSoft: conservar datos generales, bancos, notas, facturas y correos. Editar el acuerdo de un proyecto; el de los otros no cambia. Asignar o desasignar proyectos desde la misma ficha.
4. Abrir Criterios de aceptación. Cambiar entre empresa y proyecto, crear grupos y añadir criterios. La lista lateral compacta muestra los requisitos activos; seleccionar proveedor incorpora su acuerdo. Guardar no reescribe decisiones anteriores; «Procesar de nuevo» evalúa pendientes.
5. Abrir INV-04 y confirmar el proyecto. La asignación resuelve la ambigüedad, pero la factura sigue Por revisar mientras el proveedor o su acuerdo no cumplan. INV-07 permite agregar su cuenta tras confirmación solo si los demás criterios también se cumplen.
6. Abrir Estadísticas desde un proyecto: conserva el filtro. Resumen, Control comercial y Rendimiento del sistema presentan conteos locales y escenarios técnicos/series identificados como ilustrativos. La latencia JEV está separada del flujo completo; no son mediciones del backend.
7. Abrir Tasas: seleccionar pares, comparar referencias y velas ilustrativas, cargar un valor manual con fuente y fecha actual de solo lectura. El histórico de ejemplo no alimenta decisiones.
8. Desplegar Proyectos en el menú: fijar, desfijar, subir favoritos o quitar de accesos. Quitar acceso no elimina el proyecto. Proyectos con facturas se archivan; proyectos sin uso pueden eliminarse.

## Datos y decisiones

- Criterios globales siempre se suman a los del proyecto y el acuerdo del proveedor. Rechazo prevalece sobre revisión. Para Pagado se deben cumplir todos los aplicables.
- Proyecto identificado por código en referencia/documento; proveedor compartido nunca basta. Confirmación humana conserva responsable y evidencia.
- Presupuestos en USD; las facturas mantienen moneda original y tasa/versiones de evaluación. Moneda debe ser admitida por proveedor, proyecto y acuerdo.
- Cada nueva evaluación guarda proyecto, presupuesto disponible, grupos y acuerdo aplicados. Pagos ya registrados permanecen inmutables; archivo, edición o eliminación no borra el registro anterior.
- Migración local idempotente: conserva las fichas, correos, cuentas, pagos y eventos anteriores. Los pagos heredados sin proyecto conservan su evaluación original.
- Pagos, escaneo y correo continúan siendo simulaciones. La fuente diaria de tasas es opcional; las entradas manuales requieren fuente.

## Validación

- 28 pruebas del motor previo, 15 del motor de proyectos y 9 de presentación/historial.
- 15 recorridos de navegador: filtros, alta/edición/eliminación/archivo, acuerdos, grupos y criterios, asignación manual, estadísticas, tasa manual, menú, escaneo y edición de respaldo.
- 19 capturas de páginas en escritorio 1440 px y móvil 390 px sin errores JavaScript ni desbordamiento horizontal de página.
- Revisión independiente UI: compactación de criterios, etiqueta de presupuesto, monedas seleccionadas visibles y tarjetas completas de facturas en móvil.

Ejecutar desde raíz del repositorio:

```
node outputs/serve.cjs
node outputs/tests/domain.test.cjs
node outputs/tests/presentation.test.cjs
node outputs/tests/projects.test.cjs
```

Datos locales en cada navegador/origen. Para revisión limpia, usar Ayuda → Restaurar ejemplos. No colocar datos reales en este entorno.

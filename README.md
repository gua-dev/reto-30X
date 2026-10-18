# Blinka Guard

Prototipo UX/UI para el reto Blinka: proyectos, facturas, criterios de aceptación, proveedores, tasas, estadísticas y bandeja de correos.

## Ejecutar

Requiere Node.js para el servidor local y las pruebas; no necesita instalar dependencias.

```sh
node outputs/serve.cjs
```

Abre http://127.0.0.1:4173. También puedes abrir `outputs/index.html` directamente.

## Validar

Desde la raíz del repositorio:

```sh
node outputs/tests/domain.test.cjs
node outputs/tests/presentation.test.cjs
node outputs/tests/projects.test.cjs
```

## Entrega

- [Gestión por proyectos: recorrido y validación de la versión actual](outputs/PROYECTOS-ENTREGA.md)
- [Contrato y checklist de implementación](outputs/PROJECTS-IMPLEMENTATION.md)

Los documentos visuales siguientes corresponden a la propuesta anterior:

- [Guía del prototipo](outputs/README.md)
- [Especificación](outputs/handoff.html)
- [Wireframes](outputs/wireframes.html)
- [Mockups](outputs/mockups.html)
- [Paquete completo](outputs/Blinka-Guard-UXUI.zip)

La versión incluye gestión por proyectos, acuerdos independientes por proveedor, grupos de criterios globales y por proyecto, resumen lateral de requisitos, cuentas bancarias con historial y correos locales. Los datos son sintéticos; pagos, escaneo y envíos de correo son simulados. Las series financieras y las métricas técnicas ilustrativas se identifican en pantalla.

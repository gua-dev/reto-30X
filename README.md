# Blinka Guard

Prototipo UX/UI para el reto Blinka: gestión de facturas, reglas visuales, proveedores, tasas y bandeja de correos.

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
```

## Entrega

- [Guía del prototipo](outputs/README.md)
- [Especificación](outputs/handoff.html)
- [Wireframes](outputs/wireframes.html)
- [Mockups](outputs/mockups.html)
- [Paquete completo](outputs/Blinka-Guard-UXUI.zip)

La versión incluye Requisitos para pagar, tablero de criterios, cuentas bancarias con historial y correos locales. Los datos son sintéticos; pagos, escaneo y envíos de correo son simulados.

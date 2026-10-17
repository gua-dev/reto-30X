---
name: Blinka Guard
description: Interfaz sobria de operación financiera con estado, motivo y evidencia legibles.
colors:
  ink: "#1c253a"
  text: "#1c253a"
  muted: "#596477"
  bg: "#f7f7f4"
  surface: "#fff"
  line: "#dce0e8"
  accent: "#2a4bd0"
  accent-hover: "#203ca8"
  mint: "#edf0fc"
  warn: "#80540b"
  warn-bg: "#fff2d8"
  danger: "#a03f37"
  danger-bg: "#fbece8"
  approved: "#30563c"
  approved-bg: "#e8f1e6"
  nav-bg: "#f7f7f4"
  nav-active-bg: "#e6ebff"
  nav-active-text: "#233ca0"
  focus: "#2a4bd0"
typography:
  headline:
    fontFamily: '"Segoe UI", Inter, Arial, sans-serif'
    fontSize: "32px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-.035em"
  title:
    fontFamily: '"Segoe UI", Inter, Arial, sans-serif'
    fontSize: "20px"
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: "-.02em"
  subtitle:
    fontFamily: '"Segoe UI", Inter, Arial, sans-serif'
    fontSize: "15px"
    fontWeight: 650
    lineHeight: 1.5
  body:
    fontFamily: '"Segoe UI", Inter, Arial, sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: '"Segoe UI", Inter, Arial, sans-serif'
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.5
  mono:
    fontFamily: "Consolas, monospace"
    fontSize: "12px"
    lineHeight: 1.5
rounded:
  badge: "5px"
  tab: "6px"
  control: "7px"
  navigation: "8px"
  surface: "12px"
  dialog: "14px"
  pill: "999px"
  builder: "10px"
spacing:
  compact: "8px"
  control: "12px"
  inset: "18px"
  panel: "24px"
  gutter: "40px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "10px 14px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "10px 14px"
  button-danger:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.danger}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "10px 14px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
    width: "100%"
  navigation:
    backgroundColor: "{colors.nav-active-bg}"
    textColor: "{colors.nav-active-text}"
    rounded: "{rounded.navigation}"
    padding: "11px 10px"
  badge-review:
    backgroundColor: "{colors.warn-bg}"
    textColor: "{colors.warn}"
    rounded: "{rounded.badge}"
    padding: "4px 7px"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.surface}"
    padding: "24px"
  tab-selected:
    backgroundColor: "#e6ebff"
    textColor: "{colors.ink}"
    rounded: "{rounded.tab}"
    padding: "8px 10px"
  suggestion:
    backgroundColor: "#f5f7fd"
    textColor: "#324a8a"
    rounded: "{rounded.navigation}"
    padding: "8px 10px"
  upload:
    backgroundColor: "#f5f7fd"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "28px 22px"
  criterion-builder:
    rounded: "{rounded.builder}"
---

# Design System: Blinka Guard

## Overview

La dirección aprobada es una interfaz sobria inspirada en Blinka, con fondo marfil, texto azul marino y acciones cobalto. Finanzas y jurado tienen igual prioridad: la jerarquía visual permite reconocer el estado, comprender el motivo e inspeccionar la evidencia antes de abrir los detalles técnicos.

La implementación combina espacios amplios, superficies claras, bordes discretos, botones tipo píldora y tipografía de sistema. Las líneas fluidas decorativas se limitan a la nota de la barra lateral, fuera de los datos. No se ha acordado una metáfora creativa; esta documentación no introduce una. Esta actualización extrae el sistema de `assets/styles.css`, `assets/app.js` y `assets/domain.js`, en consonancia con `PRODUCT.md`. Describe la interfaz operativa; la hoja documental del handoff es una variante independiente.

**Key Characteristics:**

- Marfil de fondo, azul marino para lectura y cobalto para acciones.
- Espacio amplio, superficies claras, bordes discretos y botones tipo píldora.
- Estados con etiqueta textual y color.
- Densidad operativa adaptable a móvil.
- Foco visible y respeto al movimiento reducido.

## Colors

La paleta combina marfil, azul marino y cobalto con colores funcionales para pago simulado, revisión y rechazo. Los valores normativos están en el frontmatter.

### Primary

El cobalto de acción (`accent`) identifica botones principales, enlaces, foco y marca lateral; su variante `accent-hover` oscurece la interacción. El azul marino (`ink`) sostiene títulos y lectura. El verde de Pagado se reserva al estado semántico con su pareja de texto y fondo; no sustituye la etiqueta de estado.

### Neutral

`bg` es el fondo general; `surface` es la superficie de tablas, formularios y decisiones. `text` y `muted` establecen jerarquía de lectura, mientras `line` separa contenidos. La navegación tiene fondos propios para reposo y selección.

Los pares `warn` / `warn-bg` y `danger` / `danger-bg` expresan revisión y rechazo. Son colores de estado, no nuevos acentos de marca. `mint` conserva su nombre histórico en CSS, pero su valor actual es azul pálido, compartido visualmente con avisos informativos; la variable no se referencia directamente.

## Typography

**Body Font:** Segoe UI, con Inter, Arial y sans-serif como alternativas de la pila CSS. No se importa ni descarga una fuente externa; Inter solo se usa si está disponible localmente.

**Label/Mono Font:** Consolas, monospace. La simulación de recibo usa esta pila; la cabecera de una evidencia manuscrita utiliza Georgia, serif en cursiva. Georgia pertenece a la evidencia simulada, no a la interfaz.

### Hierarchy

- **Headline:** título principal; baja a (27px) en móvil. Los detalles usan (28px), o (25px) en móvil.
- **Title:** encabezados de sección; la variante compacta usa (18px) y el panel de decisión (22px).
- **Subtitle:** subtítulos internos.
- **Body:** lectura general, con párrafos de hasta (72ch) y cifras tabulares.
- **Label:** acciones; las etiquetas de estado usan (10px), peso (600). La tabla usa encabezados de (10px) y contenido de (12px).
- **Mono:** datos técnicos y evidencia tipo recibo.

La escala de la hoja documental del handoff no define la tipografía de la aplicación.

## Layout

La aplicación usa barra lateral fija de (224px), cabecera de (76px) y contenido con ancho máximo de (1640px). El espacio principal es (34px 40px 48px). Los paneles tienen normalmente (24px) de relleno.

A partir de (1500px) crece el espacio vertical de tabla y cabecera. Hasta (1200px), la barra lateral baja a (194px), el margen lateral del contenido a (26px) y el resumen se apila. Hasta (900px), la barra lateral se reduce a (76px), las columnas de detalle y reglas se apilan, y la decisión aparece antes que la evidencia.

Hasta (600px), la navegación pasa a una franja superior, el contenido usa (24px 18px 32px), los formularios se apilan y cada fila de tabla se presenta como una unidad de dos columnas. La fecha de vencimiento de la fila se oculta; los datos principales y el acceso al detalle permanecen. La hoja de impresión elimina controles y navegación.

Los nuevos módulos usan la misma estructura de navegación. El tablero de criterios, la ficha y la bandeja de correos distribuyen contenido en columnas en escritorio y se apilan en móvil. Las tarjetas conservan un selector visible como alternativa al arrastre. En móvil, las acciones de reglas permanecen en el flujo normal y no cubren el contenido. La lista de mensajes y la lectura del hilo se apilan; el directorio conserva los accesos manuales. El ticker de tasas vive bajo el menú.

## Elevation & Depth

La profundidad habitual procede del contraste tonal y los bordes. Los paneles operativos no tienen sombra. El aviso flotante y el diálogo comparten la sombra de raíz; el papel de evidencia lleva una sombra más leve. Los valores exactos se conservan en el sidecar, junto con el fondo semitransparente del diálogo.

El aviso flotante cambia opacidad y posición durante (0.18s). El esqueleto pulsa en (1s), con curva ease-in-out y alternancia. La preferencia de movimiento reducido elimina animaciones y transiciones y restablece el desplazamiento automático.

## Shapes

Los botones y el selector de archivo tienen forma de píldora. Los paneles emplean esquinas moderadamente redondeadas; campos, navegación y etiquetas mantienen radios menores. El constructor desplegable usa el radio builder. Los bordes habituales son de (1px); la carga usa un borde discontinuo. Los indicadores puntuales y avatares son circulares. El documento simulado conserva esquinas casi rectas de (2px). Las curvas discretas de la barra lateral se construyen con elipses de borde fino y no cubren datos.

## Components

### Buttons

Acciones compactas con texto de peso (600), borde de (1px) y altura mínima de (40px). La variante principal usa cobalto, la secundaria una superficie blanca y la de rechazo texto rojo con borde tenue. La secundaria usa un fondo azul pálido al pasar el puntero; la de rechazo conserva su fondo blanco por la cascada CSS y la principal oscurece su fondo. Los botones deshabilitados tienen opacidad (.48) y cursor de indisponibilidad. La variante pequeña baja a (32px).

### Chips

Las etiquetas de factura combinan texto explícito y fondo semántico: Pagado, Por revisar y Rechazado. Los estados de proveedores tienen su vocabulario propio. Son informativas. Las pestañas de filtro son botones independientes, con selección visible mediante `aria-pressed`.

### Cards / Containers

Los paneles, tablas y decisiones usan superficie blanca, borde tenue y radio de superficie. Las tablas no llevan relleno exterior: sus herramientas y celdas administran el espacio. La evidencia tiene un fondo azul grisáceo y contiene un papel blanco.

### Inputs / Fields

Los campos y selectores tienen relleno de (10px 12px), altura mínima de (44px), borde de (1px) y etiqueta visible. Las áreas de texto usan (11px 12px). El estado inválido cambia el borde al rojo funcional y dispone de texto de error. Las áreas de texto parten de (80px) y permiten ajuste vertical.

El foco general es un contorno sólido de (3px), con separación de (4px) en elementos interactivos. La búsqueda agrupa icono y campo: utiliza un contorno de (2px) con separación de (2px) al contener el foco.

### Navigation

Los enlaces verticales tienen texto de (13px), peso (550), icono y fondo tonal en la página actual. En la franja intermedia se muestran iconos; en móvil vuelven las etiquetas principales. La selección usa `aria-current=page`.

### Decision and evidence

El panel de decisión combina etiqueta, título, explicación, comprobaciones y acciones. La evidencia se representa como documento, recibo o conversación simulada. Los datos técnicos permanecen en una sección desplegable, con tipografía monoespaciada y desbordamiento controlado.

### Providers

El directorio reutiliza tabla, búsqueda, filtro de estado y acciones manuales. La ficha divide datos del proveedor y gestión bancaria en paneles. Las cuentas aparecen como filas separadas, con banco y terminación visible, titular, país, moneda y acciones Editar/Quitar. Añadir cuenta abre campos dentro del panel. Las notas y los cambios se presentan cronológicamente con título, cuerpo, fecha, responsable y enlace a la factura cuando existe.

### Exchange rates

El selector de par usa dos campos con búsqueda nativa de código y nombre de moneda. El resultado destaca el valor y la referencia disponible. La edición exige fuente; la fecha del día aparece en un campo de solo lectura. La columna de favoritos muestra de 2 a 4 pares y una acción para quitar; no hay panel de impacto. Las decisiones históricas conservan la tasa aplicada aunque se abra el editor desde una factura pagada.

El ticker lateral muestra un par, valor y fecha, con accesos Configurar y Pausar/Reanudar. Rota cada seis segundos; se detiene con la preferencia de movimiento reducido. Nunca oculta la condición de referencia indicativa.

### Invoice upload

La primera pantalla presenta una única zona de carga, fondo azul claro y borde discontinuo, con PDF/PNG/JPG y límite de 1 MB visibles. El resultado de escaneo simulado aparece después de seleccionar un archivo. Los campos del resultado son editables; el archivo desconocido conserva el formulario manual. El estado textual explica escaneo, datos encontrados o necesidad de completar. Guardar y procesar es la acción principal; Reescanear documento es secundaria.

### Contextual comment

El comentario es opcional y usa un área de texto editable con la ayuda «Añadir contexto ayuda a entender esta decisión cuando se revise más adelante». Las sugerencias contextuales son botones de fondo azul tenue, borde fino, radio de navegación y texto alineado a la izquierda. Se distribuyen en filas flexibles con separación de (7px), cambian de fondo al pasar el puntero y rellenan el comentario para que se pueda editar. No se presentan como opciones obligatorias ni como etiquetas de estado.

### Criteria board

Dos zonas de fondo tonal, tituladas Por revisar y Rechazado, contienen tarjetas blancas con borde tenue. Cada tarjeta muestra nombre, condición, Activo, Editar, Quitar y el selector Mover a. Arrastrar cambia la misma consecuencia que el selector nativo. El título y el texto distinguen zonas además del color. Añadir criterio usa un botón cobalto claramente accionable; abre el constructor y enfoca el nombre.

Los ocho criterios iniciales cubren duplicados, cuenta, presupuesto, proveedor, moneda, límite, servicio y confianza. La cuenta bancaria empieza en Por revisar. El constructor admite campos existentes o personalizados, condición, consecuencia y alcance por moneda. Guardar reglas y Descartar cambios cierran el formulario; la configuración vigente mantiene su versión. No se muestra una vista previa de simulación.

### Email inbox

La barra superior ofrece Actualizar y Redactar. Recibidos, Enviados, Borradores y Archivados son pestañas; la búsqueda se mantiene visible. Una lista de hilos con asunto y fragmento precede al lector. La selección usa fondo azul pálido. Los mensajes muestran remitente, destinatario, fecha, cuerpo y adjunto; las salidas automáticas indican su origen y el envío simulado. Responder y Reenviar están bajo la conversación. El redactor tiene campos etiquetados y acciones Enviar/Guardar borrador.

### Bank confirmation

Una advertencia en el detalle compara cuenta solicitada y registrada. La acción explícita Aprobar, añadir cuenta y pagar abre un diálogo que explica la incorporación y conservación de cuentas anteriores. Cancelar mantiene la revisión. La nota posterior en proveedor y el registro de factura documentan la acción.

### Statistics

Un panel tonal introduce el escenario ilustrativo de velocidad. Los conteos actuales se presentan con cifras grandes y etiquetas cortas. Barras horizontales muestran distribución de los tres estados, con texto y cantidades. La aclaración de tiempo ilustrativo está junto a los valores, no escondida en detalle técnico.

## Do's and Don'ts

### Do:

- **Do** conservar etiquetas textuales junto al color de estado.
- **Do** mantener estado, motivo y evidencia antes del detalle técnico.
- **Do** conservar el foco visible y la variante de movimiento reducido.
- **Do** usar la escala del prototipo para nuevas pantallas operativas.
- **Do** mantener las líneas fluidas discretas fuera de los datos y conservar el espacio amplio.
- **Do** distinguir cambios de configuración, reglas vigentes y decisión histórica con texto explícito.

### Don't:

- **Don't** presentar el color como único indicador de estado.
- **Don't** aplicar la escala de títulos del handoff a la interfaz operativa.
- **Don't** atribuir a la interfaz fuentes externas que no están cargadas.
- **Don't** presentar la inspiración en Blinka como afiliación oficial.



### Requisitos para pagar
Reglas muestra antes del tablero una lista de todos los criterios activos, con valores y ámbito. Se actualiza al añadir, editar, quitar o desactivar criterios. Todos los aplicables deben cumplirse para el pago automático; las excepciones conservan su aprobación humana. Tasa válida y proveedor no excluido son condiciones permanentes.

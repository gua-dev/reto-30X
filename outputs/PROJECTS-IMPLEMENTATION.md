# Proyecto: ampliación operativa

Referencia leída 2026-10-17: aplicación estática actual, DESIGN.md, propuesta-criterios.html del directorio outputs original y ficha desplegada de Proveedores. Paleta, tipografía, botones y paneles existentes son autoridad visual. La petición aprobada cambia la estructura, no la identidad. Datos ficticios identificados. No pagos/correos reales.

## Contrato de páginas

Cada archivo de página registra window.GuardPages.<name> = {render(C), bind(C)}. No modificar app.js ni domain.js en tareas de página. El root integra rutas y enlaces. C tiene getters state, D (GuardDomain), P (GuardProjects), route (texto sin #), params (URLSearchParams de query del hash); utilidades esc, money (centavos USD), icon, badge, footer(), save(), render(), notify(text), event(kind,title,detail,record,invoiceId), changed(kind,title,record) (versiona datos, registra, guarda), evaluate(), uid(prefix), currencyInput(name,value), categories, commentField(id,kind). C.go(hash) navega. C.confirm(title,text,action) confirma y llama action. C.projects() devuelve state.projects; C.project(id) devuelve proyecto. C.stats(projectId='all',period='30') devuelve P.metrics(state,D.INVOICES,id,period).

Estado: projects [{id,name,code,description,status:'active'|'archived',budget:centavos USD,period:'YYYY-MM',currencies:['USD'],listName,version}]; providerProjects [{projectId,providerKey,service,category,limit:centavos USD,currencies:[...]}]; ruleGroups [{id,name,scope:'global'|'project',projectId:null|id,enabled:true,criteria:[criterios D]}]. Facturas D.INVOICES tienen projectId y projectEvidence; proveedor original state.providers.items[key]. state.rules conserva limit,budget,priorSpent,confidence,allowed,criteria. P.projectUsage(state,invoices,id) devuelve {paid,pending,budget,available,count,automatic,review}. P.metrics retorna {count,paidCount,review,rejected,automatic,paid,pending,budget,available,automation,byCurrency:[{name,count,amount}],byProvider:[{name,count,amount}],series:[{label,paid,count,latency}],technical:{avgMs,p95Ms,throughput,errorRate,calls,tokens,costUsd,manualMinutes,savedHours},illustrative:true}; conteos/importes son del conjunto real local, series/technical datos ilustrativos separados.

Rutas: #projects, #project/ID, #project/new, #project/ID/edit, #providers?project=ID, #provider/KEY, #rules?project=ID (o global), #stats?project=ID&tab=technical&period=30, #inbox?project=ID&status=review, #rates. Enlaces de proyecto a reglas/estadísticas conservan contexto. Estados solo Pagado, Por revisar, Rechazado.

## Checklist por página

1. Un h1, acción principal explícita en .page-heading; h2 en secciones.
2. Reutilizar .btn, .btn.primary, .panel, .field, .form-grid, .badge, .button-row y helpers C.esc/money/icon.
3. Colores var(--ink), var(--muted), var(--bg), var(--surface), var(--line), var(--accent), var(--warn), var(--danger). Nuevos estilos en archivo de página con prefijo pg- et al; sin cambiar tokens existentes.
4. Cifras con unidad y periodo, fuente ilustrativa al lado de métricas no medidas. Todos los gráficos tienen título, leyenda y resumen accesible.
5. Acción de guardar y validación concreta; confirmar eliminación; eliminar proyecto solo sin facturas/eventos, archivar el resto.
6. Acciones accesibles con teclado, labels asociados, foco visible, objetivos táctiles de 44px. Esc cierra diálogos nativos.
7. Sin repetir requisitos en grandes bloques: criterios editor a la izquierda y resumen compacto sticky a la derecha.
8. Layout 2 columnas en escritorio, 1 en móvil; sin desbordamiento horizontal de página, tablas scroll interno si necesitan.
9. Cada filtro tiene resultado y estado vacío recuperable; accesos entre módulos preservan proyecto.
10. Proveedores conserva datos, bancos, notas, facturas y correos existentes. Nuevos vínculos independientes.

La lista final de funcionalidades y pruebas se mantiene en el informe de entrega. No se ha alterado el despliegue mientras se implementa.

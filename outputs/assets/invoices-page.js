(function(root){
  'use strict';
  function context(C){
    const project=C.params.get('project')||'all', status=C.params.get('status')||'all', q=(C.params.get('q')||'').trim(), period=['7','30','90'].includes(C.params.get('period'))?C.params.get('period'):'all';
    const cutoff=period==='all'?null:Date.now()-Number(period)*86400000;
    const rows=C.D.INVOICES.filter(i=>{
      const pid=C.P.invoiceProject(C.state,i),r=C.state.paidInvoices?.[i.id]||C.state.results[i.id];
      return (cutoff===null||new Date(i.receivedAt||r?.evaluatedAt||Date.now()).getTime()>=cutoff)&&(project==='all'||(project==='unassigned'?!pid:pid===project))&&(status==='all'||r?.status===status||(status==='blocked'&&r?.status==='rejected'))&&[i.id,i.vendor,i.reference,C.project(pid)?.name,i.projectReference].join(' ').toLocaleLowerCase().includes(q.toLocaleLowerCase());
    });
    return {project,status,q,period,rows};
  }
  function render(C){
    const {project,status,q,period,rows}=context(C),{esc,money,icon}=C;
    const result=i=>C.state.paidInvoices?.[i.id]||C.state.results[i.id];
    const count=s=>rows.filter(i=>s.includes(result(i)?.status)).length;
    const paid=rows.filter(i=>result(i)?.status==='approved').reduce((n,i)=>n+(result(i)?.fxSnapshot?.usdCents||0),0);
    const projectObject=C.project(project);
    return `<div class="page-heading"><div><h1>Facturas</h1><p>${projectObject?esc(projectObject.name)+' · ':''}Recibe, revisa y sigue cada decisión.</p></div><div class="heading-actions"><a class="btn primary" href="#new-invoice">${icon('plus')} Añadir factura</a><button class="btn" data-action="export">${icon('down')} Exportar CSV</button><button class="btn" data-action="evaluate">${icon('refresh')} Procesar de nuevo</button></div></div>
    <div class="iv-metrics" aria-label="Resumen de las facturas filtradas"><section><span>Facturas en esta vista</span><strong>${rows.length}</strong><small>Según los filtros seleccionados</small></section><section><span>Pagado</span><strong>${count(['approved'])}</strong><small>${money(paid)} USD · pagos simulados</small></section><section><span>Por revisar</span><strong>${count(['review'])}</strong><small>Requieren atención de Finanzas</small></section><section><span>Rechazado</span><strong>${count(['blocked','rejected'])}</strong><small>No continúan al pago</small></section></div>
    <section class="table-card iv-list" aria-labelledby="iv-title"><div class="iv-list-heading"><h2 id="iv-title">Todas las decisiones</h2>${projectObject?`<a href="#project/${encodeURIComponent(project)}">Ver proyecto ${icon('arrow')}</a>`:'<a href="#projects">Ver proyectos</a>'}</div>
    <form class="iv-filters" id="iv-filters"><label class="field" for="iv-period">Periodo<select id="iv-period" name="period">${[["all","Todo el historial"],["7","Últimos 7 días"],["30","Últimos 30 días"],["90","Últimos 90 días"]].map(([k,v])=>`<option value="${k}" ${period===k?"selected":""}>${v}</option>`).join("")}</select></label><label class="field" for="iv-project">Proyecto<select id="iv-project" name="project"><option value="all">Todos los proyectos</option><option value="unassigned" ${project==='unassigned'?'selected':''}>Sin proyecto confirmado</option>${C.projects().map(p=>`<option value="${esc(p.id)}" ${project===p.id?'selected':''}>${esc(p.name)}${p.status==='archived'?' · Archivado':''}</option>`).join('')}</select></label><label class="field" for="iv-status">Estado<select id="iv-status" name="status">${[['all','Todos los estados'],['review','Por revisar'],['approved','Pagado'],['blocked','Rechazado']].map(([k,v])=>`<option value="${k}" ${status===k?'selected':''}>${v}</option>`).join('')}</select></label><label class="field iv-search" for="iv-query">Buscar factura o proveedor<input id="iv-query" type="search" name="q" value="${esc(q)}" placeholder="Nombre, referencia o número"></label><button class="btn" type="submit">${icon('search')} Buscar</button>${project!=='all'||status!=='all'||period!=='all'||q?'<a class="iv-reset" href="#inbox">Limpiar filtros</a>':''}</form>
    ${rows.length?`<div class="table-wrap"><table class="iv-table"><thead><tr><th scope="col">Factura / proveedor</th><th scope="col">Proyecto</th><th scope="col">Importe</th><th scope="col">Estado y motivo</th><th scope="col"><span class="visually-hidden">Acciones</span></th></tr></thead><tbody>${rows.map(i=>{
      const r=result(i),pid=C.P.invoiceProject(C.state,i),p=C.project(pid),evidence=r?.projectEvidence||i.projectEvidence||i.projectReference;
      return `<tr><td><a class="iv-id" href="#invoice/${encodeURIComponent(i.id)}">${esc(i.id)}</a><a class="iv-provider" href="#provider/${encodeURIComponent(i.key)}">${esc(i.vendor)}</a><small class="iv-origin">${esc(i.origin||'Carga manual')} · ${esc(i.reference||'Sin referencia')}</small></td><td>${p?`<a class="iv-project-link" href="#project/${encodeURIComponent(p.id)}">${esc(p.name)}</a><small class="iv-evidence">${esc(evidence||'Proyecto conservado en esta decisión')}</small>`:`<span class="iv-unassigned">Por confirmar</span><small class="iv-evidence">${esc(evidence||'Sin una referencia de proyecto concluyente')}</small><a class="iv-confirm" href="#invoice/${encodeURIComponent(i.id)}">Confirmar proyecto</a>`}</td><td class="iv-amount"><strong>${new Intl.NumberFormat('es-VE',{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(i.original)||0)} <span>${esc(i.currency)}</span></strong>${i.currency!=='USD'?`<small>${r?.fxSnapshot?.usdCents!=null?money(r.fxSnapshot.usdCents)+' USD evaluados':'Conversión pendiente'}</small>`:''}</td><td>${r?C.badge(r):'<span class="badge review">Por revisar</span>'}<p class="iv-reason">${esc(r?.reason||'Pendiente de evaluación.')}</p></td><td><div class="iv-row-actions"><a class="btn sm" href="#invoice/${encodeURIComponent(i.id)}" aria-label="Ver detalle de ${esc(i.id)}">Ver detalle ${icon('arrow')}</a><a href="#mail/invoice/${encodeURIComponent(i.id)}" aria-label="Ver correos de ${esc(i.id)}">Ver correos</a></div></td></tr>`;
    }).join('')}</tbody></table></div><div class="table-footer"><span>${rows.length} de ${C.D.INVOICES.length} facturas</span><span>Datos ficticios · pagos simulados</span></div>`:'<div class="empty"><h3>No hay facturas con estos filtros</h3><p>Cambia el proyecto, el estado o la búsqueda para encontrar otras facturas.</p><a class="btn" href="#inbox">Mostrar todas las facturas</a></div>'}</section>${C.footer()}`;
  }
  function bind(C){
    const form=document.getElementById('iv-filters');if(!form)return;
    const apply=()=>{const data=new FormData(form),query=new URLSearchParams();for(const [k,v] of data){const value=String(v).trim();if(value&&value!=='all')query.set(k,value);}C.go('#inbox'+(query.size?'?'+query.toString():''));};
    form.addEventListener('submit',e=>{e.preventDefault();apply();});
    form.querySelectorAll('select').forEach(select=>select.addEventListener('change',apply));
  }
  root.GuardPages??={};root.GuardPages.invoices={render,bind};
})(window);


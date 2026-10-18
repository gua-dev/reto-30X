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
    const scoped=C.D.INVOICES.filter(i=>{const pid=C.P.invoiceProject(C.state,i);return (project==='all'||(project==='unassigned'?!pid:pid===project))&&[i.id,i.vendor,i.reference].join(' ').toLocaleLowerCase().includes(q.toLocaleLowerCase());});
    const statusCount=s=>scoped.filter(i=>s==='all'||(s==='blocked'?['blocked','rejected'].includes(result(i)?.status):result(i)?.status===s)).length;
    const usage=projectObject?C.P.projectUsage(C.state,C.D.INVOICES,project):null;
    return `<div class="page-heading"><div><h1>Facturas</h1><p>Recibe, revisa y sigue cada decisión.</p></div><div class="heading-actions"><a class="btn primary" href="#new-invoice">${icon('plus')} Añadir factura</a><button class="btn" data-action="export">${icon('down')} Exportar CSV</button></div></div>
    <section class="iv-summary"><form class="iv-toolbar" id="iv-filters"><input name="status" type="hidden" value="${esc(status)}"><div class="iv-tabs" role="group" aria-label="Filtrar por estado">${[['all','Todas'],['review','Por revisar'],['approved','Pagado'],['blocked','Rechazado']].map(([key,label])=>`<button type="button" class="iv-tab ${key==='review'?'attention':''}" data-iv-status="${key}" aria-pressed="${status===key}">${label}<strong>${statusCount(key)}</strong></button>`).join('')}</div><div class="iv-tools"><label class="visually-hidden" for="iv-project">Proyecto</label><select id="iv-project" name="project"><option value="all">Todos los proyectos</option><option value="unassigned" ${project==='unassigned'?'selected':''}>Sin proyecto</option>${C.projects().map(p=>`<option value="${esc(p.id)}" ${p.id===project?'selected':''}>${esc(p.name)}</option>`).join('')}</select><label class="visually-hidden" for="iv-query">Buscar factura o proveedor</label><input id="iv-query" type="search" name="q" placeholder="Buscar factura o proveedor" value="${esc(q)}"></div></form>
    ${usage?`<div class="iv-budget"><div class="iv-budget-head"><span>Disponible · ${esc(projectObject.name)}</span><strong>${money(Math.max(0,usage.available-usage.pending))} <small>USD</small></strong></div><div class="iv-track" role="img" aria-label="Pagado ${money(usage.paid)}, retenido ${money(usage.pending)}, presupuesto ${money(usage.budget)}"><i style="width:${usage.budget?Math.min(100,usage.paid/usage.budget*100):0}%"></i><i class="held" style="width:${usage.budget?Math.max(0,Math.min(usage.pending,usage.budget-usage.paid))/usage.budget*100:0}%"></i></div><div class="iv-legend"><span>● Pagado ${money(usage.paid)}</span><span>● Retenido ${money(usage.pending)}</span><span>Total ${money(usage.budget)}</span></div><p>Lo retenido está reservado para facturas por revisar.${usage.paid+usage.pending>usage.budget?' Las solicitudes pendientes superan el presupuesto.':''}</p></div>`:''}</section>
    <section class="table-card iv-list" aria-label="Facturas">
    ${rows.length?`<div class="table-wrap"><table class="iv-table"><thead><tr><th scope="col">Factura / proveedor</th><th scope="col">Proyecto</th><th scope="col">Importe</th><th scope="col">Estado y motivo</th><th scope="col"><span class="visually-hidden">Acciones</span></th></tr></thead><tbody>${rows.map(i=>{
      const r=result(i),pid=C.P.invoiceProject(C.state,i),p=C.project(pid),evidence=r?.projectEvidence||i.projectEvidence||i.projectReference;
      return `<tr><td><a class="iv-id" href="#invoice/${encodeURIComponent(i.id)}">${esc(i.id)}</a><a class="iv-provider" href="#provider/${encodeURIComponent(i.key)}">${esc(i.vendor)}</a><small class="iv-origin">${esc(i.origin||'Carga manual')} · ${esc(i.reference||'Sin referencia')}</small></td><td>${p?`<a class="iv-project-link" href="#project/${encodeURIComponent(p.id)}">${esc(p.name)}</a><small class="iv-evidence">${esc((evidence||'Proyecto conservado en esta decisión').replace(/ en documento sintético/g,' en el documento'))}</small>`:`<span class="iv-unassigned">Por confirmar</span><small class="iv-evidence">${esc(evidence||'Sin una referencia de proyecto concluyente')}</small><a class="iv-confirm" href="#invoice/${encodeURIComponent(i.id)}">Confirmar proyecto</a>`}</td><td class="iv-amount"><strong>${new Intl.NumberFormat('es-VE',{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(i.original)||0)} <span>${esc(i.currency)}</span></strong>${i.currency!=='USD'?`<small>${r?.fxSnapshot?.usdCents!=null?money(r.fxSnapshot.usdCents)+' USD evaluados':'Conversión pendiente'}</small>`:''}</td><td>${r?C.badge(r):'<span class="badge review">Por revisar</span>'}<p class="iv-reason">${esc(C.invoiceReason?C.invoiceReason(i,r):r?.reason||'Pendiente de evaluación.')}</p></td><td><div class="iv-row-actions"><a class="btn sm" href="#invoice/${encodeURIComponent(i.id)}" aria-label="Ver detalle de ${esc(i.id)}">Ver detalle ${icon('arrow')}</a></div></td></tr>`;
    }).join('')}</tbody></table></div><div class="table-footer"><span>${rows.length} de ${C.D.INVOICES.length} facturas</span><span>Datos ficticios · pagos simulados</span></div>`:'<div class="empty"><h3>No hay facturas con estos filtros</h3><p>Cambia el proyecto, el estado o la búsqueda para encontrar otras facturas.</p><a class="btn" href="#inbox">Mostrar todas las facturas</a></div>'}</section>${C.footer()}`;
  }
  function bind(C){
    const form=document.getElementById('iv-filters');if(!form)return;
    const apply=()=>{const data=new FormData(form),query=new URLSearchParams();for(const [k,v] of data){const value=String(v).trim();if(value&&value!=='all')query.set(k,value);}C.go('#inbox'+(query.size?'?'+query.toString():''));};
    form.addEventListener('submit',e=>{e.preventDefault();apply();});
    form.querySelectorAll('select').forEach(select=>select.addEventListener('change',apply));
    form.querySelectorAll('[data-iv-status]').forEach(b=>b.onclick=()=>{form.elements.status.value=b.dataset.ivStatus;apply();});
    let timer;form.elements.q.oninput=()=>{clearTimeout(timer);timer=setTimeout(()=>{const value=form.elements.q.value;apply();setTimeout(()=>{const input=document.getElementById('iv-query');if(input){input.focus();input.setSelectionRange(value.length,value.length);}},60);},280);};
  }
  root.GuardPages??={};root.GuardPages.invoices={render,bind};
})(window);


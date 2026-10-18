(function(root){
  'use strict';
  root.GuardPages=root.GuardPages||{};
  const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es');
  const projectIds=(C,key)=>[...new Set((C.state.providerProjects||[]).filter(link=>link.providerKey===key).map(link=>link.projectId))];
  const currencyCodes=p=>[...new Set(p.currencies||[])];
  function filters(C){return {q:C.params.get('q')||'',project:C.params.get('project')||'all'};}
  function rows(C,q,project){
    const items=Object.entries(C.state.providers.items).filter(([key,p])=>normalize(p.name).includes(normalize(q.trim()))&&(project==='all'||(project==='none'?projectIds(C,key).length===0:projectIds(C,key).includes(project))));
    return {count:items.length,html:items.map(([key,p])=>{
      const ids=projectIds(C,key),first=ids.includes(project)?project:ids[0],projectName=first?(C.project(first)?.name||first):'',currencies=currencyCodes(p),safeKey=C.esc(key),name=C.esc(p.name);
      return `<tr><td><strong class="pl-name">${name}</strong><small class="pl-country">${C.esc(p.country||'Sin país definido')}</small></td><td><span class="pl-service" title="${C.esc(p.service||'')}">${C.esc(p.service||'Servicio pendiente')}</span></td><td><div class="pl-currencies"><span>${C.esc(currencies.slice(0,2).join(', ')||'Sin monedas')}</span>${currencies.length>2?`<button type="button" class="pl-more" data-pl-currencies="${safeKey}" aria-label="Ver las ${currencies.length} monedas de ${name}">+${currencies.length-2}</button>`:''}</div></td><td>${first?`<div class="pl-projects"><button type="button" class="pl-project" data-pl-projects="${safeKey}" title="${C.esc(projectName)}" aria-label="Ver proyectos de ${name}">${C.esc(projectName)}</button>${ids.length>1?`<button type="button" class="pl-more" data-pl-projects="${safeKey}" aria-label="Ver los ${ids.length} proyectos de ${name}">+${ids.length-1}</button>`:''}</div>`:'<span class="muted">Sin proyectos asignados</span>'}</td><td><a class="btn" href="#provider/${encodeURIComponent(key)}">Ver ficha <span aria-hidden="true">→</span></a></td></tr>`;
    }).join('')||'<tr><td colspan="5" class="pl-empty">No se encontraron proveedores con estos filtros.</td></tr>'};
  }
  function render(C){
    const {q,project}=filters(C),result=rows(C,q,project),projects=C.projects();
    return `<section class="pl-page" aria-labelledby="pl-title"><header class="page-heading"><h1 id="pl-title">Proveedores</h1><a class="btn primary" href="#provider/new"><span class="pl-plus" aria-hidden="true">＋</span>Añadir proveedor</a></header><div class="pl-toolbar"><label class="search pl-search">${C.icon('search')}<input id="pl-search" type="search" placeholder="Buscar por nombre" aria-label="Buscar proveedor por nombre" value="${C.esc(q)}"></label><select id="pl-project-filter" aria-label="Filtrar proveedores por proyecto"><option value="all" ${project==='all'?'selected':''}>Todos los proyectos</option>${projects.map(p=>`<option value="${C.esc(p.id)}" ${project===p.id?'selected':''}>${C.esc(p.name)}</option>`).join('')}<option value="none" ${project==='none'?'selected':''}>Sin proyectos</option>${project!=='all'&&project!=='none'&&!projects.some(p=>p.id===project)?`<option value="${C.esc(project)}" selected>Proyecto no disponible</option>`:''}</select></div><div class="table-wrap pl-table-wrap" tabindex="0" role="region" aria-label="Lista de proveedores"><table class="pl-table"><thead><tr><th scope="col">Proveedor</th><th scope="col">Servicio</th><th scope="col">Monedas</th><th scope="col">Proyectos</th><th scope="col"><span class="pl-sr-only">Acciones</span></th></tr></thead><tbody id="pl-rows">${result.html}</tbody></table></div><p class="pl-count muted small" id="pl-count" role="status">${result.count} ${result.count===1?'proveedor':'proveedores'}</p><dialog class="pl-dialog" id="pl-dialog" aria-labelledby="pl-dialog-title"><h2 id="pl-dialog-title"></h2><div id="pl-dialog-body"></div><div class="pl-dialog-actions"><button type="button" class="btn" data-pl-close autofocus>Cerrar</button></div></dialog></section>${C.footer?C.footer():''}`;
  }
  function bind(C){
    const page=document.querySelector('.pl-page');if(!page)return;
    const search=page.querySelector('#pl-search'),select=page.querySelector('#pl-project-filter'),dialog=page.querySelector('#pl-dialog');
    function update(){
      const params=new URLSearchParams();if(search.value)params.set('q',search.value);if(select.value!=='all')params.set('project',select.value);
      history.replaceState(null,'','#providers'+(params.size?'?'+params.toString():''));
      const result=rows(C,search.value,select.value);page.querySelector('#pl-rows').innerHTML=result.html;page.querySelector('#pl-count').textContent=result.count+' '+(result.count===1?'proveedor':'proveedores');
    }
    search.addEventListener('input',update);select.addEventListener('change',update);
    page.querySelector('[data-pl-close]').addEventListener('click',()=>dialog.close());
    page.querySelector('#pl-rows').addEventListener('click',event=>{
      const button=event.target.closest('[data-pl-projects],[data-pl-currencies]');if(!button)return;
      const isCurrency=button.hasAttribute('data-pl-currencies'),key=isCurrency?button.dataset.plCurrencies:button.dataset.plProjects,p=C.state.providers.items[key];if(!p)return;
      page.querySelector('#pl-dialog-title').textContent=(isCurrency?'Monedas de ':'Proyectos de ')+p.name;
      let names;try{names=new Intl.DisplayNames(['es'],{type:'currency'});}catch(_){}
      const content=isCurrency?currencyCodes(p).map(code=>{let name=code;try{name=names?.of(code)||code;}catch(_){}return `<li><strong>${C.esc(code)}</strong><span class="muted">${C.esc(name)}</span></li>`;}):projectIds(C,key).map(id=>`<li><strong>${C.esc(C.project(id)?.name||id)}</strong></li>`);
      page.querySelector('#pl-dialog-body').innerHTML=`<ul class="pl-modal-list">${content.join('')}</ul>`;dialog.showModal();
    });
  }
  root.GuardPages.providerList={render,bind};
})(window);

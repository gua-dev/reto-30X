/* Shared project navigation and integration helpers. */
window.GuardWorkspace={
  nav(C){
    const {state,esc,icon}=C,prefs=state.navPrefs,base=C.route.split('/')[0];
    const active=base==='invoice'||base==='new-invoice'?'inbox':base==='provider'?'providers':base==='project'?'projects':base;
    const items=[['inbox','file','Facturas'],['projects','grid','Proyectos'],['mail','chat','Bandeja de correos'],['providers','file','Proveedores'],['rules','sliders','Criterios de aceptación'],['stats','grid','Estadísticas'],['rates','refresh','Tasas'],['activity','clock','Registro']];
    const pinned=prefs.pinned.map(id=>C.project(id)).filter(p=>p&&p.status==='active');
    const projectLink=(p,pin)=>`<div class="ws-project-link"><a href="#project/${esc(p.id)}" ${C.route==='project/'+p.id?'aria-current="page"':''}><span class="ws-project-dot"></span>${esc(p.name)}</a><details class="ws-nav-menu"><summary aria-label="Opciones de ${esc(p.name)}">⋯</summary><div><button data-pin="${esc(p.id)}">${pin?'Desfijar':'Fijar proyecto'}</button>${pin?`<button data-move-pin="${esc(p.id)}">Subir en favoritos</button>`:''}<button data-hide-project="${esc(p.id)}">Quitar de accesos</button></div></details></div>`;
    const subs={
      inbox:'<a href="#inbox">Todas las facturas</a><a href="#inbox?status=review">Por revisar</a>',
      projects:`<div class="ws-subtitle">Fijados</div>${pinned.map(p=>projectLink(p,true)).join('')||'<span class="ws-subtitle">Sin proyectos fijados</span>'}<div class="ws-subtitle">Recientes</div>${prefs.recent.filter(id=>!prefs.pinned.includes(id)&&!prefs.hidden.includes(id)).slice(0,3).map(id=>C.project(id)).filter(p=>p&&p.status==='active').map(p=>projectLink(p,false)).join('')}<a href="#projects">Ver todos los proyectos</a><a href="#project/new">${icon('plus')} Crear proyecto</a>`,
      rules:`<a href="#rules">Generales de empresa</a>${pinned.map(p=>`<a href="#rules?project=${esc(p.id)}">${esc(p.name)}</a>`).join('')}`,
      stats:`<a href="#stats">Resumen global</a><a href="#stats?tab=technical">Rendimiento del sistema</a>${pinned.map(p=>`<a href="#stats?project=${esc(p.id)}">${esc(p.name)}</a>`).join('')}`
    };
    return items.map(([id,ic,title])=>`<div class="ws-nav-group"><div class="ws-nav-row"><a href="#${id}" data-nav="${id}" ${active===id?'aria-current="page"':''}>${icon(ic)}<span>${title}</span></a>${subs[id]?`<button class="ws-expand" data-expand="${id}" aria-label="${prefs.open[id]?'Contraer':'Desplegar'} ${title}" aria-expanded="${!!prefs.open[id]}" aria-controls="sub-${id}">${icon(prefs.open[id]?'chevron-up':'chevron-down')}</button>`:''}</div>${subs[id]?`<div class="ws-subnav" id="sub-${id}" ${prefs.open[id]?'':'hidden'}>${subs[id]}</div>`:''}</div>`).join('')+'<a href="#guide">'+icon('help')+'<span>Ayuda</span></a>';
  },
  bindNav(C){
    const prefs=C.state.navPrefs;
    document.querySelectorAll('[data-expand]').forEach(b=>b.onclick=()=>{prefs.open[b.dataset.expand]=!prefs.open[b.dataset.expand];C.save();const nav=document.querySelector('.nav');nav.innerHTML=this.nav(C);this.bindNav(C);nav.querySelector(`[data-expand="${b.dataset.expand}"]`)?.focus();});
    document.querySelectorAll('[data-pin]').forEach(b=>b.onclick=()=>{const id=b.dataset.pin;prefs.pinned=prefs.pinned.includes(id)?prefs.pinned.filter(x=>x!==id):[...prefs.pinned,id];prefs.hidden=prefs.hidden.filter(x=>x!==id);C.save();C.render();});
    document.querySelectorAll('[data-hide-project]').forEach(b=>b.onclick=()=>{const id=b.dataset.hideProject;prefs.pinned=prefs.pinned.filter(x=>x!==id);prefs.hidden.push(id);C.save();C.render();C.notify('Acceso quitado. El proyecto sigue en «Ver todos los proyectos».');});
    document.querySelectorAll('[data-move-pin]').forEach(b=>b.onclick=()=>{const id=b.dataset.movePin,n=prefs.pinned.indexOf(id);if(n>0)[prefs.pinned[n-1],prefs.pinned[n]]=[prefs.pinned[n],prefs.pinned[n-1]];C.save();C.render();});
    document.querySelector('#ws-mobile-menu')?.addEventListener('click',()=>{const shell=document.querySelector('.sidebar'),open=shell.classList.toggle('ws-open');document.querySelector('#ws-mobile-menu').setAttribute('aria-expanded',String(open));});
  },
  select(C,value='all',id='ws-project-filter',label='Proyecto'){
    return `<label class="field ws-filter"><span>${label}</span><select id="${id}"><option value="all" ${value==='all'?'selected':''}>Todos los proyectos</option><option value="unassigned" ${value==='unassigned'?'selected':''}>Sin proyecto confirmado</option>${C.projects().map(p=>`<option value="${C.esc(p.id)}" ${p.id===value?'selected':''}>${C.esc(p.name)}${p.status==='archived'?' · Archivado':''}</option>`).join('')}</select></label>`;
  }
};

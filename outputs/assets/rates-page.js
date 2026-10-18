/* Rates presentation uses the application's persisted rates and original form handlers. */
(() => {
  'use strict';
  let query = '';
  const number = value => new Intl.NumberFormat('es', {maximumFractionDigits: 6}).format(value);
  const key = (a,b) => a+'/'+b;
  function rows(C) {
    const fx=C.state.candidate||C.state.fx;
    const pairs=[...C.state.favorites,...Object.keys(C.state.pairRates||{}).map(p=>p.split('/')),...Object.keys(fx.rates||{}).filter(c=>c!=='USD').map(c=>['USD',c])];
    const seen=new Set();
    return pairs.filter(([a,b])=>{const id=key(a,b);if(seen.has(id))return false;seen.add(id);return true;}).map(([a,b])=>{
      const rate=C.pairValue(a,b);
      const direct=C.state.pairRates[key(a,b)],inverse=C.state.pairRates[key(b,a)];
      const stored=direct?.date===C.D.today()?direct:inverse?.date===C.D.today()?inverse:null;
      const manual=stored?.origin==='manual'||(!stored&&(fx.rates[b]?.origin==='manual'||(b==='USD'&&fx.rates[a]?.origin==='manual')));
      return {a,b,id:key(a,b),rate,source:rate?(manual?'Manual':/ejemplo|sintétic/i.test(rate.source||'')?'Carga inicial':rate.source):'Fuente pendiente',favorite:C.state.favorites.some(p=>p[0]===a&&p[1]===b)};
    });
  }
  function star(C,r) {return `<button type="button" class="rg-star ${r.favorite?'is-active':''}" data-rg-star="${C.esc(r.id)}" aria-pressed="${r.favorite}" aria-label="${r.favorite?'Quitar de destacadas':'Destacar'} ${C.esc(r.a+' / '+r.b)}">${r.favorite?'★':'☆'}</button>`;}
  function conversion(C,r) {return r.rate?`1 ${C.esc(r.a)} = ${number(r.rate.value)} ${C.esc(r.b)}`:'Sin tasa disponible';}
  function searchText(r) {
    let names='';try{const display=new Intl.DisplayNames(['es'],{type:'currency'});names=display.of(r.a)+' '+display.of(r.b);}catch(_){}
    return (r.a+' '+r.b+' '+r.id+' '+r.a+' / '+r.b+' '+names).toLocaleLowerCase();
  }
  function tableRows(C) {
    const visible=rows(C).filter(r=>searchText(r).includes(query.toLocaleLowerCase().trim()));
    return visible.map(r=>`<tr><td>${star(C,r)}</td><td><strong>${C.esc(r.a)} / ${C.esc(r.b)}</strong></td><td class="rg-conversion">${conversion(C,r)}</td><td class="rg-source"><strong title="${C.esc(r.rate?.source||'')}">${C.esc(r.source)}</strong><small>${C.esc(r.rate?.date||'—')}</small></td><td><button type="button" class="btn sm" data-rg-edit="${C.esc(r.id)}">${r.rate?'Editar tasa':'Añadir valor'}</button></td></tr>`).join('')||'<tr><td colspan="5" class="muted">No hay tasas que coincidan con la búsqueda.</td></tr>';
  }
  function decorate(C,original) {
    const host=document.createElement('div');host.innerHTML=original;
    const form=host.querySelector('#pair-form');if(!form)return original;
    const heading=host.querySelector('.page-heading');heading.classList.add('rg-heading');
    heading.querySelector('p').textContent='Consulta y gestiona las tasas para tus pagos.';
    const fetch=host.querySelector('#fetch-rates'),busy=fetch.textContent.includes('Consultando');
    fetch.textContent=busy?'Consultando…':'Consultar referencia del día';fetch.disabled=busy;fetch.setAttribute('aria-busy',String(busy));
    const actions=document.createElement('div');actions.className='rg-header-actions';actions.append(fetch);actions.insertAdjacentHTML('beforeend','<button type="button" class="btn primary" id="rg-add"><span aria-hidden="true">＋</span>Añadir tasa manual</button>');heading.append(actions);
    const layout=host.querySelector('.rates-layout'),apply=host.querySelector('#apply-rates');
    const content=document.createElement('div');content.className='rg-page';
    content.innerHTML=`<section aria-labelledby="rg-favorites-title"><div class="rg-section-heading"><h2 id="rg-favorites-title">Destacadas</h2><span class="small muted">Elige entre 2 y 4 pares para tenerlos a mano.</span></div><div class="rg-favorites">${rows(C).filter(r=>r.favorite).slice(0,4).map(r=>`<article class="rg-favorite"><div class="rg-favorite-top"><strong>${C.esc(r.a)} / ${C.esc(r.b)}</strong>${star(C,r)}</div><p class="rg-value">${conversion(C,r)}</p><div class="rg-favorite-bottom"><span class="small muted" title="${C.esc(r.rate?.source||'')}">${C.esc(r.source)}</span><button type="button" class="rg-link" data-rg-edit="${C.esc(r.id)}">${r.rate?'Editar':'Añadir valor'}</button></div></article>`).join('')}</div></section><div class="rg-toolbar"><label class="rg-search"><span class="sr-only">Buscar moneda o par</span><input type="search" id="rg-search" value="${C.esc(query)}" placeholder="Buscar moneda o par"></label></div><div class="rg-table-scroll" tabindex="0" role="region" aria-label="Tasas de cambio"><table><thead><tr><th><span class="sr-only">Destacar</span></th><th>Par de monedas</th><th>Tasa</th><th>Fuente y fecha</th><th><span class="sr-only">Acciones</span></th></tr></thead><tbody id="rg-rows">${tableRows(C)}</tbody></table></div><div class="rg-foot"><span class="small muted">Referencias indicativas · <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener">Fuente diaria: ExchangeRate-API</a></span><button type="button" class="rg-link" id="rg-history">Ver historial de cambios</button></div>`;
    if(apply){const proposal=document.createElement('div');proposal.className='notice info rg-proposal';proposal.innerHTML='<p>La consulta preparó una propuesta. Aplica las tasas consultadas para procesar las facturas pendientes.</p>';proposal.append(apply);content.append(proposal);}
    const dialog=document.createElement('dialog');dialog.id='rg-editor';dialog.className='rg-dialog';dialog.setAttribute('aria-labelledby','rg-editor-title');dialog.innerHTML='<h2 id="rg-editor-title">Añadir tasa manual</h2>';
    form.querySelector('#pin-pair').textContent='Destacar este par';
    form.insertAdjacentHTML('beforeend','<button class="btn" type="button" data-rg-close>Cancelar</button>');
    dialog.append(form);content.append(dialog);
    content.insertAdjacentHTML('beforeend','<dialog id="rg-history-dialog" class="rg-dialog" aria-labelledby="rg-history-title"><h2 id="rg-history-title">Historial de tasas</h2><div id="rg-history-content"></div><div class="button-row"><button type="button" class="btn" data-rg-close>Cerrar</button></div></dialog>');
    layout.replaceWith(content);return host.innerHTML;
  }
  function bind(C) {
    const form=document.getElementById('pair-form'),dialog=document.getElementById('rg-editor');if(!form||!dialog)return;
    function open(id) {
      const pair=id?id.split('/'):['USD',''];
      form.elements.from.value=pair[0];form.elements.to.value=pair[1];
      form.elements.from.readOnly=!!id;form.elements.to.readOnly=!!id;
      form.elements.to.dispatchEvent(new Event('input',{bubbles:true}));
      form.querySelector('#pair-error').textContent='';
      const note=form.querySelector('#pair-note');if(note)note.value='';
      document.getElementById('rg-editor-title').textContent=id?'Editar tasa':'Añadir tasa manual';
      dialog.showModal();(id?form.elements.value:form.elements.to).focus();
    }
    function bindRows() {
      document.querySelectorAll('[data-rg-edit]').forEach(button=>button.onclick=()=>open(button.dataset.rgEdit));
      document.querySelectorAll('[data-rg-star]').forEach(button=>button.onclick=()=>{
        const pair=button.dataset.rgStar.split('/'),index=C.state.favorites.findIndex(p=>p[0]===pair[0]&&p[1]===pair[1]);
        if(index>=0){if(C.state.favorites.length<=2){C.notify('Conserva al menos dos pares destacados.');return;}C.state.favorites.splice(index,1);}
        else {if(C.state.favorites.length>=4){C.notify('Ya tienes cuatro pares destacados. Quita una estrella antes de añadir otro.');return;}C.state.favorites.push(pair);}
        C.save();C.render();document.querySelector(`[data-rg-star="${pair.join('/')}"]`)?.focus({preventScroll:true});
      });
    }
    bindRows();document.getElementById('rg-add').onclick=()=>open();
    document.getElementById('rg-search').oninput=e=>{query=e.target.value;document.getElementById('rg-rows').innerHTML=tableRows(C);bindRows();};
    document.querySelectorAll('[data-rg-close]').forEach(button=>button.onclick=()=>button.closest('dialog').close());
    document.getElementById('rg-history').onclick=()=>{
      const events=[...C.state.events].reverse().filter(e=>e.kind==='fx'||e.kind.startsWith('fx-'));
      document.getElementById('rg-history-content').innerHTML=events.length?events.map(e=>`<article class="rg-history-row"><h3>${C.esc(e.title)}</h3><small class="muted">${C.esc(new Date(e.at).toLocaleString('es'))} · ${C.esc(e.record?.actor||'')}</small><p>${C.esc(e.detail||'')}</p>${e.record?.rate?.source?`<p class="small muted">Fuente: ${C.esc(e.record.rate.source)}</p>`:''}</article>`).join(''):'<p class="muted">Todavía no hay cambios de tasas registrados.</p>';
      document.getElementById('rg-history-dialog').showModal();
    };
  }
  window.GuardPages=window.GuardPages||{};window.GuardPages.rates={decorate,bind};
})();

/* Market presentation: illustrative history is deliberately separate from applied rates. */
(() => {
  'use strict';
  const pairs = [['USD','COP'],['USD','MXN'],['EUR','USD'],['USD','VES'],['USD','ARS'],['BTC','USD'],['ETH','USD'],['USDC','USD']];
  const samples = {'USD/COP':4210,'USD/MXN':18.65,'EUR/USD':1.09,'USD/VES':43.2,'USD/ARS':1045,'BTC/USD':67420,'ETH/USD':2680,'USDC/USD':1};
  let range = 30;
  const number = value => new Intl.NumberFormat('es',{maximumFractionDigits: value < 2 ? 5 : 2}).format(value);
  function history(a,b) {
    const base=samples[a+'/'+b] || (samples[b+'/'+a] ? 1/samples[b+'/'+a] : 100);
    let last=base*.97;
    return Array.from({length:range},(_,i)=>{
      const open=last, close=base*(.97+.001*i+.013*Math.sin(i*1.7)+.007*Math.cos(i*.55));
      last=close;
      return {open,close,high:Math.max(open,close)*1.006,low:Math.min(open,close)*.994,volume:30+Math.abs(Math.sin(i*2.3))*65};
    });
  }
  function chart(C,a,b) {
    const rows=history(a,b),low=Math.min(...rows.map(r=>r.low)),high=Math.max(...rows.map(r=>r.high)),span=high-low;
    const y=v=>28+(high-v)/span*210,w=648/rows.length;
    const grid=Array.from({length:5},(_,i)=>{const yy=28+i*52.5;return `<line x1="8" y1="${yy}" x2="660" y2="${yy}" class="rg-grid"/><text x="670" y="${yy+4}">${number(high-i*span/4)}</text>`;}).join('');
    const candles=rows.map((r,i)=>{const x=14+i*w,up=r.close>=r.open;return `<g class="${up?'rg-up':'rg-down'}"><title>Día ${i+1}: apertura ${number(r.open)}, cierre ${number(r.close)} ${C.esc(b)}; datos ficticios</title><line x1="${x+w/2}" x2="${x+w/2}" y1="${y(r.high)}" y2="${y(r.low)}"/><rect x="${x+w*.2}" y="${Math.min(y(r.open),y(r.close))}" width="${Math.max(2,w*.6)}" height="${Math.max(2,Math.abs(y(r.open)-y(r.close)))}"/><rect class="rg-volume" x="${x+w*.2}" y="${305-r.volume*.45}" width="${Math.max(2,w*.6)}" height="${r.volume*.45}"/></g>`;}).join('');
    const first=rows[0].open,last=rows.at(-1).close,change=(last/first-1)*100;
    return `<div class="rg-chart-summary"><div><span class="small muted">Cierre ilustrativo · ${C.esc(b)}</span><strong>${number(last)}</strong></div><div><span class="small muted">Variación ilustrativa · ${range} días</span><strong class="${change>=0?'rg-rise':'rg-fall'}">${change>=0?'+':''}${change.toFixed(2)}%</strong></div><div><span class="small muted">Máximo / mínimo ilustrativos</span><strong class="rg-minmax">${number(high)} / ${number(low)}</strong></div></div><svg class="rg-chart" viewBox="0 0 770 338" role="img" aria-label="Histórico ficticio de ${C.esc(a)} a ${C.esc(b)}, ${range} días. Velas de apertura, máximo, mínimo y cierre; barras de actividad ilustrativa.">${grid}${candles}<text x="10" y="330">Hace ${range} días</text><text x="600" y="330">Hoy</text></svg><div class="rg-chart-foot small muted"><span><i class="rg-legend-up"></i> Sube <i class="rg-legend-down"></i> Baja · Barras: actividad ilustrativa</span><span>Serie sintética · No se utiliza para evaluar facturas</span></div>`;
  }
  function decorate(C, original) {
    const host=document.createElement('div');host.innerHTML=original;
    const form=host.querySelector('#pair-form');if(!form)return original;
    const a=form.elements.from.value,b=form.elements.to.value;
    host.querySelector('.page-heading p').textContent='Compara monedas, consulta referencias y configura las tasas de tus operaciones.';
    const applied=C.pairValue(a,b);
    const market=document.createElement('div');market.className='rg-market';
    market.innerHTML=`<div class="rg-pairs" aria-label="Pares de acceso rápido">${pairs.map(([x,z])=>{const r=C.pairValue(x,z);return `<button class="rg-pair ${a===x&&b===z?'is-selected':''}" data-rg-pair="${x}/${z}" aria-pressed="${a===x&&b===z}"><span>${x} / ${z}</span><strong>${r?number(r.value):'Sin referencia'}</strong><small>${r?C.esc(r.date):'Añadir tasa manual'}</small></button>`;}).join('')}</div><section class="panel rg-history"><div class="rg-section-head"><div><h2>${C.esc(a)} / ${C.esc(b)}</h2><span class="badge">Histórico ilustrativo</span></div><div class="button-row" aria-label="Periodo del gráfico">${[7,30,90].map(n=>`<button class="btn sm ${range===n?'primary':''}" data-rg-range="${n}" aria-pressed="${range===n}">${n} días</button>`).join('')}</div></div>${chart(C,a,b)}<div class="rg-applied"><div><span class="small muted">Referencia disponible para operaciones</span><strong>${applied?`1 ${C.esc(a)} = ${number(applied.value)} ${C.esc(b)}`:'Sin referencia disponible'}</strong><span class="small muted">${applied?`${C.esc(applied.source)} · ${C.esc(applied.date)}`:'Añade una fuente y el valor en el formulario inferior.'}</span></div><button class="btn" id="rg-edit-rate">Editar tasa de hoy ↓</button></div></section></div>`;
    const layout=host.querySelector('.rates-layout');layout.before(market);
    const title=layout.querySelector('h2');if(title)title.textContent='Configurar tasa de hoy';
    const list=form.querySelector('input[name="from"]');if(list)list.placeholder='Buscar código: USD, EUR…';
    form.elements.to.placeholder='Buscar código: COP, BTC…';
    const comparison=document.createElement('section');comparison.className='panel rg-comparison';
    comparison.innerHTML=`<div class="rg-section-head"><div><h2>Comparación de pares</h2><p class="small muted">Referencias disponibles y variación de una serie ficticia, identificadas por separado.</p></div></div><div class="rg-table-scroll" tabindex="0" role="region" aria-label="Comparación de tasas. Desplaza horizontalmente para consultar todas las columnas"><table><thead><tr><th>Par</th><th>Referencia disponible</th><th>Fuente / fecha</th><th>Variación ${range} días<br><span class="small muted">Ilustrativa</span></th><th><span class="sr-only">Acción</span></th></tr></thead><tbody>${pairs.map(([x,z])=>{const r=C.pairValue(x,z),h=history(x,z),v=(h.at(-1).close/h[0].open-1)*100;return `<tr><td><strong>${x} / ${z}</strong></td><td>${r?number(r.value)+' '+z:'Sin referencia'}</td><td class="rg-source">${r?`${C.esc(r.source)}<small>${C.esc(r.date)}</small>`:'Pendiente de registrar'}</td><td class="${v>=0?'rg-rise':'rg-fall'}">${v>=0?'+':''}${v.toFixed(2)}%</td><td><button class="btn sm" data-rg-pair="${x}/${z}" aria-label="Ver par ${x} a ${z}">Ver par</button></td></tr>`;}).join('')}</tbody></table></div>`;
    layout.after(comparison);return host.innerHTML;
  }
  function bind(C) {
    document.querySelectorAll('[data-rg-pair]').forEach(button=>button.onclick=()=>{C.state.activePair=button.dataset.rgPair.split('/');C.save();if(C.route!=='rates')C.go('#rates');C.render();});
    document.querySelectorAll('[data-rg-range]').forEach(button=>button.onclick=()=>{range=Number(button.dataset.rgRange);C.render();document.querySelector(`[data-rg-range="${range}"]`)?.focus({preventScroll:true});});
    const edit=document.getElementById('rg-edit-rate');if(edit)edit.onclick=()=>{const input=document.querySelector('#pair-form [name="value"]');input?.scrollIntoView({behavior:'smooth',block:'center'});input?.focus({preventScroll:true});};
  }
  window.GuardPages=window.GuardPages||{};window.GuardPages.rates={decorate,bind};
})();

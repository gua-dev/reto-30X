(function (root) {
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  const BUILTIN_CRITERIA=[
    {id:'duplicate',name:'Sin cobros duplicados',action:'blocked',label:'Referencia y proveedor únicos'},
    {id:'account',name:'Los datos bancarios coinciden con una cuenta registrada',action:'review',label:'Cuenta de pago registrada'},
    {id:'budget',name:'Presupuesto suficiente',action:'blocked',label:'Presupuesto del periodo'},
    {id:'vendor',name:'Proveedor autorizado',action:'review',label:'Lista autorizada de proveedores'},
    {id:'currency',name:'Moneda admitida',action:'review',label:'Monedas acordadas con el proveedor'},
    {id:'limit',name:'Total dentro del límite automático',action:'review',label:'Límite por factura, incluidos impuestos'},
    {id:'contract',name:'Concepto acorde con el servicio',action:'review',label:'Servicio acordado y referencia de cobro'},
    {id:'confidence',name:'Confianza de revisión suficiente',action:'review',label:'Umbral de revisión sintética'}
  ].map(c=>({...c,kind:c.id,enabled:true}));
  const BASE_RULES = { version: 1, limit: 50000, budget: 250000, priorSpent: 50000, confidence: 85, allowed: ['cloud', 'pixel', 'andes', 'lex'], criteria:clone(BUILTIN_CRITERIA) };
  const INVOICES = [
    { id: 'INV-01', vendor: 'CloudNova Infrastructure', legal: 'CloudNova Infrastructure LLC', key: 'cloud', initials: 'CN', country: 'Estados Unidos', currency: 'USD', original: 420, cents: 42000, subtotal: 420, tax: 0, reference: 'CN-2026-101', concept: 'Infraestructura cloud · octubre 2026', contract: 'Alojamiento cloud y mantenimiento de infraestructura.', format: 'PDF corporativo', due: '2026-10-20', confidence: 98, category: 'Cloud e infraestructura', type: 'normal' },
    { id: 'INV-02', vendor: 'Estudio Pixel Sur', legal: 'Estudio Pixel Sur S.A.S.', key: 'pixel', initials: 'PS', country: 'Colombia', currency: 'COP', original: 1680000, cents: 40000, subtotal: 1680000, tax: 0, reference: 'PS-2026-044', concept: 'Diseño de interfaz · octubre 2026', contract: 'Diseño de interfaces y comunicación visual.', format: 'Cuenta de cobro', due: '2026-10-21', confidence: 97, category: 'Diseño y marketing', type: 'normal' },
    { id: 'INV-03', vendor: 'AndesSoft Devs', legal: 'AndesSoft Devs LLC', key: 'andes', initials: 'AD', country: 'México', currency: 'USD', original: 533.6, cents: 53360, subtotal: 460, tax: 73.6, reference: 'AS-2026-082', concept: 'Desarrollo de software · sprint 08', contract: 'Desarrollo y mantenimiento de software.', format: 'Factura con impuestos', due: '2026-10-22', confidence: 96, category: 'Desarrollo de software', type: 'tax' },
    { id: 'INV-04', vendor: 'Carlos Méndez', legal: 'Carlos Méndez · Refrigeración y Eléctricos', key: 'carlos', initials: 'CM', country: 'Venezuela', currency: 'USD', original: 145, cents: 14500, subtotal: 145, tax: 0, reference: 'CM-001', concept: 'Mantenimiento de aire acondicionado', contract: 'No hay un acuerdo registrado para este proveedor.', format: 'Recibo manuscrito', due: '2026-10-22', confidence: 92, category: 'Mantenimiento', type: 'new' },
    { id: 'INV-05', vendor: 'CloudNova Infrastructure', legal: 'CloudNova Infrastructure LLC', key: 'cloud', initials: 'CN', country: 'Estados Unidos', currency: 'USD', original: 420, cents: 42000, subtotal: 420, tax: 0, reference: 'CN-2026-101', concept: 'Infraestructura cloud · octubre 2026', contract: 'Alojamiento cloud y mantenimiento de infraestructura.', format: 'Ticket térmico', due: '2026-10-20', confidence: 98, category: 'Cloud e infraestructura', type: 'duplicate', duplicateOf: 'INV-01' },
    { id: 'INV-06', vendor: 'Estudio Pixel Sur', legal: 'Estudio Pixel Sur S.A.S.', key: 'pixel', initials: 'PS', country: 'Colombia', currency: 'USD', original: 390, cents: 39000, subtotal: 390, tax: 0, reference: 'PS-2026-045', concept: 'Auditoría forense de servidores Linux', contract: 'Diseño de interfaces y comunicación visual.', format: 'PDF corporativo', due: '2026-10-23', confidence: 94, category: 'Por confirmar', type: 'mismatch' },
    { id: 'INV-07', vendor: 'AndesSoft Devs', legal: 'AndesSoft Devs LLC', key: 'andes', initials: 'AD', country: 'México', currency: 'USD', original: 450, cents: 45000, subtotal: 450, tax: 0, reference: 'AS-CHAT-083', concept: 'Solicitud de pago con cambio de cuenta', contract: 'Desarrollo y mantenimiento de software. Cuenta autorizada terminada en 2048.', format: 'Mensaje de chat', due: '2026-10-19', confidence: 95, category: 'Desarrollo de software', type: 'account' },
    { id: 'INV-08', vendor: 'LexGlobal Advisory', legal: 'LexGlobal Advisory Partners', key: 'lex', initials: 'LA', country: 'Estados Unidos', currency: 'USD', original: 1800, cents: 180000, subtotal: 1800, tax: 0, reference: 'LG-2026-019', concept: 'Asesoría corporativa · octubre 2026', contract: 'Asesoría administrativa y corporativa.', format: 'PDF corporativo', due: '2026-10-26', confidence: 97, category: 'Legal y administración', type: 'budget' }
  ];

  const BASE_PROVIDERS = {version:1, items:Object.fromEntries(['cloud','pixel','andes','carlos','lex'].map(key=>{
    const i=INVOICES.find(i=>i.key===key);
    return [key,{key,name:i.vendor,legal:i.legal,country:i.country,service:key==='carlos'?'':i.contract,category:i.category,currencies:key==='pixel'?['COP','USD']:['USD'],paymentRef:key==='carlos'?'':key==='andes'?'Cuenta sintética • 2048':'Referencia sintética • '+key,status:key==='carlos'?'unregistered':'authorized'}];
  }))};
  const BASE_FX={version:1,mode:'demo',rates:Object.fromEntries(Object.entries({USD:1,COP:4200,MXN:20,VES:40,ARS:1000}).map(([currency,value])=>[currency,{value,date:'2026-10-01',source:'Referencia de ejemplo',origin:'demo'}]))};
  const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const accountKey=a=>[a?.bank,a?.identifier,a?.currency,a?.holder].map(v=>String(v||'').trim().toLowerCase().replace(/[\s-]/g,'')).join('|');
  const bankMatches=(invoice,provider)=>!invoice.paymentDetails||(provider?.bankAccounts||[]).some(a=>accountKey(a)===accountKey(invoice.paymentDetails));
  for(const p of Object.values(BASE_PROVIDERS.items)){p.bankAccounts=p.paymentRef?[{id:'bank-'+p.key,bank:'Banco de ejemplo',holder:p.legal,country:p.country,currency:p.currencies[0],identifier:p.key==='andes'?'SYN-2048':'SYN-'+p.key.toUpperCase()+'-1001'}]:[];p.notes=[];}
  for(const i of INVOICES){i.origin=i.id==='INV-07'?'Chat':i.id==='INV-04'?'Carga manual':['INV-03','INV-08'].includes(i.id)?'Integración':'Correo';i.paymentDetails=i.type==='account'?{...clone(BASE_PROVIDERS.items.andes.bankAccounts[0]),id:undefined,identifier:'SYN-7312'}:null;}
  function money(cents) { return cents===null||!Number.isFinite(cents)?'Sin conversión':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100); }
  function rateValid(rate,mode,day=today()) {return !!rate&&Number.isFinite(rate.value)&&rate.value>0&&!!rate.source?.trim()&&(mode==='demo'&&rate.origin==='demo'||rate.date===day);}
  function fxFor(invoice,fx=BASE_FX,day=today()) {
    const rate=invoice.currency==='USD'?{value:1,date:fx.mode==='demo'?'2026-10-01':day,source:'Moneda base USD',origin:fx.mode==='demo'?'demo':'base'}:fx.rates[invoice.currency];
    const valid=rateValid(rate,fx.mode,day);
    return {currency:invoice.currency,localPerUsd:rate?.value??null,date:rate?.date??null,source:rate?.source??'Sin fuente disponible',origin:rate?.origin??'missing',version:fx.version,valid,usdCents:valid?Math.round(invoice.original/rate.value*100):null};
  }
  function criterionValue(invoice,field){return field.startsWith('custom:')?invoice.customFields?.[field.slice(7)]??'':invoice[field]??'';}
  function criterionCheck(invoice,c){
    if(c.scopeCurrency&&c.scopeCurrency!==invoice.currency)return {label:c.name,pass:true,detail:`No aplica: criterio limitado a ${c.scopeCurrency}. Factura en ${invoice.currency}.`,criterionId:c.id,action:c.action};
    const value=criterionValue(invoice,c.field),actual=String(value).trim(),expected=String(c.value??'').trim();
    const pass=c.operator==='present'?actual.length>0:c.operator==='equals'?actual.toLowerCase()===expected.toLowerCase()&&!!actual:c.operator==='contains'?actual.toLowerCase().includes(expected.toLowerCase())&&!!actual:c.operator==='min'?actual!==''&&Number.isFinite(Number(actual))&&Number(actual)>=Number(expected):c.operator==='max'?actual!==''&&Number.isFinite(Number(actual))&&Number(actual)<=Number(expected):false;
    const operators={present:'debe estar presente',equals:'debe ser igual a',contains:'debe contener',min:'debe ser mayor o igual a',max:'debe ser menor o igual a'};
    return {label:c.name,pass,detail:`${c.label} ${operators[c.operator]}${c.operator==='present'?'':` «${expected}»`}. Valor encontrado: ${actual||'Sin dato'}. Si no cumple: ${c.action==='blocked'?'Frenar':'Revisión humana'}.`,criterionId:c.id,action:c.action};
  }
  function validateCriterion(c){
    if(c.kind){return BUILTIN_CRITERIA.some(b=>b.kind===c.kind)&&c.name?.trim()&&['review','blocked'].includes(c.action)?'':'Completa el nombre y la consecuencia del criterio.';}
    if(!c.name?.trim()||!c.field||!c.label?.trim())return 'Escribe el nombre del criterio y el dato que se evaluará.';
    if(!['present','equals','contains','min','max'].includes(c.operator)||!['review','blocked'].includes(c.action))return 'Selecciona una condición y una consecuencia válidas.';
    if(c.operator!=='present'&&!String(c.value??'').trim())return 'Indica el valor esperado para esta condición.';
    if(['min','max'].includes(c.operator)&&!Number.isFinite(Number(c.value)))return 'Esta condición necesita un valor numérico.';
    return '';
  }
  INVOICES.forEach(i=>{i.issueDate=i.issueDate||"2026-10-01";});
  function sameInvoice(a,b){return a.key===b.key&&!!a.reference&&!!a.issueDate&&!!a.due&&String(a.reference).trim().toLowerCase()===String(b.reference||"" ).trim().toLowerCase()&&a.issueDate===b.issueDate&&a.due===b.due;}
  function evaluate(invoice,rules,available,providers=BASE_PROVIDERS,fx=BASE_FX,day=today()) {
    const provider=providers.items[invoice.key], rate=fxFor(invoice,fx,day), cents=rate.usdCents;
    const authorized=provider?.status==='authorized'&&rules.allowed.includes(invoice.key);
    const contract=!!provider?.service?.trim()&&provider.category===invoice.category&&invoice.type!=='mismatch';
    const currency=!!provider?.currencies?.includes(invoice.currency);
    const checks=[
      {label:'Tasa disponible para la evaluación',pass:rate.valid,detail:rate.valid?`1 USD = ${rate.localPerUsd} ${invoice.currency} · ${rate.date} · ${rate.source}`:'Falta una tasa válida del día de evaluación. Consulta o carga una tasa.'},
      {label:'No es un cobro duplicado',pass:invoice.type!=='duplicate',detail:invoice.type==='duplicate'?`Mismo proveedor, número de factura, fecha de emisión y vencimiento que ${invoice.duplicateOf||'otra factura'}.`:'Sin coincidencia exacta en este set.'},
      {label:'Proveedor autorizado',pass:authorized,detail:`Estado: ${provider?.status==='excluded'?'Excluido':authorized?'Autorizado':'Sin registrar'} · lista v${providers.version}.`},
      {label:'Moneda admitida por el proveedor',pass:currency,detail:`Monedas acordadas: ${provider?.currencies.join(', ')||'Sin registrar'}.`},
      {label:'Total dentro del límite automático',pass:rate.valid&&cents<=rules.limit,detail:`${money(cents)} frente a ${money(rules.limit)} USD.`},
      {label:'Presupuesto suficiente',pass:rate.valid&&cents<=available,detail:`${money(available)} USD disponibles al evaluar.`},
      {label:'Datos de cobro sin cambios pendientes',pass:invoice.type!=='account'&&!!provider?.paymentRef,detail:invoice.type==='account'?'Se solicita una cuenta distinta a la autorizada.':provider?.paymentRef||'Falta la referencia de cobro.'},
      {label:'Concepto acorde con el acuerdo',pass:contract,detail:contract?provider.service:'El concepto no coincide con el servicio registrado o falta un acuerdo.'},
      {label:invoice.added?'Datos introducidos manualmente':'Confianza de la revisión suficiente',pass:invoice.added||invoice.confidence>=rules.confidence,detail:invoice.added?'La persona confirmó los campos al registrar la factura. Sin OCR ni medición de confianza.':`${invoice.confidence}% en el caso sintético; umbral ${rules.confidence}%.`}
    ];
    const byKind={duplicate:checks[1],vendor:checks[2],currency:checks[3],limit:checks[4],budget:checks[5],account:{...checks[6],pass:bankMatches(invoice,provider),detail:bankMatches(invoice,provider)?'Los datos coinciden con una cuenta registrada o no se solicita una cuenta distinta.':'Los datos bancarios de la factura no coinciden con los registrados. Aprobar añadirá esta cuenta a la ficha del proveedor.'},contract:{...checks[7],pass:contract&&!!provider?.paymentRef},confidence:checks[8]};
    const applied=(rules.criteria||BUILTIN_CRITERIA).filter(c=>c.enabled!==false).map(c=>c.scopeCurrency&&c.scopeCurrency!==invoice.currency?{label:c.name,pass:true,detail:`No aplica: criterio limitado a ${c.scopeCurrency}. Factura en ${invoice.currency}.`,criterionId:c.id,action:c.action}:c.kind?{...byKind[c.kind],label:c.name,criterionId:c.id,action:c.action}:criterionCheck(invoice,c));
    for(const c of applied){const rule=(rules.criteria||BUILTIN_CRITERIA).find(r=>r.id===c.criterionId);if(!rate.valid&&['limit','budget'].includes(rule?.kind)){c.pending=true;c.detail='Pendiente de una tasa válida para calcular el importe.';}}
    const failed=applied.find(c=>!c.pass&&!c.pending&&c.action==='blocked')||applied.find(c=>!c.pass&&!c.pending);
    const evaluatedChecks=[checks[0],...applied];
    let status='approved',code='within',reason='La factura cumple todos los criterios activos de la empresa y dispone de una tasa válida.';
    if(provider?.status==='excluded'){status='blocked';code='excluded';reason='El proveedor está excluido. Reincorpóralo explícitamente antes de autorizar nuevas facturas.';}
    else if(failed?.action==='blocked'){status='blocked';code=(rules.criteria||BUILTIN_CRITERIA).find(c=>c.id===failed.criterionId)?.kind||'criterion';reason=`No cumple «${failed.label}». ${failed.detail}`;}
    else if(!rate.valid){status='review';code='fx';reason='Falta una tasa válida del día de evaluación. Completa la conversión antes de autorizar esta factura.';}
    else if(failed){status=failed.action;code=(rules.criteria||BUILTIN_CRITERIA).find(c=>c.id===failed.criterionId)?.kind||'criterion';reason=`No cumple «${failed.label}». ${failed.detail}`;}
    return {invoiceId:invoice.id,status,code,reason,checks:evaluatedChecks,availableBefore:available,rulesSnapshot:clone(rules),invoiceDataSnapshot:{reference:invoice.reference,concept:invoice.concept,currency:invoice.currency,original:invoice.original,due:invoice.due,country:invoice.country,customFields:clone(invoice.customFields||{})},providerSnapshot:{version:providers.version,...clone(provider||{status:'unregistered'})},fxSnapshot:rate,evaluatedAt:new Date().toISOString(),evaluationDay:fx.mode==='demo'?'2026-10-01':day,source:'Evaluación local de datos sintéticos',human:false,actor:'Agente de demostración'};
  }
  const reserved=r=>r?.status==='approved'?(r.fxSnapshot?.usdCents||0):0;
  function evaluateBatch(rules,humanDecisions={},providers=BASE_PROVIDERS,fx=BASE_FX,day=today()) {
    let available=rules.budget-rules.priorSpent-Object.values(humanDecisions).reduce((sum,r)=>sum+reserved(r),0);
    const results={};
    for(const i of INVOICES){results[i.id]=humanDecisions[i.id]?clone(humanDecisions[i.id]):evaluate(i,rules,available,providers,fx,day);if(!humanDecisions[i.id])available-=reserved(results[i.id]);}
    return results;
  }
  function summarize(results,rules){const counts={approved:0,review:0,blocked:0,rejected:0,automatic:0,reserved:0};for(const r of Object.values(results)){counts[r.status]++;if(!r.human&&r.status!=='review')counts.automatic++;counts.reserved+=reserved(r);}return {...counts,available:rules.budget-rules.priorSpent-counts.reserved};}
  function validateRules(rules,humanDecisions={}) {
    for(const criterion of rules.criteria||[]){const error=validateCriterion(criterion);if(error)return error;}
    if(![rules.limit,rules.budget,rules.confidence].every(Number.isFinite))return 'Completa los campos con números válidos.';
    if(!Number.isInteger(rules.limit)||rules.limit<10000||rules.limit>200000)return 'El límite debe estar entre 100 y 2,000 USD.';
    if(!Number.isInteger(rules.budget)||rules.budget<100000||rules.budget>1000000)return 'El presupuesto debe estar entre 1,000 y 10,000 USD.';
    if(rules.confidence<50||rules.confidence>99)return 'El umbral debe estar entre 50% y 99%.';
    if(rules.budget<rules.priorSpent+Object.values(humanDecisions).reduce((s,r)=>s+reserved(r),0))return 'El presupuesto no puede ser inferior a los compromisos humanos y el consumo previo.';
    return '';
  }
  function humanDecision(invoice,results,rules,action,note='') {
    const old=results[invoice.id];if(!old||old.status!=='review')throw new Error('Esta factura ya no requiere aprobación. Revisa su estado actual.');
    if(!['approve','reject'].includes(action))throw new Error('Acción no válida.');
    const budget=summarize(results,rules).available;
    if(action==='approve'&&(!old.fxSnapshot.valid&&old.fxSnapshot.valid!==undefined||((rules.criteria||BUILTIN_CRITERIA).some(c=>c.kind==='budget'&&c.enabled!==false)&&old.fxSnapshot.usdCents>budget)||['fx','excluded'].includes(old.code)))throw new Error('La factura no puede aprobarse con el presupuesto, la tasa o los datos actuales. Reevalúa las facturas.');
    const comment=note.trim()||'Sin comentario adicional';
    return {...clone(old),status:action==='approve'?'approved':'rejected',code:action==='approve'?'human-approved':'human-rejected',human:true,actor:'María Torres · Finanzas',note:comment,cause:{action,exceptionCode:old.code,reason:old.reason},reason:`${action==='approve'?'Excepción aprobada':'Factura rechazada'} por María Torres. Causa revisada: ${old.reason} ${comment}`,originalDecision:clone(old),authorizationRules:clone(rules),availableAtAuthorization:budget,source:'Decisión humana simulada'};
  }
  function externalRates(data,version=1){
    if(data.result!=='success'||data.base_code!=='USD'||!Number.isFinite(data.time_last_update_unix)||!data.rates)throw new Error('La fuente devolvió una respuesta no válida.');
    const date=new Date(data.time_last_update_unix*1000).toISOString().slice(0,10);
    return {version,mode:'current',fetchedAt:new Date().toISOString(),rates:Object.fromEntries(Object.keys(data.rates).filter(c=>/^[A-Z]{3}$/.test(c)&&Number.isFinite(data.rates[c])&&data.rates[c]>0).map(c=>[c,{value:data.rates[c],date,source:'ExchangeRate-API · open.er-api.com',origin:'external'}]))};
  }
  const api={sameInvoice,clone,BUILTIN_CRITERIA,BASE_RULES,INVOICES,BASE_PROVIDERS,BASE_FX,today,money,rateValid,fxFor,evaluate,evaluateBatch,summarize,validateRules,humanDecision,externalRates,criterionValue,criterionCheck,validateCriterion,accountKey,bankMatches};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.GuardDomain=api;
})(typeof window!=='undefined'?window:globalThis);

(function(root){
  'use strict';
  const D=root.GuardDomain || (typeof require==='function'?require('./domain.js'):null);
  const baseEvaluate=D.evaluate, clone=D.clone;
  function migrate(state,invoices){
    if(state.projectsVersion)return false;
    const period=D.today().slice(0,7);
    state.projects=[
      {id:'alfa',name:'Experiencia digital',code:'ALFA',description:'Diseño y evolución del producto digital.',status:'active',budget:250000,period,currencies:['USD','COP'],listName:'Lista Alfa · Producto',version:1},
      {id:'beta',name:'Infraestructura regional',code:'BETA',description:'Operación cloud y desarrollo para Latinoamérica.',status:'active',budget:180000,period,currencies:['USD','MXN'],listName:'Lista Beta · Tecnología',version:1},
      {id:'gamma',name:'Operaciones corporativas',code:'GAMMA',description:'Servicios administrativos y operación de la empresa.',status:'active',budget:120000,period,currencies:['USD','VES'],listName:'Lista Gamma · Operaciones',version:1}
    ];
    state.providerProjects=[['alfa','pixel',50000],['alfa','andes',50000],['beta','andes',35000],['beta','cloud',50000],['gamma','lex',200000]].map(([projectId,providerKey,limit])=>{
      const v=state.providers.items[providerKey];return {projectId,providerKey,limit,service:v?.service||'',category:v?.category||'',currencies:clone(v?.currencies||['USD'])};
    });
    state.ruleGroups=[{id:'company',name:'Criterios generales',scope:'global',projectId:null,enabled:true,criteria:clone(state.rules.criteria)}];
    for(const p of state.projects)state.ruleGroups.push({id:'rules-'+p.id,name:'Criterios · '+p.code,scope:'project',projectId:p.id,enabled:true,criteria:[{id:'reference-'+p.id,name:'Referencia del proyecto presente',field:'projectReference',label:'Referencia de proyecto u orden de compra',operator:'present',value:'',action:'review',enabled:true}]});
    const assigned={'INV-01':'beta','INV-02':'alfa','INV-03':'beta','INV-05':'beta','INV-06':'alfa','INV-07':'alfa','INV-08':'gamma'};
    for(const i of invoices){i.receivedAt??=new Date().toISOString();if(!i.added&&!i.projectId&&assigned[i.id]){i.projectId=assigned[i.id];i.projectReference=state.projects.find(p=>p.id===i.projectId).code+'-OC-'+i.id.slice(-2);i.projectEvidence='Referencia '+i.projectReference+' en documento sintético';}}
    state.projectsVersion=1;state.navPrefs={open:{projects:true,inbox:false,rules:false,stats:false},pinned:['alfa','beta'],recent:['gamma'],hidden:[]};
    state.telemetry??=[];state.invoiceEdits??={};
    for(const i of invoices)state.invoiceEdits[i.id]=clone(i);
    return true;
  }
  function syncGroups(state){state.rules.criteria=state.ruleGroups.filter(g=>g.enabled!==false&&g.scope==='global').flatMap(g=>g.criteria.map(c=>({...c,groupName:g.name,groupId:g.id})));}
  function identify(invoice,state){
    const explicit=state.projects.find(p=>p.id===invoice.projectId);
    if(explicit&&invoice.projectConfirmed)return {project:explicit,evidence:invoice.projectEvidence||'Proyecto confirmado por Finanzas'};
    const ref=[invoice.projectReference,invoice.reference,invoice.concept].filter(Boolean).join(' ').toUpperCase();
    const matches=state.projects.filter(p=>new RegExp('(^|[^A-Z0-9])'+p.code.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=$|[^A-Z0-9])').test(ref));
    if(matches.length===1)return {project:matches[0],evidence:'Referencia '+matches[0].code+' encontrada en el documento'};
    return {project:null,evidence:matches.length>1?'El documento menciona varios proyectos.':'No se encontró una referencia única de proyecto.'};
  }
  function applied(state,p,providerKey){
    const groups=state.ruleGroups.filter(g=>g.enabled!==false&&(g.scope==='global'||g.projectId===p?.id));
    const criteria=groups.flatMap(g=>g.criteria.filter(c=>c.enabled!==false).map(c=>({...c,id:g.id+':'+c.id,scope:g.scope==='global'?'Empresa':p?.name,groupName:g.name})));
    return {groups,criteria,agreement:state.providerProjects.find(a=>a.projectId===p?.id&&a.providerKey===providerKey)};
  }
  function invoiceProject(state,i){return state.results[i.id]?.projectSnapshot?.id||i.projectId||identify(i,state).project?.id||null;}
  function usage(state,invoices,id){
    const p=state.projects.find(p=>p.id===id),rows=invoices.filter(i=>invoiceProject(state,i)===id),results=rows.map(i=>state.results[i.id]).filter(Boolean);
    const paid=results.filter(r=>r.status==='approved').reduce((n,r)=>n+(r.fxSnapshot?.usdCents||0),0),pending=results.filter(r=>r.status==='review').reduce((n,r)=>n+(r.fxSnapshot?.usdCents||0),0);
    return {paid,pending,budget:p?.budget||0,available:(p?.budget||0)-paid,count:rows.length,automatic:results.filter(r=>!r.human&&r.status!=='review').length,review:results.filter(r=>r.status==='review').length};
  }
  function evaluate(state,invoices,invoice,opts={}){
    const {project:p,evidence}=identify(invoice,state),cfg=applied(state,p,invoice.key),rules={...clone(state.rules),criteria:cfg.criteria};
    const available=opts.available??D.summarize(state.results,state.rules).available;
    const result=baseEvaluate(invoice,rules,available,opts.providers||state.providers,opts.fx||state.fx);
    result.projectSnapshot=p?clone(p):null;result.assignmentEvidence=evidence;result.ruleGroupsSnapshot=clone(cfg.groups);result.agreementSnapshot=cfg.agreement?clone(cfg.agreement):null;
    const check=(label,pass,detail,action='review',id='project')=>({label,pass,detail,action,criterionId:id,scope:p?.name||'Proyecto'});
    const checks=[check('Proyecto identificado',!!p,evidence)];
    if(p){
      const projectAvailable=opts.projectAvailable??usage(state,invoices,p.id).available;
      result.projectAvailableBefore=projectAvailable;
      checks.push(check('Proyecto activo',p.status==='active',p.status==='active'?'El proyecto admite nuevas facturas.':'El proyecto está archivado. Reactívalo para nuevas evaluaciones.'));
      checks.push(check('Proveedor en la lista del proyecto',!!cfg.agreement,'Lista aplicada: '+p.listName));
      checks.push(check('Moneda admitida por el proyecto',p.currencies.includes(invoice.currency),'Monedas: '+p.currencies.join(', ')));
      checks.push({...check('Presupuesto del proyecto suficiente',result.fxSnapshot.valid&&result.fxSnapshot.usdCents<=projectAvailable,`${D.money(projectAvailable)} USD disponibles de ${D.money(p.budget)}.`, 'blocked','project-budget'),pending:!result.fxSnapshot.valid});
      if(cfg.agreement){const a=cfg.agreement;
        checks.push(check('Moneda acordada para este proyecto',a.currencies.includes(invoice.currency),'Monedas del acuerdo: '+a.currencies.join(', ')));
        checks.push({...check('Importe dentro del acuerdo del proyecto',result.fxSnapshot.valid&&result.fxSnapshot.usdCents<=a.limit,'Límite acordado: '+D.money(a.limit)+' USD.','review','project-limit'),pending:!result.fxSnapshot.valid});
        checks.push(check('Servicio acordado en el proyecto',!!a.service.trim()&&a.category===invoice.category&&invoice.type!=='mismatch',a.service||'Falta registrar el servicio.'));
      }
    }
    result.checks=[...checks,...result.checks];
    const failures=result.checks.filter(c=>!c.pass&&!c.pending),blocked=failures.find(c=>c.action==='blocked');
    if(blocked){result.status='blocked';result.code=blocked.criterionId?.startsWith('project')?'project':'criterion';result.reason='No cumple «'+blocked.label+'». '+blocked.detail;}
    else if(result.code!=='excluded'&&failures.length){result.status='review';result.code=checks.some(c=>!c.pass)?'project':result.code;result.reason='No cumple «'+failures[0].label+'». '+failures[0].detail;}
    else if(result.status==='approved'){result.reason='Cumple todos los criterios de empresa, proyecto y acuerdo del proveedor.';}
    result.invoiceDataSnapshot.projectReference=invoice.projectReference||'';result.invoiceDataSnapshot.projectId=p?.id||null;
    return result;
  }
  function batch(state,invoices){
    const fixed={...state.humanDecisions,...state.paidInvoices};
    let available=state.rules.budget-state.rules.priorSpent-Object.values(fixed).filter(r=>r.status==='approved').reduce((n,r)=>n+(r.fxSnapshot?.usdCents||0),0);
    const budgets=Object.fromEntries(state.projects.map(p=>[p.id,p.budget]));
    for(const i of invoices){const r=fixed[i.id];if(r?.status==='approved'){const id=r.projectSnapshot?.id||i.projectId;if(id in budgets)budgets[id]-=r.fxSnapshot?.usdCents||0;}}
    const results={};
    for(const i of invoices){if(fixed[i.id]){results[i.id]=clone(fixed[i.id]);continue;}const p=identify(i,state).project;
      const r=evaluate(state,invoices,i,{available,projectAvailable:p?budgets[p.id]:0});results[i.id]=r;
      if(p){i.projectId=p.id;i.projectEvidence=r.assignmentEvidence;}
      if(r.status==='approved'){available-=r.fxSnapshot.usdCents;if(p)budgets[p.id]-=r.fxSnapshot.usdCents;}
    }return results;
  }
  function metrics(state,invoices,id='all',period='30'){
    const days=Number(period)||30,cutoff=Date.now()-days*86400000,rows=invoices.filter(i=>(id==='all'||invoiceProject(state,i)===id)&&new Date(i.receivedAt||state.results[i.id]?.evaluatedAt||Date.now()).getTime()>=cutoff),rs=rows.map(i=>state.results[i.id]).filter(Boolean);
    const sum=status=>rs.filter(r=>status.includes(r.status)).reduce((n,r)=>n+(r.fxSnapshot?.usdCents||0),0),budget=id==='all'?state.rules.budget:state.projects.find(p=>p.id===id)?.budget||0;
    const paid=sum(['approved']),pending=sum(['review']),automatic=rs.filter(r=>!r.human&&r.status!=='review').length;
    const grouping=fn=>Object.values(rows.reduce((a,i)=>{const name=fn(i);a[name]??={name,count:0,amount:0};a[name].count++;a[name].amount+=state.results[i.id]?.fxSnapshot?.usdCents||0;return a;},{}));
    const factor=id==='all'?1:id==='alfa'?.42:id==='beta'?.36:.22;
    const series=Array.from({length:days===7?7:days===90?12:15},(_,n)=>({label:days===90?'S'+(n+1):String(n+1),paid:Math.round((27000+Math.sin(n*1.7)*14000+n*1000)*factor),count:Math.round((28+Math.sin(n*.9)*10+n)*factor),latency:Math.round(1280+Math.sin(n*1.4)*300)}));
    return {count:rows.length,paidCount:rs.filter(r=>r.status==='approved').length,review:rs.filter(r=>r.status==='review').length,rejected:rs.filter(r=>['blocked','rejected'].includes(r.status)).length,automatic,paid,pending,budget,available:budget-(id==='all'?state.rules.priorSpent:0)-paid,automation:rows.length?Math.round(100*automatic/rows.length):0,byCurrency:grouping(i=>i.currency),byProvider:grouping(i=>i.vendor),series,technical:{avgMs:1420,p95Ms:2180,jevMs:118,throughput:42,errorRate:.8,calls:Math.round(days*31*factor),tokens:Math.round(days*36400*factor),costUsd:Number((days*.72*factor).toFixed(2)),manualMinutes:8,savedHours:Number((days*31*factor*8*.78/60).toFixed(1))},illustrative:true};
  }
  const api={migrate,syncGroups,identify,applied,evaluate,batch,invoiceProject,projectUsage:usage,metrics};root.GuardProjects=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

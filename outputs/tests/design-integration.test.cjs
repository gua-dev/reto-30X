const assert=require('node:assert/strict'),D=require('../assets/domain.js'),P=require('../assets/projects-domain.js');
function setup(){const invoices=D.clone(D.INVOICES),state={rules:D.clone(D.BASE_RULES),providers:D.clone(D.BASE_PROVIDERS),fx:D.clone(D.BASE_FX),results:{},humanDecisions:{},paidInvoices:{},events:[]};P.migrate(state,invoices);P.syncGroups(state);state.results=P.batch(state,invoices);return {state,invoices};}
{
const {state,invoices}=setup(),i=invoices[2],r=P.evaluate(state,invoices,i),eligible=r.checks.filter(P.canException);assert(eligible.length>=2);state.invoiceExceptions={[i.id]:eligible.map(c=>({key:c.exceptionKey,label:c.label,signature:P.exceptionSignature(state,i),actor:'Finanzas'}))};assert.equal(P.evaluate(state,invoices,i).status,'review');assert.equal(P.evaluate(state,invoices,i,{allowAuthorizedPayment:true}).status,'approved');i.original++;assert.notEqual(P.evaluate(state,invoices,i,{allowAuthorizedPayment:true}).status,'approved');
}
assert.equal(P.canException({label:'Servicio autorizado',criterionId:'vendor',action:'review',pass:false}),false);
{
const {state,invoices}=setup(),i=invoices[4];assert.equal(P.evaluate(state,invoices,i).status,'blocked');i.issueDate='2026-11-01';i.due='2026-11-20';assert(P.evaluate(state,invoices,i).checks.find(c=>/duplicados/.test(c.label)).pass);i.issueDate='';assert(P.evaluate(state,invoices,i).checks.find(c=>/duplicados/.test(c.label)).pass);
}
{
const {state,invoices}=setup(),i=invoices[2],r=P.evaluate(state,invoices,i);state.invoiceExceptions={[i.id]:r.checks.filter(P.canException).map(c=>({key:c.exceptionKey,signature:P.exceptionSignature(state,i)}))};state.projects.find(p=>p.id==='beta').budget=100;assert.equal(P.evaluate(state,invoices,i,{allowAuthorizedPayment:true}).status,'blocked');
}
console.log('PASS scoped exceptions, explicit payment, changed-data invalidation, immutable eligibility, recurring invoice dates, budget precedence');


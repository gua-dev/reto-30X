const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.md':'text/plain; charset=utf-8','.json':'application/json'};
const server=http.createServer((req,res)=>{
  let route;try{route=decodeURIComponent(req.url.split('?')[0]);}catch{res.writeHead(400);return res.end('Bad request');}
  const file=path.resolve(root,'.'+(route==='/'?'/index.html':route));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end('Forbidden');}
  fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);});
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?'El puerto 4173 está ocupado. Cierra el servidor anterior o abre http://127.0.0.1:4173.':error.message);process.exit(1);});
const port=Number(process.env.PORT)||4173;
server.listen(port,'127.0.0.1',()=>console.log(`Blinka Guard: http://127.0.0.1:${port} · Ctrl+C para detener`));

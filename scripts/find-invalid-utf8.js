const fs = require('fs');
const path = require('path');
function walk(dir){
  if(!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir,{withFileTypes:true});
  for(const e of entries){
    const p = path.join(dir,e.name);
    if(e.isDirectory()) walk(p);
    else checkFile(p);
  }
}
function checkFile(p){
  const ext = path.extname(p).toLowerCase();
  const relevant = ['.ts','.tsx','.js','.jsx','.css','.scss','.html','.md','.json','.svg','.txt','.tsx','.jsx'];
  if(!relevant.includes(ext)) return;
  try{const b = fs.readFileSync(p); const s = b.toString('utf8'); if(s.includes('\uFFFD')) console.log('INVALID UTF8 (contains REPLACEMENT CHAR):', p);} catch(e){ console.error('ERR',p,e.message) }}
['app','components','provider','lib','public'].forEach(d=>walk(d));
console.log('scan finished');

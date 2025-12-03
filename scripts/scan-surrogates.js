const fs = require('fs');
const path = require('path');

function walk(dir){
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (!p.includes('node_modules')) {
      checkFile(p);
    }
  }
}

function checkFile(p){
  const ext = path.extname(p).toLowerCase();
  const relevant = ['.ts','.tsx','.js','.jsx','.css','.scss','.html','.md','.json','.svg','.txt'];
  if (!relevant.includes(ext)) return;
  let s;
  try { s = fs.readFileSync(p,'utf8'); }
  catch(e){ console.error('ERR', p, e.message); return; }
  // find unpaired surrogates
  for(let i=0;i<s.length;i++){
    const code = s.charCodeAt(i);
    if (code >= 0xDC00 && code <= 0xDFFF) { // low surrogate without high
      const prev = s.charCodeAt(i-1);
      if (!(prev >= 0xD800 && prev <= 0xDBFF)) {
        console.log('Unpaired low surrogate in', p, 'index', i, 'char', s.slice(i-2,i+3));
        return;
      }
    }
    if (code >= 0xD800 && code <= 0xDBFF) { // high surrogate without following low
      const next = s.charCodeAt(i+1);
      if (!(next >= 0xDC00 && next <= 0xDFFF)) {
        console.log('Unpaired high surrogate in', p, 'index', i, 'char', s.slice(i-2,i+3));
        return;
      }
    }
  }
}

['app','components','provider','lib'].forEach(dir => walk(dir));
console.log('done scanning');

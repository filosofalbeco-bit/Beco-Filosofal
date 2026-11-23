// Lista os tokens de todas as mesas sem alterar nenhum arquivo
const fs     = require('fs');
const crypto = require('crypto');

// Lê o .env automaticamente
let secret = 'beco-filosofal-2024';
let total  = 20;
let site   = 'http://localhost';

if (fs.existsSync('.env')) {
  const env = fs.readFileSync('.env', 'utf8');
  const m1 = env.match(/^MESA_SECRET=(.+)$/m);
  const m2 = env.match(/^NUM_MESAS=(\d+)$/m);
  const m3 = env.match(/^SITE_URL=(.+)$/m);
  if (m1) secret = m1[1].trim();
  if (m2) total  = parseInt(m2[1].trim(), 10);
  if (m3) site   = m3[1].trim().replace(/\/$/, '');
}

function gerarToken(mesa) {
  return crypto.createHmac('sha256', secret)
    .update(`mesa:${mesa}`)
    .digest('hex')
    .substring(0, 14);
}

console.log('\n🪄 BECO FILOSOFAL — TOKENS DAS MESAS');
console.log('─'.repeat(52));
console.log('Segredo usado:', secret);
console.log('─'.repeat(52));
for (let i = 1; i <= total; i++) {
  const token = gerarToken(i);
  console.log(`Mesa ${String(i).padStart(2,'0')}  →  ${site}/?mesa=${token}`);
}
console.log('─'.repeat(52));
console.log('Para mudar o segredo, edite MESA_SECRET no .env\n');

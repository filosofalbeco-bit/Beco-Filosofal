// Gera js/config.js com as variáveis de ambiente da Vercel
const fs     = require('fs');
const crypto = require('crypto');

const url    = process.env.SUPABASE_URL      || '';
const key    = process.env.SUPABASE_ANON_KEY || '';
const pix    = process.env.PIX_CHAVE         || '';
const nome   = process.env.PIX_NOME          || 'Beco FilosoFal Burguer';
const wpp    = process.env.WPP_NUM           || '';
const senha  = process.env.ADMIN_SENHA       || 'filosofal2024';
const secret = process.env.MESA_SECRET       || 'beco-filosofal-2024';
const total  = parseInt(process.env.NUM_MESAS || '20', 10);
const MAX_MESAS = 50; // tokens gerados para até 50 mesas

// Gera token único e imprevisível para cada mesa usando HMAC-SHA256
function gerarToken(mesa) {
  return crypto.createHmac('sha256', secret)
    .update(`mesa:${mesa}`)
    .digest('hex')
    .substring(0, 14);
}

// Gera tokens para até MAX_MESAS (50) — admin controla quantas exibir sem redeployr
const tokens = {};
for (let i = 1; i <= MAX_MESAS; i++) {
  tokens[gerarToken(i)] = String(i);
}

const conteudo = `window.SUPABASE_URL      = '${url}';
window.SUPABASE_ANON_KEY = '${key}';
window.PIX_CHAVE         = '${pix}';
window.PIX_NOME          = '${nome}';
window.WPP_NUM           = '${wpp}';
window.ADMIN_SENHA       = '${senha}';
window.MESAS_TOKENS      = ${JSON.stringify(tokens)};
window.NUM_MESAS_PADRAO  = ${total};
`;

fs.writeFileSync('js/config.js', conteudo);
console.log('✅ js/config.js gerado com sucesso');

// Exibe os tokens para o dono gerar os QR codes
console.log('\n📋 TOKENS DAS MESAS (use para gerar os QR codes):');
for (let i = 1; i <= total; i++) {
  const token = gerarToken(i);
  console.log(`  Mesa ${String(i).padStart(2,'0')}: /?mesa=${token}`);
}

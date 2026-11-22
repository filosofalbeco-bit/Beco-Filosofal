// Gera js/config.js com as variáveis de ambiente da Vercel
const fs = require('fs');

const url   = process.env.SUPABASE_URL      || '';
const key   = process.env.SUPABASE_ANON_KEY || '';
const pix   = process.env.PIX_CHAVE         || '';
const nome  = process.env.PIX_NOME          || 'Beco FilosoFal Burguer';
const wpp   = process.env.WPP_NUM           || '';
const senha = process.env.ADMIN_SENHA       || 'filosofal2024';

const conteudo = `window.SUPABASE_URL      = '${url}';
window.SUPABASE_ANON_KEY = '${key}';
window.PIX_CHAVE         = '${pix}';
window.PIX_NOME          = '${nome}';
window.WPP_NUM           = '${wpp}';
window.ADMIN_SENHA       = '${senha}';
`;

fs.writeFileSync('js/config.js', conteudo);
console.log('✅ js/config.js gerado com sucesso');

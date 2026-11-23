// =====================================================
// ELDER WAND CURSOR
// =====================================================
const wand = document.getElementById('elder-wand');
const fxContainer = document.getElementById('magic-fx');
let mx = 0, my = 0, pmx = 0, pmy = 0;

document.addEventListener('mousemove', (e) => {
  pmx = mx; pmy = my;
  mx = e.clientX; my = e.clientY;

  // Angulo de rotação baseado na direção do movimento
  const dx = mx - pmx, dy = my - pmy;
  if (Math.abs(dx) + Math.abs(dy) > 0.5) {
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    wand.style.transform = `translate(-6px, -6px) rotate(${angle - 35}deg)`;
  }

  wand.style.left = mx + 'px';
  wand.style.top = my + 'px';
});

// =====================================================
// EFEITOS DE CLIQUE — VARINHA DAS VARINHAS
// =====================================================
const spells = [
  'Lumos Maxima!', 'Expecto Patronum!', 'Accio Burguer!',
  'Wingardium Leviosa!', 'Alohomora!', 'Expelliarmus!',
  'Stupefy!', 'Incendio!', 'Obliviate!', 'Finite Incantatem!',
  'Avada Kedavra!', 'Crucio!', 'Imperio!',
  'Nox!', 'Riddikulus!', 'Sectumsempra!', 'Episkey!',
  'Aguamenti!', 'Accio Batatas!', 'Accio Smash Fênix!'
];

const wandColors = ['#e8c96e', '#fffbe8', '#c9a84c', '#ffffff', '#d4af37'];
let clickCount = 0;

function mkSparks(x, y) {
  const n = 10 + Math.floor(Math.random() * 10);
  for (let i = 0; i < n; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    const sz = 2 + Math.random() * 5;
    const ang = Math.PI * 2 * i / n + (Math.random() - 0.5) * 0.7;
    const dist = 30 + Math.random() * 70;
    const col = wandColors[Math.floor(Math.random() * wandColors.length)];
    s.style.cssText = `
      left:${x}px; top:${y}px; width:${sz}px; height:${sz}px;
      background:${col}; box-shadow:0 0 ${sz*2}px ${col};
      --tx:${Math.cos(ang)*dist}px; --ty:${Math.sin(ang)*dist}px;
      animation-duration:${0.4+Math.random()*0.5}s;
    `;
    fxContainer.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }
}

function mkSpell(x, y) {
  const el = document.createElement('div');
  el.className = 'rune-fly';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.textContent = spells[Math.floor(Math.random() * spells.length)];
  fxContainer.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

function mkRing(x, y) {
  const el = document.createElement('div');
  el.className = 'glow-ring';
  const sz = 20 + Math.random() * 20;
  el.style.cssText = `left:${x}px; top:${y}px; width:${sz}px; height:${sz}px;`;
  fxContainer.appendChild(el);
  setTimeout(() => el.remove(), 700);
}

function mkHallows(x, y) {
  const el = document.createElement('div');
  el.className = 'death-hallows';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.textContent = '⚯͛';
  fxContainer.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

document.addEventListener('click', (e) => {
  const x = e.clientX, y = e.clientY;
  clickCount++;

  mkSparks(x, y);
  mkRing(x, y);
  mkSpell(x, y);

  // A cada 7 cliques: símbolo das Relíquias da Morte
  if (clickCount % 7 === 0) {
    mkHallows(x, y);
    // Flash suave dourado
    const fl = document.createElement('div');
    fl.style.cssText = `position:fixed;inset:0;background:rgba(201,168,76,0.06);pointer-events:none;z-index:9990;transition:opacity 0.4s;`;
    document.body.appendChild(fl);
    setTimeout(() => { fl.style.opacity = '0'; setTimeout(() => fl.remove(), 500); }, 50);
  }
});

// =====================================================
// STARS CANVAS
// =====================================================
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
let stars = [];

function initStars() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({length: 200}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5,
    a: Math.random(),
    speed: 0.003 + Math.random() * 0.008,
    phase: Math.random() * Math.PI * 2
  }));
}

function drawStars(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    const alpha = s.a * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,251,232,${alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

initStars();
requestAnimationFrame(drawStars);
window.addEventListener('resize', initStars);

// =====================================================
// MAPA DO MAROTO — REVELAR CARDÁPIO
// =====================================================
let mapaAberto = false;

function revelarMapa() {
  if (mapaAberto) return; // só revela uma vez
  mapaAberto = true;

  const scroll = document.getElementById('mapa-scroll');
  const btn = document.getElementById('mapa-btn');
  const label = document.getElementById('mapa-btn-label');

  // Efeito de varinha no botão
  const bRect = btn.getBoundingClientRect();
  const cx = bRect.left + bRect.width / 2;
  const cy = bRect.top + bRect.height / 2;
  mkSparks(cx, cy);
  mkSpell(cx, cy);
  mkHallows(cx, cy);

  // Sequência de sparkles ao longo da abertura
  let cnt = 0;
  const sparkInterval = setInterval(() => {
    mkSparks(cx + (Math.random()-0.5)*200, cy + cnt * 8);
    cnt++;
    if (cnt > 20) clearInterval(sparkInterval);
  }, 80);

  label.textContent = '✦ Travessuras em andamento... ✦';

  // Abre o pergaminho
  setTimeout(() => {
    label.textContent = '📜 O Mapa foi revelado! Escolha um feitiço.';
    scroll.classList.add('open');
    void scroll.offsetHeight;
    animarPassos();
    setTimeout(() => scroll.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
  }, 600);
}

function animarPassos() {
  const fp = document.getElementById('footprints');
  fp.innerHTML = '';
  const passos = ['👣','👣','👣','👣','👣','👣','👣','👣'];
  passos.forEach((p, i) => {
    const el = document.createElement('span');
    el.className = 'fp';
    el.textContent = p;
    el.style.animationDelay = (i * 0.15) + 's';
    fp.appendChild(el);
  });
}

// =====================================================
// ACCORDION DO CARDÁPIO — feitiços por categoria
// =====================================================
document.querySelectorAll('.scroll-cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const panelId = btn.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      // Fechar
      btn.setAttribute('aria-expanded', 'false');
      panel.classList.remove('open');
      panel.querySelectorAll('.scroll-item').forEach(item => item.classList.remove('revealed'));
    } else {
      // Abrir — efeito de faísca no botão
      const bRect = btn.getBoundingClientRect();
      mkSparks(bRect.left + bRect.width / 2, bRect.top + bRect.height / 2);

      btn.setAttribute('aria-expanded', 'true');
      panel.classList.add('open');
      void panel.offsetHeight; // força reflow

      // Revelar itens em cascata
      panel.querySelectorAll('.scroll-item').forEach((item, i) => {
        setTimeout(() => item.classList.add('revealed'), 150 + i * 250);
      });
    }
  });

  // Suporte a teclado (Enter/Espaço já funcionam em <button>)
  // Acessibilidade: foco visível garantido pelo :focus-visible no CSS
});

// =====================================================
// SCROLL REVEAL
// =====================================================
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// =====================================================
// SMOOTH SCROLL
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

/* =====================================================
   CARRINHO DE COMPRAS
   ===================================================== */
const cart = {}; // { id: { name, price, qty } }
const PIX_CONFIG = {
  chave: window.PIX_CHAVE || '11999999999',
  nome:  window.PIX_NOME  || 'Beco FilosoFal Burguer'
};
const WPP_NUM = window.WPP_NUM || '5531999999999';
const ZONAS = [
  { prefix: '36200', nome: 'Centro e bairros próximos', taxa: 5.00 },
  { prefix: '362',   nome: 'Barbacena (demais bairros)', taxa: 8.00 },
  { prefix: '363',   nome: 'Região ampliada',            taxa: 12.00 },
];

function changeQty(btn, delta) {
  const item = btn.closest('.scroll-item');
  if (!item || !item.dataset.id) return;
  const id   = item.dataset.id;
  const name = item.dataset.name;
  const price = parseFloat(item.dataset.price);
  const numEl = item.querySelector('.qty-num');
  let qty = parseInt(numEl.textContent) + delta;
  if (qty < 0) qty = 0;
  numEl.textContent = qty;
  if (qty === 0) {
    delete cart[id];
  } else {
    cart[id] = { name, price, qty };
  }
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const total = Object.values(cart).reduce((s, i) => s + i.qty, 0);
  const countEl = document.getElementById('cart-count');
  const btnEl   = document.getElementById('cart-btn');
  const lblEl   = document.getElementById('cart-label');
  countEl.textContent = total;
  if (total > 0) {
    btnEl.classList.add('visible');
    lblEl.textContent = total === 1 ? '1 item' : total + ' itens';
  } else {
    btnEl.classList.remove('visible');
  }
  renderCartItems();
  atualizarTotais();
}

function renderCartItems() {
  const container = document.getElementById('cart-items');
  const emptyEl   = document.getElementById('cart-empty');
  const delivEl   = document.getElementById('cart-delivery-section');
  const footerEl  = document.getElementById('cart-footer');
  const items = Object.entries(cart);
  if (items.length === 0) {
    emptyEl.style.display  = 'block';
    container.innerHTML    = '';
    delivEl.style.display  = 'none';
    footerEl.style.display = 'none';
    return;
  }
  emptyEl.style.display  = 'none';
  delivEl.style.display  = 'block';
  footerEl.style.display = 'block';
  // Modo mesa: ocultar opções de entrega/retirada, mostrar badge
  const optsRow = document.getElementById('delivery-opts-row');
  const mesaInfoEl = document.getElementById('mesa-info');
  const mesaNumEl  = document.getElementById('mesa-numero');
  if (mesaAtiva) {
    if (optsRow)    optsRow.style.display    = 'none';
    if (mesaInfoEl) mesaInfoEl.style.display = 'block';
    if (mesaNumEl)  mesaNumEl.textContent    = mesaAtiva;
    document.getElementById('cep-section').style.display = 'none';
    document.getElementById('frete-row').style.display   = 'none';
    freteVal = 0;
    // Mostrar botão encerrar conta e ocultar confirmar (na mesa, o confirmar envia pra cozinha)
    const btnConf = document.getElementById('btn-confirmar');
    const btnEnc = document.getElementById('btn-encerrar');
    if (btnConf) {
      btnConf.textContent = '🍳 Enviar para a Cozinha';
    }
    if (btnEnc) btnEnc.style.display = 'block';
    atualizarStatusEncerrar();
  }
  container.innerHTML = items.map(([id, it]) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${it.name}</div>
        <div class="cart-item-price">R$ ${it.price.toFixed(2).replace('.',',')}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeCartQty('${id}',-1)" aria-label="Remover um">−</button>
        <span class="qty-num">${it.qty}</span>
        <button class="qty-btn" onclick="changeCartQty('${id}',1)" aria-label="Adicionar um">+</button>
      </div>
      <div class="cart-item-total">R$ ${(it.price * it.qty).toFixed(2).replace('.',',')}</div>
    </div>
  `).join('');
  validarPedido();
}

function changeCartQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  // sincronizar com os botões no cardápio
  const itemEl = document.querySelector(`.scroll-item[data-id="${id}"]`);
  if (itemEl) {
    const numEl = itemEl.querySelector('.qty-num');
    if (numEl) numEl.textContent = cart[id] ? cart[id].qty : 0;
  }
  atualizarCarrinho();
}

let deliveryMode = 'entrega';
let freteVal = 0;
let mesaAtiva = null;

// Retorna o timestamp de início do "dia do restaurante" (5h da manhã).
// Se for antes das 5h, ainda é o turno do dia anterior.
function sessaoMesaInicio() {
  const INICIO_TURNO = 5; // hora em que começa o novo dia do restaurante
  const agora = new Date();
  const corte = new Date();
  corte.setHours(INICIO_TURNO, 0, 0, 0);
  if (agora < corte) corte.setDate(corte.getDate() - 1); // antes das 5h → dia anterior
  return corte.getTime();
}

// Detectar modo mesa via ?mesa=TOKEN na URL
(function detectarMesa() {
  try {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('mesa');
    const tokens = window.MESAS_TOKENS || {};
    const mesa = token && tokens[token] ? tokens[token] : null;
    if (mesa) {
      mesaAtiva = mesa;
      deliveryMode = 'mesa';
      // Iniciar sessão da mesa (cada cliente novo tem timestamp próprio)
      const sessKey = 'bf_sess_' + mesa;
      if (!localStorage.getItem(sessKey)) {
        localStorage.setItem(sessKey, String(Date.now()));
      }
      // Badge na nav
      const navBrand = document.querySelector('.nav-brand');
      if (navBrand) {
        const badge = document.createElement('span');
        badge.style.cssText = 'background:rgba(201,168,76,0.2);border:1px solid var(--gold-dark);border-radius:4px;padding:0.1rem 0.5rem;font-size:0.65rem;letter-spacing:0.08em;color:var(--gold);margin-left:0.5rem;';
        badge.textContent = 'Mesa ' + mesa;
        navBrand.appendChild(badge);
      }
      // Mostrar botão de status e preencher número da mesa
      const statusBtn = document.getElementById('status-btn');
      if (statusBtn) statusBtn.style.display = 'flex';
      const statusMesaNum = document.getElementById('status-mesa-num');
      if (statusMesaNum) statusMesaNum.textContent = mesa;
    }
  } catch(e) {}
})();

function setDelivery(mode) {
  deliveryMode = mode;
  document.getElementById('opt-entrega').classList.toggle('active', mode === 'entrega');
  document.getElementById('opt-retirada').classList.toggle('active', mode === 'retirada');
  const cepSection = document.getElementById('cep-section');
  const freteRow   = document.getElementById('frete-row');
  if (mode === 'retirada') {
    cepSection.style.display = 'none';
    freteVal = 0;
    freteRow.style.display = 'none';
  } else {
    cepSection.style.display = 'block';
    freteRow.style.display = 'flex';
  }
  atualizarTotais();
  validarPedido();
}

function formatarCEP(el) {
  let v = el.value.replace(/\D/g, '').substring(0, 8);
  if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
  el.value = v;
  // resetar frete ao digitar novo CEP
  freteVal = 0;
  document.getElementById('frete-resultado').textContent = '';
  document.getElementById('frete-resultado').className = '';
  atualizarTotais();
  validarPedido();
}

function calcularFrete() {
  const cep = document.getElementById('cep-input').value.replace(/\D/g,'');
  const res = document.getElementById('frete-resultado');
  if (cep.length < 8) { res.textContent = 'Digite um CEP válido (8 dígitos).'; res.className = 'err'; return; }
  const zona = ZONAS.find(z => cep.startsWith(z.prefix));
  if (zona) {
    freteVal = zona.taxa;
    res.textContent = `✓ ${zona.nome} — Frete: R$ ${zona.taxa.toFixed(2).replace('.',',')}`;
    res.className = 'ok';
  } else {
    freteVal = 0;
    res.textContent = 'CEP fora da área de entrega. Escolha Retirada ou entre em contato.';
    res.className = 'err';
  }
  atualizarTotais();
  validarPedido();
}

function atualizarTotais() {
  const subtotal = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + freteVal;
  document.getElementById('subtotal-val').textContent = 'R$ ' + subtotal.toFixed(2).replace('.',',');
  document.getElementById('frete-val').textContent    = freteVal > 0 ? 'R$ ' + freteVal.toFixed(2).replace('.',',') : deliveryMode === 'retirada' ? 'Grátis' : '—';
  document.getElementById('total-val').textContent    = 'R$ ' + total.toFixed(2).replace('.',',');
}

function validarPedido() {
  const items = Object.keys(cart).length;
  const cepOk = deliveryMode === 'retirada' || deliveryMode === 'mesa' || freteVal > 0;
  const btn   = document.getElementById('btn-confirmar');
  btn.disabled = !(items > 0 && cepOk);
}

function ativarModoEntregaLocal() {
  mesaAtiva = null;
  deliveryMode = 'entrega';
  // Mostrar opções de entrega/retirada
  const optsRow = document.getElementById('delivery-opts-row');
  const mesaInfoEl = document.getElementById('mesa-info');
  const cepSection = document.getElementById('cep-section');
  const freteRow = document.getElementById('frete-row');
  if (optsRow)    optsRow.style.display    = 'flex';
  if (mesaInfoEl) mesaInfoEl.style.display = 'none';
  if (cepSection) cepSection.style.display = 'block';
  if (freteRow)   freteRow.style.display   = 'flex';
  // Resetar badge da nav
  document.querySelectorAll('.nav-brand span:not(.nav-snitch)').forEach(el => {
    if (el.textContent.startsWith('Mesa')) el.remove();
  });
  freteVal = 0;
  atualizarTotais();
  validarPedido();
}

function abrirCarrinho() {
  document.getElementById('cart-panel').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fecharCarrinho() {
  document.getElementById('cart-panel').classList.remove('open');
  document.body.style.overflow = '';
}

function gerarCodigoPedido() {
  return '#BF-' + String(Math.floor(1000 + Math.random() * 9000));
}

async function confirmarPedido() {
  if (Object.keys(cart).length === 0) return;
  const subtotal = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + freteVal;

  if (mesaAtiva) {
    // Modo mesa: salvar pedido no DB e enviar ao WhatsApp SEM PIX
    await confirmarPedidoMesa(total);
  } else {
    // Modo entrega/retirada: fluxo PIX normal
    const codigo = gerarCodigoPedido();
    fecharCarrinho();
    abrirPix(codigo, total);
  }
}

async function confirmarPedidoMesa(total) {
  const codigo = gerarCodigoPedido();
  const obs = (document.getElementById('obs-input') || {}).value || '';

  // Montar objeto do pedido
  const pedido = {
    id: codigo,
    mesa: mesaAtiva,
    itens: Object.values(cart).map(i => ({ name: i.name, qty: i.qty, price: i.price })),
    total,
    obs,
    status: 'pendente',
    ts: Date.now()
  };

  // Salvar no Supabase
  if (!dbRef) {
    mostrarToast('⚠️ Banco não conectado. Tente novamente em instantes.');
    return;
  }
  try {
    await dbRef.collection('mesas').doc(codigo).set(pedido);
  } catch(e) {
    console.error('DB save failed', e);
    mostrarToast('❌ Erro ao enviar pedido: ' + (e?.message || e?.code || 'tente novamente'));
    return;
  }

  // Limpar carrinho
  Object.keys(cart).forEach(k => delete cart[k]);
  document.querySelectorAll('.scroll-item .qty-num').forEach(el => el.textContent = '0');
  fecharCarrinho();
  atualizarCarrinho();

  // Garantir que o botão de status está visível
  const statusBtn = document.getElementById('status-btn');
  if (statusBtn) statusBtn.style.display = 'flex';

  // Toast de confirmação
  mostrarToast(`✓ Pedido ${codigo} enviado para a cozinha!`);

  // Atualizar status do botão encerrar e badge
  setTimeout(() => {
    atualizarStatusEncerrar();
    renderizarStatusPainel();
  }, 800);
}

function mostrarToast(msg) {
  let toast = document.getElementById('toast-mesa');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-mesa';
    toast.style.cssText = 'position:fixed;bottom:max(90px,calc(env(safe-area-inset-bottom,0px)+90px));left:50%;transform:translateX(-50%);background:rgba(45,138,64,0.95);color:#fff;font-family:var(--font-heading);font-size:0.8rem;padding:0.75rem 1.5rem;border-radius:50px;z-index:600;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,0.5);transition:opacity 0.4s;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

async function atualizarStatusEncerrar() {
  if (!mesaAtiva) return;
  const statusEl = document.getElementById('mesa-pedidos-status');
  const btnEnc = document.getElementById('btn-encerrar');
  if (!dbRef) {
    if (statusEl) statusEl.textContent = '';
    return;
  }
  try {
    const { data: rawPeds } = await supabase.from('mesas').select('*')
      .eq('mesa', mesaAtiva).gte('ts', sessaoMesaInicio()).order('ts', {ascending:true});
    const pedidos = rawPeds || [];
    const total = pedidos.length;
    const entregues = pedidos.filter(p => p.status === 'entregue').length;
    const pendentes = total - entregues;
    if (total === 0) {
      if (statusEl) statusEl.textContent = '';
      if (btnEnc) btnEnc.disabled = true;
    } else if (pendentes > 0) {
      if (statusEl) statusEl.textContent = `⏳ ${pendentes} pedido${pendentes>1?'s':''} aguardando entrega`;
      if (btnEnc) btnEnc.disabled = true;
    } else {
      if (statusEl) statusEl.textContent = '✓ Todos os pedidos foram entregues!';
      if (btnEnc) btnEnc.disabled = false;
    }
  } catch(e) { console.warn('DB query failed', e); }
}

async function encerrarConta() {
  if (!mesaAtiva || !dbRef) return;
  try {
    const { data: rawPeds } = await supabase.from('mesas').select('*')
      .eq('mesa', mesaAtiva).gte('ts', sessaoMesaInicio()).order('ts', {ascending:true});
    const pedidos = rawPeds || [];
    const pendentes = pedidos.filter(p => p.status !== 'entregue');
    if (pendentes.length > 0) {
      mostrarToast('⏳ Aguarde — há pedidos pendentes!');
      return;
    }
    if (pedidos.length === 0) {
      mostrarToast('Nenhum pedido registrado para esta mesa.');
      return;
    }
    // Calcular total acumulado
    const totalGeral = pedidos.reduce((s, p) => s + p.total, 0);
    const codigo = pedidos[0].id;
    fecharCarrinho();
    // Encerrar sessão — próximo cliente começa do zero
    localStorage.removeItem('bf_sess_' + mesaAtiva);
    abrirPix(codigo, totalGeral);
  } catch(e) {
    console.warn('DB error on encerrar', e);
    mostrarToast('Erro ao verificar pedidos. Tente novamente.');
  }
}

function abrirPix(codigo, total) {
  document.getElementById('pix-order-num').textContent    = codigo;
  document.getElementById('pix-key-display').textContent  = PIX_CONFIG.chave;
  document.getElementById('pix-total-val').textContent    = 'R$ ' + total.toFixed(2).replace('.',',');
  document.getElementById('copy-feedback').textContent    = '';
  desenharQR(codigo, total);
  document.getElementById('pix-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  // guardar para o WPP
  window._pedidoCodigo = codigo;
  window._pedidoTotal  = total;
}

function fecharPix() {
  document.getElementById('pix-modal').classList.remove('open');
  document.body.style.overflow = '';
}

function desenharQR(codigo, total) {
  const canvas = document.getElementById('pix-qr');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  // padrão visual decorativo (não é QR real — demo only)
  const seed = codigo.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const cell = 10;
  const cols = Math.floor(W / cell);
  const rows = Math.floor(H / cell);
  ctx.fillStyle = '#000000';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = (seed * (r * cols + c) * 2654435761) % 256;
      if (v < 128) ctx.fillRect(c * cell, r * cell, cell, cell);
    }
  }
  // cantos obrigatórios de QR code
  [[0,0],[W-7*cell,0],[0,H-7*cell]].forEach(([x,y]) => {
    ctx.fillStyle = '#000'; ctx.fillRect(x, y, 7*cell, 7*cell);
    ctx.fillStyle = '#fff'; ctx.fillRect(x+cell, y+cell, 5*cell, 5*cell);
    ctx.fillStyle = '#000'; ctx.fillRect(x+2*cell, y+2*cell, 3*cell, 3*cell);
  });
}

function copiarChave() {
  const chave = PIX_CONFIG.chave;
  const fb    = document.getElementById('copy-feedback');
  navigator.clipboard.writeText(chave).then(() => {
    fb.textContent = '✓ Chave copiada!';
    setTimeout(() => fb.textContent = '', 2500);
  }).catch(() => {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = chave; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
    fb.textContent = '✓ Chave copiada!';
    setTimeout(() => fb.textContent = '', 2500);
  });
}

async function enviarWhatsApp() {
  const codigo   = window._pedidoCodigo || '—';
  const total    = window._pedidoTotal  || 0;
  const obs      = (document.getElementById('obs-input') || {}).value || '';
  const modo     = deliveryMode === 'mesa' ? `🪄 Consumo no local — Mesa ${mesaAtiva}` : deliveryMode === 'entrega' ? '🚴 Entrega' : '🏃 Retirada';
  const cep      = deliveryMode === 'entrega' ? (document.getElementById('cep-input') || {}).value || '—' : 'N/A';
  const linhas   = Object.values(cart).map(i =>
    `• ${i.name} x${i.qty} — R$ ${(i.price * i.qty).toFixed(2).replace('.',',')}`
  ).join('\n');
  const msg = encodeURIComponent(
`⚡ *NOVO PEDIDO — Beco FilosoFal Burguer*
Código: *${codigo}*

*Itens:*
${linhas}

*Total: R$ ${total.toFixed(2).replace('.',',')}*
Modo: ${modo}${deliveryMode==='entrega' ? `\nCEP: ${cep}` : ''}
${obs ? '\nObs: ' + obs : ''}

📎 *Anexe aqui a foto do comprovante PIX para confirmarmos seu pedido.*`
  );
  // Salvar pedido externo no Supabase para o dashboard e garçom
  if (dbRef && deliveryMode !== 'mesa' && codigo !== '—') {
    const mesaKey = deliveryMode === 'entrega' ? 'ENTREGA' : 'RETIRADA';
    try {
      await dbRef.collection('mesas').doc(codigo).set({
        id: codigo,
        mesa: mesaKey,
        itens: Object.values(cart).map(i => ({ name: i.name, qty: i.qty, price: i.price })),
        total,
        obs: (document.getElementById('obs-input') || {}).value || '',
        status: 'pendente',
        ts: Date.now()
      });
    } catch(e) { console.warn('DB save external failed', e); }
  }
  window.open(`https://wa.me/${WPP_NUM}?text=${msg}`, '_blank');
}

/* =====================================================
   SUPABASE — inicialização e painel admin
   ===================================================== */
// Configuração do Supabase — substitua pelos valores do seu projeto
const SUPABASE_URL = window.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

let supabase = null;
let dbRef = null; // compatibilidade com código legado

// Wrapper de compatibilidade: simula a API collection().doc() do Artifact DB
function criarDbRef(sb) {
  return {
    collection(nome) {
      return {
        doc(id) {
          return {
            async set(dados) {
              const { error } = await sb.from(nome).upsert({ id, ...dados });
              if (error) throw error;
            },
            async update(dados) {
              const { error } = await sb.from(nome).update(dados).eq('id', id);
              if (error) throw error;
            },
            async get() {
              const { data, error } = await sb.from(nome).select('*').eq('id', id).single();
              if (error && error.code !== 'PGRST116') throw error;
              return { exists: !!data, data: () => data };
            }
          };
        },
        where(campo, op, valor) {
          return {
            async get() {
              const { data, error } = await sb.from(nome).select('*').eq(campo, valor);
              if (error) throw error;
              return { docs: (data || []).map(d => ({ data: () => d, id: d.id })) };
            },
            onSnapshot(cb) {
              // polling a cada 5s (Supabase Realtime requer config extra)
              const poll = async () => {
                const { data } = await sb.from(nome).select('*').eq(campo, valor);
                if (data) cb({ docs: data.map(d => ({ data: () => d, id: d.id })) });
              };
              poll();
              return setInterval(poll, 5000);
            }
          };
        },
        onSnapshot(cb) {
          const poll = async () => {
            const { data } = await sb.from(nome).select('*').order('ts', { ascending: true });
            if (data) cb({ docs: data.map(d => ({ data: () => d, id: d.id })) });
          };
          poll();
          return setInterval(poll, 5000);
        }
      };
    }
  };
}

(async function initDB() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase não configurado. Funciona só via WhatsApp.');
    return;
  }
  try {
    // Carrega o cliente Supabase dinamicamente
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    dbRef = criarDbRef(supabase);

    // Se em modo mesa, iniciar polling de status
    if (mesaAtiva) iniciarPollingStatus();

    // Painel gestão — subscrever a atualizações de pedidos
    if (painelAdminAtivo) {
      dbRef.collection('mesas').onSnapshot(snap => {
        renderizarPainelAdmin(snap.docs.map(d => d.data()));
      });
    }

    // Painel cozinha standalone — polling a cada 5s
    if (painelCozinhaAtivo) {
      renderizarCozinhaStandalone();
      setInterval(renderizarCozinhaStandalone, 5000);
    }

    // Painel garçom — polling a cada 5s
    if (painelGarcomAtivo) {
      renderizarMapaMesas();
      setInterval(() => {
        if (garcomAbaAtiva === 'mesas')   renderizarMapaMesas();
        else                              renderizarGarcom();
      }, 5000);
    }

    // Se em modo mesa, subscrever para atualizar botão encerrar
    if (mesaAtiva) {
      dbRef.collection('mesas').where('mesa','==',mesaAtiva).onSnapshot(() => {
        atualizarStatusEncerrar();
      });
    }
  } catch(e) { console.warn('DB init failed', e); }
})();

let painelAdminAtivo   = false;
let painelCozinhaAtivo = false;
let painelGarcomAtivo  = false;
const ADMIN_SENHA = window.ADMIN_SENHA || 'filosofal2026';

// Detectar qual painel de serviço abrir
(function detectarPaineis() {
  try {
    const params = new URLSearchParams(window.location.search);
    const painel = params.get('painel');
    if (painel === 'gestao' || painel === 'admin') {
      painelAdminAtivo = true;
      document.getElementById('admin-overlay').classList.add('open');
    } else if (painel === 'cozinha') {
      painelCozinhaAtivo = true;
      document.getElementById('cozinha-overlay').classList.add('open');
    } else if (painel === 'garcom') {
      painelGarcomAtivo = true;
      document.getElementById('garcom-overlay').classList.add('open');
    }
  } catch(e) {}
})();

function verificarSenhaAdmin() {
  const input = document.getElementById('admin-senha-input').value;
  const errEl = document.getElementById('admin-senha-err');
  if (input === ADMIN_SENHA) {
    document.getElementById('admin-senha-screen').style.display = 'none';
    document.getElementById('admin-painel').style.display = 'flex';
    document.getElementById('admin-painel').style.flexDirection = 'column';
    mudarAbaAdmin('dashboard');
    atualizarDashboard();
    if (typeof dashInterval !== 'undefined' && dashInterval) clearInterval(dashInterval);
    dashInterval = setInterval(atualizarDashboard, 10000);
    // Iniciar listener
    if (dbRef) {
      dbRef.collection('mesas').onSnapshot(snap => {
        renderizarPainelAdmin(snap.docs.map(d => d.data()));
      });
    } else {
      // tentar de novo após DB inicializar
      setTimeout(async () => {
        if (!dbRef) return;
        dbRef.collection('mesas').onSnapshot(snap => {
          renderizarPainelAdmin(snap.docs.map(d => d.data()));
        });
      }, 2000);
    }
  } else {
    errEl.textContent = '✕ Senha incorreta. Tente novamente.';
    setTimeout(() => errEl.textContent = '', 2500);
  }
}

function renderizarPainelAdmin(pedidos) {
  const bodyEl = document.getElementById('admin-body');
  const emptyEl = document.getElementById('admin-empty');
  const updateEl = document.getElementById('admin-last-update');
  if (updateEl) updateEl.textContent = 'Atualizado ' + new Date().toLocaleTimeString('pt-BR');

  if (pedidos.length === 0) {
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  // Agrupar por mesa
  const porMesa = {};
  pedidos.forEach(p => {
    if (!porMesa[p.mesa]) porMesa[p.mesa] = [];
    porMesa[p.mesa].push(p);
  });

  const isMesa = (m) => !isNaN(parseInt(m));

  bodyEl.innerHTML = '';
  Object.entries(porMesa).sort((a,b) => {
    const aPronto = a[1].some(p => p.status === 'pronto');
    const bPronto = b[1].some(p => p.status === 'pronto');
    if (aPronto !== bPronto) return aPronto ? -1 : 1;
    return a[0].localeCompare(b[0], undefined, {numeric:true});
  }).forEach(([mesaNum, peds]) => {
    const prontos    = peds.filter(p => p.status === 'pronto').length;
    const preparando = peds.filter(p => p.status === 'preparando').length;
    const pendentes  = peds.filter(p => p.status === 'pendente').length;
    const statusTxt = prontos > 0
      ? `🔔 ${prontos} pronto${prontos>1?'s':''} p/ entregar`
      : preparando > 0
        ? `🔥 ${preparando} em preparação`
        : pendentes > 0
          ? `⏳ ${pendentes} aguardando`
          : '✓ Todos entregues';
    const mesaLabel = isMesa(mesaNum)
      ? `🪄 Mesa ${mesaNum}`
      : mesaNum === 'ENTREGA' ? '🚴 Entrega' : '🏃 Retirada';
    const block = document.createElement('div');
    block.className = 'admin-mesa-block' + (prontos > 0 ? ' mesa-pronta' : '');
    block.innerHTML = `
      <div class="admin-mesa-header">
        <span class="admin-mesa-num">${mesaLabel}</span>
        <span class="admin-mesa-status">${statusTxt}</span>
      </div>
      ${peds.sort((a,b) => a.ts - b.ts).map(p => `
        <div class="admin-pedido" id="admin-ped-${p.id}">
          <div class="admin-pedido-info">
            <div class="admin-pedido-id">${p.id} · ${new Date(p.ts).toLocaleTimeString('pt-BR')}</div>
            <div class="admin-pedido-items">${p.itens.map(i => `<strong>${i.qty}×</strong> ${i.name}`).join(' · ')}</div>
            ${p.obs ? `<div class="admin-pedido-time" style="color:var(--candle);">📝 ${p.obs}</div>` : ''}
            <div class="admin-pedido-time">R$ ${p.total.toFixed(2).replace('.',',')}</div>
          </div>
          ${p.status === 'entregue'
            ? `<button class="btn-entregar entregue" disabled>✓ Entregue</button>`
            : p.status === 'pronto'
              ? `<button class="btn-entregar" onclick="marcarEntregue('${p.id}', this)">🚚 Entregar</button>`
              : p.status === 'preparando'
                ? `<button class="btn-pronto" onclick="marcarProntoAdminStep2('${p.id}', this)">✓ Concluído</button>`
                : `<button class="btn-iniciar" onclick="marcarProntoAdmin('${p.id}', this)">▶ Iniciar</button>`
          }
        </div>
      `).join('')}
    `;
    bodyEl.appendChild(block);
  });
}

async function marcarEntregue(pedidoId, btn) {
  if (!dbRef) return;
  btn.disabled = true;
  btn.textContent = '...';
  try {
    await dbRef.collection('mesas').doc(pedidoId).update({ status: 'entregue' });
    btn.textContent = '✓ Entregue';
    btn.classList.add('entregue');
  } catch(e) {
    console.warn('Update failed', e);
    btn.disabled = false;
    btn.textContent = 'Marcar Entregue';
  }
}

function fecharAdmin() {
  document.getElementById('admin-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function fecharGarcom() {
  document.getElementById('garcom-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// --- PAINEL GARÇOM ---
let garcomAbaAtiva = 'mesas';

function mudarAbaGarcom(aba) {
  garcomAbaAtiva = aba;
  document.getElementById('garcom-aba-mesas').style.display   = aba === 'mesas'   ? '' : 'none';
  document.getElementById('garcom-aba-pedidos').style.display = aba === 'pedidos' ? '' : 'none';
  document.getElementById('garcom-tab-mesas').classList.toggle('active',   aba === 'mesas');
  document.getElementById('garcom-tab-pedidos').classList.toggle('active', aba === 'pedidos');
  if (aba === 'mesas')   renderizarMapaMesas();
  if (aba === 'pedidos') renderizarGarcom();
}

async function renderizarMapaMesas() {
  const body = document.getElementById('garcom-mesas-body');
  if (!body) return;
  if (!dbRef) {
    body.innerHTML = '<div class="admin-empty">⏳ Conectando ao banco...</div>';
    setTimeout(renderizarMapaMesas, 2000);
    return;
  }
  try {
    const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
    const { data } = await supabase.from('mesas').select('*')
      .gte('ts', startOfDay.getTime())
      .order('ts', { ascending: true });
    const pedidos = data || [];

    if (pedidos.length === 0) {
      body.innerHTML = '<div class="admin-empty">Nenhuma mesa ativa hoje.</div>';
      return;
    }

    const porMesa = {};
    pedidos.forEach(p => {
      if (!porMesa[p.mesa]) porMesa[p.mesa] = [];
      porMesa[p.mesa].push(p);
    });

    const isMesaNum = (m) => !isNaN(parseInt(m));
    const mesaLabel = (m) => isMesaNum(m) ? `Mesa ${m}` : m === 'ENTREGA' ? 'Entrega' : 'Retirada';
    const mesaIcon  = (m) => isMesaNum(m) ? '🪄' : m === 'ENTREGA' ? '🚴' : '🏃';

    const cards = Object.entries(porMesa)
      .sort((a,b) => {
        const aPronto = a[1].some(p => p.status === 'pronto');
        const bPronto = b[1].some(p => p.status === 'pronto');
        if (aPronto !== bPronto) return aPronto ? -1 : 1;
        return a[0].localeCompare(b[0], undefined, {numeric:true});
      })
      .map(([mesa, peds]) => {
        const total = peds.reduce((s, p) => s + (p.total||0), 0);
        const ativas = peds.filter(p => p.status !== 'entregue');
        const temPronto = ativas.some(p => p.status === 'pronto');
        const temPrep   = ativas.some(p => ['preparando','pendente'].includes(p.status));
        const statusTxt = ativas.length === 0
          ? '✓ Conta a fechar'
          : temPronto
            ? '🔔 Pronto p/ entregar'
            : temPrep
              ? '🔥 Em preparo'
              : '';
        const cls = temPronto ? 'mc-pronto' : temPrep ? 'mc-preparo' : '';
        return `
          <div class="mesa-card ${cls}">
            <div class="mesa-card-num">${mesaIcon(mesa)} ${mesaLabel(mesa)}</div>
            <div class="mesa-card-total">R$ ${total.toFixed(2).replace('.',',')}</div>
            <div class="mesa-card-status">${statusTxt}</div>
            <button class="btn-fechar-conta" onclick="abrirFecharConta('${mesa}')">💳 Fechar conta</button>
          </div>`;
      });

    body.innerHTML = `<div class="mesas-grid">${cards.join('')}</div>`;
  } catch(e) {
    body.innerHTML = '<div class="admin-empty">Erro ao carregar mesas.</div>';
    console.warn('MapaMesas fetch failed', e);
  }
}

async function renderizarGarcom() {
  const body = document.getElementById('garcom-body');
  if (!body) return;
  if (!dbRef) {
    body.innerHTML = '<div class="admin-empty">⏳ Conectando ao banco...</div>';
    setTimeout(renderizarGarcom, 2000);
    return;
  }
  try {
    const { data } = await supabase.from('mesas').select('*')
      .in('status', ['pendente', 'preparando', 'pronto'])
      .order('ts', { ascending: true });
    const pedidos = data || [];

    const prontos   = pedidos.filter(p => p.status === 'pronto');
    const emPreparo = pedidos.filter(p => p.status === 'pendente' || p.status === 'preparando');

    body.innerHTML = `
      <div class="kanban-board">
        <div class="kanban-col kanban-col-entregar">
          <div class="kanban-col-header">🔔 A Entregar <span class="kh-count">${prontos.length}</span></div>
          <div class="kanban-col-body">
            ${prontos.length === 0 ? '<div class="kanban-empty">Nenhum</div>'
              : prontos.map(p => mkKanbanCard(p, `<button class="btn-kanban btn-entregar-g" onclick="marcarEntregueGarcom('${p.id}', this)">✓ Entregar</button>`)).join('')}
          </div>
        </div>
        <div class="kanban-col kanban-col-preparo">
          <div class="kanban-col-header">⏳ Em Preparo <span class="kh-count">${emPreparo.length}</span></div>
          <div class="kanban-col-body">
            ${emPreparo.length === 0 ? '<div class="kanban-empty">Nenhum</div>'
              : emPreparo.map(p => mkKanbanCard(p, `<div class="kanban-card-info">${p.status === 'preparando' ? '🔥 Preparando' : '⏳ Aguardando cozinha'}</div>`)).join('')}
          </div>
        </div>
      </div>`;
  } catch(e) {
    body.innerHTML = '<div class="admin-empty">Erro ao carregar pedidos.</div>';
    console.warn('Garcom fetch failed', e);
  }
}

async function marcarEntregueGarcom(pedidoId, btn) {
  btn.disabled = true; btn.textContent = '...';
  try {
    const { error } = await supabase.from('mesas').update({ status: 'entregue' }).eq('id', pedidoId);
    if (error) throw error;
    renderizarGarcom();
    renderizarMapaMesas();
  } catch(e) {
    console.warn('Entregar failed', e);
    btn.disabled = false; btn.textContent = '✓ Entregar';
  }
}

// --- DETALHE DE MESA / FECHAR CONTA / TRANSFERIR ---
let _pagMesa = null, _pagForma = null, _pagTotal = 0, _pagDestino = null;

async function abrirFecharConta(mesa) {
  _pagMesa = mesa; _pagForma = null; _pagDestino = null;
  const isMesaNum = (m) => !isNaN(parseInt(m));
  const mesaLabel = isMesaNum(mesa) ? `Mesa ${mesa}` : mesa === 'ENTREGA' ? 'Entrega' : 'Retirada';

  const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
  const { data } = await supabase.from('mesas').select('*')
    .eq('mesa', mesa).gte('ts', startOfDay.getTime()).order('ts', {ascending:true});
  const pedidos = data || [];
  window._pagPedidosCache = pedidos;

  const total = pedidos.reduce((s, p) => s + (p.total||0), 0);
  _pagTotal = total;

  // Agrupar itens por pedido (mostrar detalhado por pedido)
  let itensHtml = '';
  pedidos.forEach(p => {
    const statusIcon = p.status === 'entregue' ? '✓' : p.status === 'pronto' ? '🔔' : p.status === 'preparando' ? '🔥' : '⏳';
    const hora = new Date(p.ts).toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'});
    itensHtml += `<div style="margin-bottom:0.5rem;padding-bottom:0.5rem;border-bottom:1px solid rgba(201,168,76,0.08);">`;
    itensHtml += `<div style="font-size:0.68rem;color:var(--fg-muted);margin-bottom:0.2rem;">${statusIcon} ${hora} · R$ ${p.total.toFixed(2).replace('.',',')}</div>`;
    itensHtml += p.itens.map(i => `<div>${i.qty}× ${i.name}</div>`).join('');
    if (p.obs) itensHtml += `<div style="color:var(--candle);font-size:0.72rem;">📝 ${p.obs}</div>`;
    itensHtml += `</div>`;
  });
  if (!itensHtml) itensHtml = '<div style="color:var(--fg-muted)">Nenhum item hoje.</div>';

  document.getElementById('pag-modal-titulo').textContent = `🪄 ${mesaLabel}`;
  document.getElementById('pag-mesa-label').textContent = `${pedidos.length} pedido${pedidos.length !== 1 ? 's' : ''} hoje`;
  document.getElementById('pag-itens').innerHTML = itensHtml;
  document.getElementById('pag-total-val').textContent = `R$ ${total.toFixed(2).replace('.',',')}`;

  // Reset seções
  document.getElementById('pag-secao-fechar').style.display    = 'none';
  document.getElementById('pag-secao-transferir').style.display = 'none';
  document.getElementById('pag-acoes').style.display            = 'flex';
  document.getElementById('btn-confirmar-pag').disabled = true;
  document.getElementById('btn-confirmar-pag').style.opacity = '0.5';
  document.getElementById('btn-confirmar-pag').textContent = '✓ Confirmar Pagamento';
  document.getElementById('pag-pix-info').style.display = 'none';
  document.querySelectorAll('.btn-forma').forEach(b => b.classList.remove('selected'));
  if (window.PIX_CHAVE) document.getElementById('pag-pix-chave').textContent = window.PIX_CHAVE;

  document.getElementById('pag-modal').style.display = 'flex';
}

function mostrarSecaoFechar() {
  document.getElementById('pag-acoes').style.display            = 'none';
  document.getElementById('pag-secao-fechar').style.display     = 'block';
  document.getElementById('pag-secao-transferir').style.display = 'none';
}

let _pagPedidosSelecionados = new Set();

function mostrarSecaoTransferir() {
  document.getElementById('pag-acoes').style.display            = 'none';
  document.getElementById('pag-secao-fechar').style.display     = 'none';
  document.getElementById('pag-secao-transferir').style.display = 'block';
  _pagDestino = null;
  _pagPedidosSelecionados = new Set();

  // Lista de pedidos com checkbox (usa _pagPedidosCache preenchido em abrirFecharConta)
  const pedidos = window._pagPedidosCache || [];
  const listHtml = pedidos.length === 0 ? '<div style="color:var(--fg-muted);font-size:0.78rem;">Nenhum pedido hoje.</div>' :
    pedidos.map(p => {
      const hora = new Date(p.ts).toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'});
      const resumo = p.itens.map(i => `${i.qty}× ${i.name}`).join(', ');
      return `
        <label style="display:flex;align-items:flex-start;gap:0.5rem;padding:0.4rem 0;border-bottom:1px solid rgba(201,168,76,0.08);cursor:pointer;">
          <input type="checkbox" id="chk-ped-${p.id}" value="${p.id}"
            style="margin-top:0.2rem;accent-color:var(--gold);cursor:pointer;"
            onchange="togglePedidoTransf('${p.id}', this.checked)">
          <div style="font-size:0.75rem;color:var(--fg);line-height:1.5;">
            <div style="font-size:0.65rem;color:var(--fg-muted);">${hora} · R$ ${p.total.toFixed(2).replace('.',',')}</div>
            <div>${resumo}</div>
          </div>
        </label>`;
    }).join('');

  // Mesa picker
  const numMesas = parseInt(localStorage.getItem('bf_num_mesas') || String(window.NUM_MESAS_PADRAO || 20), 10);
  let pickerHtml = '';
  for (let i = 1; i <= numMesas; i++) {
    if (String(i) === String(_pagMesa)) continue;
    pickerHtml += `<div class="mesa-pick-btn" id="mpick-${i}" onclick="selecionarMesaDestino(${i})"
      style="padding:0.5rem;text-align:center;border:1px solid rgba(201,168,76,0.18);border-radius:calc(var(--radius)-2px);cursor:pointer;font-family:var(--font-heading);font-size:0.78rem;color:var(--fg);transition:all 0.15s;">${i}</div>`;
  }

  document.getElementById('pag-mesa-picker').innerHTML = `
    <div style="font-size:0.68rem;color:var(--fg-muted);font-family:var(--font-heading);margin-bottom:0.4rem;">SELECIONE OS PEDIDOS:</div>
    <div style="margin-bottom:0.75rem;">${listHtml}</div>
    <div style="font-size:0.68rem;color:var(--fg-muted);font-family:var(--font-heading);margin-bottom:0.4rem;">MESA DESTINO:</div>
    <div class="mesas-grid">${pickerHtml}</div>`;

  atualizarBtnTransferir();
}

function togglePedidoTransf(id, checked) {
  if (checked) _pagPedidosSelecionados.add(id);
  else _pagPedidosSelecionados.delete(id);
  atualizarBtnTransferir();
}

function atualizarBtnTransferir() {
  const btn = document.getElementById('btn-confirmar-transferir');
  const ok = _pagPedidosSelecionados.size > 0 && _pagDestino;
  btn.disabled = !ok; btn.style.opacity = ok ? '1' : '0.5';
}

function selecionarMesaDestino(num) {
  _pagDestino = num;
  document.querySelectorAll('.mesa-pick-btn').forEach(b => {
    b.style.background = ''; b.style.borderColor = 'rgba(201,168,76,0.18)'; b.style.color = 'var(--fg)';
  });
  const sel = document.getElementById(`mpick-${num}`);
  if (sel) { sel.style.background = 'rgba(201,168,76,0.2)'; sel.style.borderColor = 'var(--gold)'; sel.style.color = 'var(--gold)'; }
  atualizarBtnTransferir();
}

async function confirmarTransferencia() {
  if (!_pagMesa || !_pagDestino || _pagPedidosSelecionados.size === 0) return;
  const btn = document.getElementById('btn-confirmar-transferir');
  btn.disabled = true; btn.textContent = '...';
  try {
    const ids = Array.from(_pagPedidosSelecionados);
    const { error } = await supabase.from('mesas')
      .update({ mesa: String(_pagDestino), ts: Date.now() })
      .in('id', ids);
    if (error) throw error;
    fecharModalPag();
    mostrarToast(`✓ Mesa ${_pagMesa} transferida para Mesa ${_pagDestino}`);
    renderizarMapaMesas();
    renderizarGarcom();
  } catch(e) {
    console.warn('Transferencia failed', e);
    btn.disabled = false; btn.textContent = '🔀 Confirmar Transferência';
    mostrarToast('❌ Erro ao transferir: ' + (e?.message || 'tente novamente'));
  }
}

function selecionarFormaPag(forma) {
  _pagForma = forma;
  document.querySelectorAll('.btn-forma').forEach(b => b.classList.remove('selected'));
  const ids = {pix:'pag-btn-pix', dinheiro:'pag-btn-dinheiro', cartao:'pag-btn-cartao'};
  if (ids[forma]) document.getElementById(ids[forma]).classList.add('selected');
  document.getElementById('pag-pix-info').style.display = forma === 'pix' ? 'block' : 'none';
  const btn = document.getElementById('btn-confirmar-pag');
  btn.disabled = false; btn.style.opacity = '1';
}

function copiarPixChave() {
  const chave = document.getElementById('pag-pix-chave').textContent;
  navigator.clipboard.writeText(chave).then(() => mostrarToast('✓ Chave PIX copiada!'));
}

async function confirmarPagamentoGarcom() {
  if (!_pagMesa || !_pagForma) return;
  const btn = document.getElementById('btn-confirmar-pag');
  btn.disabled = true; btn.textContent = '...';
  try {
    const agora = new Date();
    const tsBrasilia = agora.toLocaleString('pt-BR', {timeZone:'America/Sao_Paulo'});
    const ts = agora.getTime();
    if (supabase) {
      await supabase.from('pagamentos').insert({
        id: 'pag-' + Math.random().toString(36).substring(2,10),
        mesa: _pagMesa, total: _pagTotal, forma: _pagForma,
        responsavel: 'garçom', ts, ts_brasilia: tsBrasilia
      });
    }
    await supabase.from('mesas').update({ status: 'entregue' })
      .eq('mesa', _pagMesa)
      .in('status', ['pendente', 'preparando', 'pronto']);
    fecharModalPag();
    mostrarToast('✓ Pagamento registrado!');
    renderizarMapaMesas();
    renderizarGarcom();
  } catch(e) {
    console.warn('Pagamento failed', e);
    btn.disabled = false; btn.textContent = '✓ Confirmar Pagamento';
    mostrarToast('❌ Erro ao registrar pagamento: ' + (e?.message || 'tente novamente'));
  }
}

function fecharModalPag() {
  document.getElementById('pag-modal').style.display = 'none';
  _pagMesa = null; _pagForma = null; _pagTotal = 0; _pagDestino = null;
}

// --- KANBAN HELPERS ---
function mkKanbanCard(p, btnHtml) {
  const isMesaNum = (m) => !isNaN(parseInt(m));
  const mesaLabel = isMesaNum(p.mesa) ? `Mesa ${p.mesa}` : p.mesa === 'ENTREGA' ? 'Entrega' : 'Retirada';
  return `
    <div class="kanban-card">
      <div class="kanban-card-id">#${p.id} · ${new Date(p.ts).toLocaleTimeString('pt-BR')}</div>
      <div class="kanban-card-mesa">📍 ${mesaLabel}</div>
      <div class="kanban-card-items">${p.itens.map(i => `${i.qty}× ${i.name}`).join('<br>')}</div>
      ${p.obs ? `<div class="kanban-card-obs">📝 ${p.obs}</div>` : ''}
      ${btnHtml}
    </div>`;
}

function mkKanbanBoard(pendentes, preparando, prontos, cbPend, cbPrep, cbPron) {
  return `
    <div class="kanban-board">
      <div class="kanban-col kanban-col-pendente">
        <div class="kanban-col-header">⏳ Pendente <span class="kh-count">${pendentes.length}</span></div>
        <div class="kanban-col-body">
          ${pendentes.length === 0 ? '<div class="kanban-empty">Nenhum</div>' : pendentes.map(p => mkKanbanCard(p, cbPend(p))).join('')}
        </div>
      </div>
      <div class="kanban-col kanban-col-preparando">
        <div class="kanban-col-header">🔥 Em Preparação <span class="kh-count">${preparando.length}</span></div>
        <div class="kanban-col-body">
          ${preparando.length === 0 ? '<div class="kanban-empty">Nenhum</div>' : preparando.map(p => mkKanbanCard(p, cbPrep(p))).join('')}
        </div>
      </div>
      <div class="kanban-col kanban-col-pronto">
        <div class="kanban-col-header">✅ Concluído <span class="kh-count">${prontos.length}</span></div>
        <div class="kanban-col-body">
          ${prontos.length === 0 ? '<div class="kanban-empty">Nenhum</div>' : prontos.map(p => mkKanbanCard(p, cbPron(p))).join('')}
        </div>
      </div>
    </div>`;
}

// --- COZINHA STANDALONE ---
async function renderizarCozinhaStandalone() {
  const body = document.getElementById('cozinha-body');
  if (!body) return;
  if (!dbRef) {
    body.innerHTML = '<div class="admin-empty">⏳ Conectando ao banco...</div>';
    setTimeout(renderizarCozinhaStandalone, 2000);
    return;
  }
  try {
    const { data } = await supabase.from('mesas').select('*')
      .in('status', ['pendente', 'preparando', 'pronto'])
      .order('ts', { ascending: true });
    const pedidos = data || [];
    const pendentes  = pedidos.filter(p => p.status === 'pendente');
    const preparando = pedidos.filter(p => p.status === 'preparando');
    const prontos    = pedidos.filter(p => p.status === 'pronto');

    body.innerHTML = mkKanbanBoard(
      pendentes, preparando, prontos,
      p => `<button class="btn-kanban btn-iniciar" onclick="marcarPreparando('${p.id}', this)">▶ Iniciar preparo</button>`,
      p => `<button class="btn-kanban btn-pronto-k" onclick="marcarProntoKitchen('${p.id}', this)">✓ Concluído</button>`,
      () => `<div class="kanban-card-info">Aguardando garçom</div>`
    );
  } catch(e) {
    body.innerHTML = '<div class="admin-empty">Erro ao carregar pedidos.</div>';
    console.warn('Cozinha standalone fetch failed', e);
  }
}

async function marcarPreparando(pedidoId, btn) {
  btn.disabled = true;
  btn.textContent = '...';
  try {
    const { error } = await supabase.from('mesas').update({ status: 'preparando' }).eq('id', pedidoId);
    if (error) throw error;
    renderizarCozinhaStandalone();
    renderizarCozinha();
  } catch(e) {
    console.warn('marcarPreparando failed', e);
    btn.disabled = false;
    btn.textContent = '▶ Iniciar preparo';
  }
}

async function marcarProntoKitchen(pedidoId, btn) {
  btn.disabled = true;
  btn.textContent = '...';
  try {
    const { error } = await supabase.from('mesas').update({ status: 'pronto' }).eq('id', pedidoId);
    if (error) throw error;
    renderizarCozinhaStandalone();
    renderizarCozinha();
  } catch(e) {
    console.warn('marcarProntoKitchen failed', e);
    btn.disabled = false;
    btn.textContent = '✓ Concluído';
  }
}

// --- DASHBOARD ---
async function atualizarDashboard() {
  if (!supabase) return;
  try {
    const hojeMidnight = new Date(); hojeMidnight.setHours(0,0,0,0);
    const { data } = await supabase.from('mesas').select('*').gte('ts', hojeMidnight.getTime());
    const pedidos = data || [];

    const isMesaNum = (m) => !isNaN(parseInt(m));
    const mesasAtivas = new Set(
      pedidos.filter(p => p.status !== 'entregue' && isMesaNum(p.mesa)).map(p => p.mesa)
    );
    const mesaEmPreparo = pedidos.filter(p => p.status === 'pendente' && isMesaNum(p.mesa)).length;
    const mesaProntos   = pedidos.filter(p => p.status === 'pronto'   && isMesaNum(p.mesa)).length;
    const extEmPreparo  = pedidos.filter(p => p.status === 'pendente' && !isMesaNum(p.mesa)).length;
    const extProntos    = pedidos.filter(p => p.status === 'pronto'   && !isMesaNum(p.mesa)).length;
    const totalHoje     = pedidos.length;
    const fatHoje       = pedidos.reduce((s, p) => s + (p.total || 0), 0);

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('dash-mesas-ativas', mesasAtivas.size);
    set('dash-em-preparo',   mesaEmPreparo);
    set('dash-prontos-mesa', mesaProntos);
    set('dash-ext-preparo',  extEmPreparo);
    set('dash-ext-prontos',  extProntos);
    set('dash-total-hoje',   totalHoje);
    set('dash-fat-hoje',     'R$ ' + fatHoje.toFixed(2).replace('.', ','));
    const ref = document.querySelector('.dash-refresh');
    if (ref) ref.textContent = '🔄 Atualizado ' + new Date().toLocaleTimeString('pt-BR');
  } catch(e) { console.warn('Dashboard fetch failed', e); }
}

let dashInterval = null;

function mudarAbaAdmin(aba) {
  ['dashboard','pedidos','cozinha','links'].forEach(a => {
    const el  = document.getElementById(`admin-aba-${a}`);
    const tab = document.getElementById(`tab-${a}`);
    if (el)  el.style.display = a === aba ? 'block' : 'none';
    if (tab) tab.classList.toggle('active', a === aba);
  });
  if (aba === 'links')     renderizarLinksAdmin();
  if (aba === 'cozinha')   renderizarCozinha();
  if (aba === 'dashboard') atualizarDashboard();
}

async function renderizarCozinha() {
  const body = document.getElementById('cozinha-body-admin');
  if (!body) return;
  if (!dbRef) {
    body.innerHTML = '<div class="admin-empty">⏳ Conectando ao banco...</div>';
    setTimeout(renderizarCozinha, 2000);
    return;
  }
  try {
    const { data } = await supabase.from('mesas').select('*')
      .in('status', ['pendente', 'preparando', 'pronto'])
      .order('ts', { ascending: true });
    const pedidos = data || [];
    const emptyEl = document.getElementById('cozinha-empty');
    if (pedidos.length === 0) {
      if (emptyEl) emptyEl.style.display = 'block';
      body.innerHTML = '';
      return;
    }
    if (emptyEl) emptyEl.style.display = 'none';
    const pendentes  = pedidos.filter(p => p.status === 'pendente');
    const preparando = pedidos.filter(p => p.status === 'preparando');
    const prontos    = pedidos.filter(p => p.status === 'pronto');
    body.innerHTML = mkKanbanBoard(
      pendentes, preparando, prontos,
      p => `<button class="btn-kanban btn-iniciar" onclick="marcarPreparando('${p.id}', this)">▶ Iniciar preparo</button>`,
      p => `<button class="btn-kanban btn-pronto-k" onclick="marcarProntoKitchen('${p.id}', this)">✓ Concluído</button>`,
      () => `<div class="kanban-card-info">Aguardando garçom</div>`
    );
  } catch(e) {
    body.innerHTML = '<div class="admin-empty">Erro ao carregar pedidos.</div>';
    console.warn('Cozinha fetch failed', e);
  }
}

async function marcarProntoAdmin(pedidoId, btn) {
  btn.disabled = true; btn.textContent = '...';
  try {
    const { error } = await supabase.from('mesas').update({ status: 'preparando' }).eq('id', pedidoId);
    if (error) throw error;
    btn.className = 'btn-pronto';
    btn.textContent = '✓ Concluído';
    btn.disabled = false;
    btn.onclick = function() { marcarProntoAdminStep2(pedidoId, this); };
  } catch(e) {
    console.warn('ProntoAdmin failed', e);
    btn.disabled = false; btn.textContent = '▶ Iniciar';
  }
}

async function marcarProntoAdminStep2(pedidoId, btn) {
  btn.disabled = true; btn.textContent = '...';
  try {
    const { error } = await supabase.from('mesas').update({ status: 'pronto' }).eq('id', pedidoId);
    if (error) throw error;
    btn.className = 'btn-entregar';
    btn.textContent = '🚚 Entregar';
    btn.disabled = false;
    btn.onclick = function() { marcarEntregue(pedidoId, this); };
  } catch(e) {
    console.warn('ProntoAdminStep2 failed', e);
    btn.disabled = false; btn.textContent = '✓ Concluído';
  }
}

const MESA_MAX = 100;
let mesasVisiveis = parseInt(localStorage.getItem('bf_num_mesas') || String(window.NUM_MESAS_PADRAO || 20), 10);

function renderizarLinksAdmin() {
  const tokens  = window.MESAS_TOKENS || {};
  const base    = window.location.origin;
  const porMesa = {};
  Object.entries(tokens).forEach(([tok, num]) => { porMesa[num] = tok; });

  const lista = document.getElementById('admin-links-lista');
  if (Object.keys(porMesa).length === 0) {
    lista.innerHTML = '<div class="admin-empty">Tokens não encontrados.<br>Verifique MESA_SECRET na Vercel.</div>';
    return;
  }

  let html = '';
  for (let i = 1; i <= mesasVisiveis; i++) {
    const tok = porMesa[String(i)];
    if (!tok) continue;
    const url = `${base}/?mesa=${tok}`;
    html += `
      <div class="mesa-link-row">
        <span class="mesa-link-num">Mesa ${String(i).padStart(2,'0')}</span>
        <span class="mesa-link-url" title="${url}">${url}</span>
        <button class="mesa-link-copy" onclick="copiarLink(this,'${url}')">Copiar</button>
        <button class="mesa-link-copy" onclick="imprimirQR(${i},'${url}')" style="background:rgba(45,138,64,0.1);border-color:#2d8a40;color:#3daa52;">🖨️</button>
      </div>
    `;
  }

  // Botão adicionar mesa
  if (mesasVisiveis < MESA_MAX) {
    html += `<button onclick="adicionarMesa()" style="margin-top:1rem;width:100%;padding:0.65rem;background:none;border:1px dashed rgba(201,168,76,0.3);border-radius:var(--radius);color:var(--gold-dark);font-family:var(--font-heading);font-size:0.78rem;cursor:pointer;">+ Adicionar Mesa ${mesasVisiveis + 1}</button>`;
  }

  lista.innerHTML = html;
}

function adicionarMesa() {
  if (mesasVisiveis >= MESA_MAX) return;
  mesasVisiveis++;
  localStorage.setItem('bf_num_mesas', String(mesasVisiveis));
  renderizarLinksAdmin();
}

function copiarLink(btn, url) {
  navigator.clipboard.writeText(url).then(() => {
    btn.textContent = '✓ Copiado';
    setTimeout(() => { btn.textContent = 'Copiar'; }, 2000);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = url; ta.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = '✓ Copiado';
    setTimeout(() => { btn.textContent = 'Copiar'; }, 2000);
  });
}

function imprimirQR(numMesa, url) {
  const win = window.open('', '_blank', 'width=500,height=600');
  win.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Mesa ${numMesa} — Beco FilosoFal Burguer</title>
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"><\/script>
  <style>
    body { font-family: serif; text-align: center; padding: 2rem; background: #fff; color: #1a1208; }
    h1 { font-size: 1.8rem; margin-bottom: 0.25rem; }
    h2 { font-size: 1.1rem; font-weight: normal; color: #7a5e1e; margin-bottom: 1.5rem; }
    canvas { border: 4px solid #c9a84c; border-radius: 8px; padding: 10px; }
    p { font-size: 0.85rem; color: #7a5e1e; margin-top: 1rem; }
    .instrucao { font-size: 1rem; margin-top: 1.5rem; border-top: 1px solid #c9a84c; padding-top: 1rem; }
  </style>
</head>
<body>
  <h1>🌙 Beco FilosoFal Burguer</h1>
  <h2>Mesa ${numMesa}</h2>
  <canvas id="qr"></canvas>
  <p class="instrucao">📱 Aponte a câmera do celular para fazer seu pedido</p>
  <script>
    QRCode.toCanvas(document.getElementById('qr'), '${url}', { width: 260, margin: 2 }, function() {
      setTimeout(() => window.print(), 400);
    });
  <\/script>
</body>
</html>`);
  win.document.close();
}

function fecharCozinha() {
  document.getElementById('cozinha-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* =====================================================
   PAINEL DE STATUS DE PEDIDOS (MESA)
   ===================================================== */
let statusInterval = null;

function abrirStatus() {
  document.getElementById('status-panel').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderizarStatusPainel();
}

function fecharStatus() {
  document.getElementById('status-panel').classList.remove('open');
  document.body.style.overflow = '';
}

async function renderizarStatusPainel() {
  const body = document.getElementById('status-body');
  if (!body) return;

  // DB ainda não inicializou — aguardar e tentar novamente
  if (!dbRef) {
    body.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--fg-muted);font-family:var(--font-scroll);font-style:italic;">⏳ Conectando ao banco...<br><small>Aguarde alguns segundos.</small></div>';
    setTimeout(renderizarStatusPainel, 2000);
    return;
  }

  try {
    // Filtra pedidos desta mesa e desta sessão (evita mistura com cliente anterior)
    const { data: rawPeds, error: errStatus } = await supabase.from('mesas').select('*')
      .eq('mesa', mesaAtiva).gte('ts', sessaoMesaInicio()).order('ts', {ascending:true});
    if (errStatus) throw errStatus;
    const pedidos = rawPeds || [];

    if (pedidos.length === 0) {
      body.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--fg-muted);font-family:var(--font-scroll);font-style:italic;">Nenhum pedido enviado ainda.</div>';
      atualizarBadgeStatus([]);
      return;
    }

    body.innerHTML = pedidos.map(p => {
      const isPrep = p.status === 'pendente' || p.status === 'preparando';
      return `
      <div class="status-item">
        <div class="status-item-header">
          <span class="status-item-code">${p.id} · ${new Date(p.ts).toLocaleTimeString('pt-BR')}</span>
          <span class="status-pill ${p.status === 'entregue' ? 'entregue' : p.status === 'pronto' ? 'pronto' : 'pendente'}">
            ${p.status === 'entregue' ? '✓ Entregue' : p.status === 'pronto' ? '🔔 Pronto! Aguard. entrega' : '⏳ Em preparação...'}
          </span>
        </div>
        <div class="status-item-itens">${p.itens.map(i => `${i.name} ×${i.qty}`).join(' · ')}</div>
        <div class="status-item-meta">R$ ${p.total.toFixed(2).replace('.', ',')}${p.obs ? ' · ' + p.obs : ''}</div>
      </div>`;
    }).join('');

    atualizarBadgeStatus(pedidos);
  } catch(e) {
    body.innerHTML = '<div style="text-align:center;padding:3rem;color:#e06060;font-size:0.82rem;">Erro ao carregar pedidos. Tente novamente.</div>';
    console.warn('Status fetch failed', e);
  }
}

function atualizarBadgeStatus(pedidos) {
  const prontos   = pedidos.filter(p => p.status === 'pronto').length;
  const emPreparo = pedidos.filter(p => p.status === 'pendente' || p.status === 'preparando').length;
  const badge = document.getElementById('status-badge');
  if (!badge) return;
  if (prontos > 0) {
    badge.textContent = prontos + ' pronto' + (prontos > 1 ? 's' : '') + '!';
    badge.classList.add('visible');
  } else if (emPreparo > 0) {
    badge.textContent = emPreparo + ' em preparo';
    badge.classList.add('visible');
  } else if (pedidos.length > 0) {
    badge.textContent = '✓ tudo entregue';
    badge.classList.add('visible');
  } else {
    badge.classList.remove('visible');
  }
}

function iniciarPollingStatus() {
  if (!mesaAtiva) return;
  const statusBtn = document.getElementById('status-btn');
  if (statusBtn) statusBtn.style.display = 'flex';
  renderizarStatusPainel();
  if (statusInterval) clearInterval(statusInterval);
  statusInterval = setInterval(renderizarStatusPainel, 5000);
}

/* =====================================================
   CARDÁPIO — Dados e renderização
   ===================================================== */
const CARDAPIO = {
  burgers: [
    { id: 'bg-sonserina',  name: 'X-Tudo Sonserina',   price: 32.90, desc: 'Blend 180g, queijo defumado, maionese verde, cebola roxa e alface.' },
    { id: 'bg-fenix',      name: 'Smash Fênix',         price: 28.90, desc: 'Duplo smash 2×90g, queijo americano, molho especial e picles.' },
    { id: 'bg-grifinoria', name: 'Burguer Grifinória',  price: 30.90, desc: 'Blend 180g, bacon crocante, queijo prato, alface e tomate.' },
    { id: 'bg-pomo',       name: '🏅 Pomo de Ouro',    price: 36.90, desc: 'O burguer sazonal — especial do mês. Pergunte ao garçom!' },
  ],
  acomp: [
    { id: 'ac-batatas',    name: 'Batatas Wingardium',  price: 14.90, desc: 'Batatas fritas crocantes com tempero da casa.' },
    { id: 'ac-onion',      name: 'Onion Rings Lumos',   price: 16.90, desc: 'Anéis de cebola empanados com molho de parmesão.' },
    { id: 'ac-mista',      name: 'Porção Mista',        price: 22.90, desc: 'Batatas + onion rings para compartilhar.' },
  ],
  bebidas: [
    { id: 'be-grif',  name: 'Soda Grifinória 🦁',  price: 10.90, desc: 'Morango com baunilha — coragem em cada gole.' },
    { id: 'be-son',   name: 'Soda Sonserina 🐍',   price: 10.90, desc: 'Menta com limão — refinamento puro.' },
    { id: 'be-lufa',  name: 'Soda Lufa-Lufa 🦡',   price: 10.90, desc: 'Maracujá com gengibre — lealdade e sabor.' },
    { id: 'be-corv',  name: 'Soda Corvinal 🦅',    price: 10.90, desc: 'Mirtilo com lavanda — sabedoria e sofisticação.' },
    { id: 'be-agua',  name: 'Água Mineral',         price:  5.00, desc: 'Com ou sem gás.' },
    { id: 'be-suco',  name: 'Suco Natural',         price: 12.90, desc: 'Laranja, limão ou maracujá.' },
  ],
  sobremesas: [
    { id: 'so-brownie', name: 'Brownie Accio',       price: 15.90, desc: 'Brownie de chocolate com sorvete de baunilha.' },
    { id: 'so-waffle',  name: 'Waffle das Bruxas',   price: 17.90, desc: 'Waffle crocante com nutella e frutas vermelhas.' },
  ]
};

function mkItemHTML(item, idx) {
  return `
    <div class="scroll-item" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
      <div>
        <div class="scroll-item-num">${String(idx + 1).padStart(2, '0')}</div>
        <div class="scroll-item-name">${item.name}</div>
        <div class="scroll-item-desc">${item.desc}</div>
      </div>
      <div class="scroll-item-footer">
        <div class="scroll-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeQty(this,-1)" aria-label="Remover">−</button>
          <span class="qty-num">0</span>
          <button class="qty-btn" onclick="changeQty(this,1)" aria-label="Adicionar">+</button>
        </div>
      </div>
    </div>
  `;
}

function renderizarCardapio() {
  document.getElementById('items-burgers').innerHTML    = CARDAPIO.burgers.map(mkItemHTML).join('');
  document.getElementById('items-acomp').innerHTML      = CARDAPIO.acomp.map(mkItemHTML).join('');
  document.getElementById('items-bebidas').innerHTML    = CARDAPIO.bebidas.map(mkItemHTML).join('');
  document.getElementById('items-sobremesas').innerHTML = CARDAPIO.sobremesas.map(mkItemHTML).join('');
}

renderizarCardapio();

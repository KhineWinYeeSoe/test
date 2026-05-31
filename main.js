// ============================================
// MYANMAR HSK — MAIN JAVASCRIPT
// ============================================

// ---- STATE ----
const state = {
  cart: [],
  activeShopTab: 'flashcard',
  activePaymentMethod: 'myanmar',
  activeAppMethod: 'wave',
  currentScreen: 'home',    // app screen
  currentLevel: 1,
  currentCardIndex: 0,
  cardFlipped: false,
  showPinyin: true,
  translationLang: 'both',
  chineseChars: 'simplified',
  goalProgress: 0,
  goalTarget: 20,
};

// ---- HSK 1 SAMPLE WORDS ----
const hsk1Words = [
  { char: '爱', pinyin: 'ài', meaning: 'love; like', burmese: 'ချစ်သည် / ဝါသနာပါသည်', sentences: ['我爱你。(I love you.)', '他爱学习。(He loves studying.)'] },
  { char: '八', pinyin: 'bā', meaning: 'eight', burmese: 'ရှစ်', sentences: ['八月。(August.)', '我有八本书。(I have eight books.)'] },
  { char: '爸爸', pinyin: 'bàba', meaning: 'dad; father', burmese: 'ဖေဖေ', sentences: ['我爸爸很高。(My dad is very tall.)'] },
  { char: '杯子', pinyin: 'bēizi', meaning: 'cup; glass', burmese: 'ခွက်', sentences: ['这个杯子很漂亮。(This cup is beautiful.)'] },
  { char: '北京', pinyin: 'Běijīng', meaning: 'Beijing', burmese: 'ပေကျင်း', sentences: ['北京是首都。(Beijing is the capital.)'] },
  { char: '本', pinyin: 'běn', meaning: 'measure word for books', burmese: 'အတွက် (စာအုပ်)', sentences: ['一本书。(One book.)'] },
  { char: '不客气', pinyin: 'bú kèqi', meaning: "you're welcome", burmese: 'ကျေးဇူးမတင်ပါနဲ့', sentences: ['不客气！(You\'re welcome!)'] },
  { char: '不', pinyin: 'bù', meaning: 'no; not', burmese: 'မဟုတ်; မ', sentences: ['我不去。(I\'m not going.)'] },
  { char: '菜', pinyin: 'cài', meaning: 'dish; vegetable', burmese: 'ဟင်းလျာ; ဟင်းသီးဟင်းရွက်', sentences: ['这道菜很好吃。(This dish is delicious.)'] },
  { char: '茶', pinyin: 'chá', meaning: 'tea', burmese: 'လက်ဖက်ရည်', sentences: ['我喜欢喝茶。(I like drinking tea.)'] },
];

const levelData = [
  { level: 1, name: 'HSK 1', tag: 'BEGINNER', total: 300, mastered: 300, color: '#2563eb' },
  { level: 2, name: 'HSK 2', tag: 'ELEMENTARY', total: 200, mastered: 0, color: '#16a34a' },
  { level: 3, name: 'HSK 3', tag: 'ELEMENTARY', total: 500, mastered: 0, color: '#1e40af' },
  { level: 4, name: 'HSK 4', tag: 'INTERMEDIATE', total: 1000, mastered: 0, color: '#dc2626' },
  { level: 5, name: 'HSK 5', tag: 'UPPER-INTERMEDIATE', total: 1600, mastered: 0, color: '#7c3aed' },
  { level: 6, name: 'HSK 6', tag: 'ADVANCED', total: 1800, mastered: 0, color: '#2563eb' },
  { level: 7, name: 'HSK 7', tag: 'MASTERY', total: 2000, mastered: 0, color: '#1e1b4b' },
  { level: 8, name: 'HSK 8', tag: 'MASTERY', total: 2500, mastered: 0, color: '#1e1b4b' },
  { level: 9, name: 'HSK 9', tag: 'MASTERY', total: 900, mastered: 0, color: '#1e1b4b' },
];

// ============================================
// PAGE NAVIGATION
// ============================================
function showPage(pageId) {
  document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) { page.classList.add('active'); window.scrollTo(0, 0); }
}

// ============================================
// MODAL
// ============================================
function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const openBtns = document.querySelectorAll('[data-open-modal]');
  const closeBtns = document.querySelectorAll('[data-close-modal]');

  openBtns.forEach(btn => btn.addEventListener('click', () => overlay.classList.add('open')));
  closeBtns.forEach(btn => btn.addEventListener('click', () => overlay.classList.remove('open')));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });

  // Tabs
  document.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.getElementById('signinForm').classList.toggle('hidden', target !== 'signin');
      document.getElementById('createForm').classList.toggle('hidden', target !== 'create');
    });
  });

  // Switch links
  document.getElementById('switchToCreate')?.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.modal-tab')[1].click();
  });
  document.getElementById('switchToSignin')?.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.modal-tab')[0].click();
  });

  // Toggle keep
  ['toggleKeep', 'toggleKeep2'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', () => {
      el.classList.toggle('off');
      el.textContent = el.classList.contains('off') ? 'Off' : 'On';
    });
  });
}

// ============================================
// LANGUAGE TOGGLE
// ============================================
function initLangToggle() {
  const btn = document.getElementById('langToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    btn.textContent = btn.textContent === 'EN' ? 'မြ' : 'EN';
  });
}

// ============================================
// SHOP PAGE
// ============================================
function initShop() {
  // Tab switching
  document.querySelectorAll('.product-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.product-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.activeShopTab = tab.dataset.product;
      renderShopContent();
    });
  });

  renderShopContent();
  renderCart();
}

function renderShopContent() {
  const container = document.getElementById('shopProductContent');
  if (!container) return;

  if (state.activeShopTab === 'flashcard') {
    container.innerHTML = `
      <div class="info-banner">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <div>
          <h4>Free HSK 1 — one-time unlock for HSK 2–9</h4>
          <p>Try HSK 1 totally free, then unlock all of HSK 2–9 with the full bundle. Single levels, the HSK 2–6 bundle, or the full HSK 2–9 bundle — pick what fits. Tied to your account so you keep access on every device.</p>
        </div>
      </div>
      <div class="bundles-row">
        <div class="bundle-card" onclick="addBundle('hsk26', 18000)">
          <div class="bundle-label">HSK 2–6 BUNDLE</div>
          <div><span class="bundle-price-main">18,000</span><span class="bundle-price-sub">MMK · 150 THB</span></div>
          <div class="bundle-old">45,000 MMK</div>
          <div class="bundle-save">Save 27,000 MMK</div>
          <div class="bundle-desc">5 levels (HSK 2 through 6) — 5,400 words.</div>
        </div>
        <div class="bundle-card" onclick="addBundle('hsk79', 18000)">
          <div class="bundle-label teal">HSK 7–9 ADVANCED</div>
          <div><span class="bundle-price-main">18,000</span><span class="bundle-price-sub">MMK · 150 THB</span></div>
          <div class="bundle-old">27,000 MMK</div>
          <div class="bundle-save">Save 9,000 MMK</div>
          <div class="bundle-desc">3 advanced levels (HSK 7 through 9) — 5,600 words.</div>
        </div>
        <div class="bundle-card best-value" onclick="addBundle('hsk29', 23000)">
          <div class="best-value-badge">⭐ BEST VALUE</div>
          <div class="bundle-label gold">HSK 2–9 FULL BUNDLE</div>
          <div><span class="bundle-price-main">23,000</span><span class="bundle-price-sub">MMK · 190 THB</span></div>
          <div class="bundle-old">72,000 MMK</div>
          <div class="bundle-save">Save 49,000 MMK</div>
          <div class="bundle-desc">8 levels (HSK 2 through 9) — 11,000 words, advanced HSK 3.0 deck.</div>
        </div>
      </div>
      <a class="demo-link" href="#" onclick="launchApp(); return false;">Try the free demo ↗</a>
      <div class="single-level-section">
        <div class="single-level-header">
          <h3>Or buy a single level</h3>
          <span class="single-level-badge">Single level</span>
        </div>
        <p class="single-level-sub">9,000 MMK / 75 THB per HSK level. Pick only the ones you need.</p>
        <div class="level-items-grid">
          ${[2,3,4,5,6,7,8,9].map(n => `
            <div class="level-item" id="level-item-${n}" onclick="toggleLevel(${n})">
              <span class="level-name">
                <span>+ HSK ${n} Flashcards</span>
              </span>
              <span class="level-price">9,000 MMK · 75 THB</span>
            </div>
          `).join('')}
        </div>
      </div>`;

  } else if (state.activeShopTab === 'grammar') {
    container.innerHTML = `
      <div class="info-banner" style="background:#fff8f0; border-color:#fed7aa;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        <div>
          <h4>Bundle (Levels 1-4) — 60,000 MMK</h4>
          <p>500 THB &nbsp;·&nbsp; <span style="color:#6b7280;text-decoration:line-through">60,000 MMK</span> &nbsp; <span style="color:#16a34a;font-weight:600">Coming Soon</span></p>
        </div>
        <button class="btn-coming-soon" style="margin-left:auto; white-space:nowrap">🔒 Coming Soon</button>
      </div>
      <p style="font-size:14px;font-weight:700;color:#1e1b4b;margin-bottom:14px">Individual Books</p>
      <div class="books-grid">
        ${[1,2,3,4].map(n => `
          <div class="book-card">
            <div class="book-card-header">
              <span class="book-title">HSK ${n} Grammar</span>
              <button class="book-preview" title="Preview">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <div class="book-price">18,000 MMK</div>
            <div class="book-thb">150 THB</div>
            ${n === 1 ? `<button class="btn-add-cart" onclick="addGrammarBook(${n})">+ Add to Cart</button>` : `<button class="btn-coming-soon">🔒 Coming Soon</button>`}
          </div>
        `).join('')}
      </div>`;

  } else if (state.activeShopTab === 'vocab') {
    container.innerHTML = `
      <div class="info-banner" style="background:#f0fff8; border-color:#a7f3d0;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
        <div>
          <h4>For price comparison only</h4>
          <p>These vocabulary e-books are shown so you can compare. The Madmi Flashcard app covers the same words with native audio, quizzes, and offline study — better value for the price.</p>
          <button class="btn-primary" style="margin-top:10px;font-size:13px;padding:8px 16px" onclick="switchToFlashcardTab()">⭐ See Madmi Flashcard</button>
        </div>
      </div>
      <div class="info-banner">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
        <div>
          <h4>Bundle (Levels 1-6) — <del style="color:#9ca3af;font-weight:400">54,000 MMK</del> <span style="color:#7c3aed">40,000 MMK</span></h4>
          <p>450 THB → 333 THB &nbsp;·&nbsp; Save 14,000 MMK</p>
        </div>
        <button class="btn-coming-soon" style="margin-left:auto; white-space:nowrap">🔒 Comparison only</button>
      </div>
      <p style="font-size:14px;font-weight:700;color:#1e1b4b;margin:18px 0 14px">Individual Books</p>
      <div class="books-grid">
        ${[1,2,3,4,5,6].map(n => `
          <div class="book-card">
            <div class="book-card-header">
              <span class="book-title">HSK ${n} Vocabulary</span>
              <button class="book-preview" title="Preview">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <div class="book-price">9,000 MMK</div>
            <div class="book-thb">75 THB</div>
            <button class="btn-coming-soon">🔒 Comparison only</button>
          </div>
        `).join('')}
      </div>`;
  }
}

function switchToFlashcardTab() {
  document.querySelector('[data-product="flashcard"]').click();
}

function addBundle(id, price) {
  const names = { hsk26: 'HSK 2–6 Bundle', hsk79: 'HSK 7–9 Advanced', hsk29: 'HSK 2–9 Full Bundle' };
  const thb = { hsk26: 150, hsk79: 150, hsk29: 190 };
  if (state.cart.find(i => i.id === id)) return;
  state.cart.push({ id, name: 'Flashcard Premium', sub: names[id], price, thb: thb[id] });
  renderCart();
  showToast('Added to cart!');
}

function toggleLevel(n) {
  const el = document.getElementById(`level-item-${n}`);
  const id = `level-hsk${n}`;
  const existing = state.cart.findIndex(i => i.id === id);
  if (existing > -1) {
    state.cart.splice(existing, 1);
    el.classList.remove('selected');
    el.querySelector('.level-name').innerHTML = `<span>+ HSK ${n} Flashcards</span>`;
  } else {
    state.cart.push({ id, name: 'Flashcard Premium', sub: `HSK ${n} Flashcards`, price: 9000, thb: 75 });
    el.classList.add('selected');
    el.querySelector('.level-name').innerHTML = `<svg class="level-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg><span>HSK ${n} Flashcards</span>`;
    showToast('Added to cart!');
  }
  renderCart();
}

function addGrammarBook(n) {
  const id = `grammar-hsk${n}`;
  if (state.cart.find(i => i.id === id)) return;
  state.cart.push({ id, name: 'HSK Grammar Book', sub: `HSK ${n} Grammar`, price: 18000, thb: 150 });
  renderCart();
  showToast('Added to cart!');
}

function renderCart() {
  const el = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const totalThbEl = document.getElementById('cartTotalThb');
  const countEl = document.getElementById('cartCount');
  const proceedBtn = document.getElementById('proceedBtn');
  if (!el) return;

  if (state.cart.length === 0) {
    el.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
    if (totalEl) totalEl.textContent = '0 MMK';
    if (countEl) countEl.textContent = '0 items selected';
    if (proceedBtn) proceedBtn.disabled = true;
    return;
  }

  el.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-sub">${item.sub}</div>
      </div>
      <div class="cart-item-price">
        ${item.price.toLocaleString()} MMK
        <div class="cart-item-price-sub">${item.thb} THB</div>
      </div>
    </div>
  `).join('');

  const total = state.cart.reduce((s, i) => s + i.price, 0);
  const totalThb = state.cart.reduce((s, i) => s + i.thb, 0);
  if (totalEl) totalEl.textContent = `Total: ${total.toLocaleString()} MMK`;
  if (totalThbEl) totalThbEl.textContent = `${totalThb} THB`;
  if (countEl) countEl.textContent = `${state.cart.length} item${state.cart.length > 1 ? 's' : ''} selected`;
  if (proceedBtn) proceedBtn.disabled = false;
}

function clearCart() {
  state.cart = [];
  // deselect all level items
  document.querySelectorAll('.level-item.selected').forEach(el => {
    el.classList.remove('selected');
    const n = el.id.replace('level-item-', '');
    el.querySelector('.level-name').innerHTML = `<span>+ HSK ${n} Flashcards</span>`;
  });
  renderCart();
}

// ============================================
// PAYMENT PAGE
// ============================================
function initPayment() {
  renderPaymentSummary();

  document.querySelectorAll('.payment-method-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.activePaymentMethod = card.dataset.method;
      renderAppMethods();
    });
  });
}

function renderPaymentSummary() {
  const el = document.getElementById('paymentOrderItems');
  const totalEl = document.getElementById('paymentTotal');
  const totalThbEl = document.getElementById('paymentTotalThb');
  if (!el) return;

  if (state.cart.length === 0) {
    el.innerHTML = '<p style="color:#9ca3af;font-size:14px">No items in cart</p>';
    return;
  }

  el.innerHTML = state.cart.map(item => `
    <div class="order-row">
      <span class="order-item-name">${item.sub}</span>
      <div class="order-item-price">
        ${item.price.toLocaleString()} MMK
        <div class="order-item-price-sub">${item.thb} THB</div>
      </div>
    </div>
  `).join('');

  const total = state.cart.reduce((s, i) => s + i.price, 0);
  const totalThb = state.cart.reduce((s, i) => s + i.thb, 0);
  if (totalEl) totalEl.textContent = `${total.toLocaleString()} MMK`;
  if (totalThbEl) totalThbEl.textContent = `${totalThb} THB`;
}

function renderAppMethods() {
  const section = document.getElementById('myanmarAppsSection');
  if (!section) return;
  section.style.display = state.activePaymentMethod === 'myanmar' ? 'block' : 'none';
}

// ============================================
// FLASHCARD APP
// ============================================
function launchApp() {
  showPage('appPage');
  initApp();
}

function initApp() {
  renderLevels();
  renderProgress();
  renderGoal();
  renderSettings();
  switchAppScreen('home');

  document.querySelectorAll('.bnav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bnav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      switchAppScreen(btn.dataset.screen);
    });
  });
}

function switchAppScreen(screen) {
  state.currentScreen = screen;
  document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(`appScreen-${screen}`);
  if (el) el.classList.add('active');
}

function renderGoal() {
  const pct = Math.round((state.goalProgress / state.goalTarget) * 100);
  const bar = document.getElementById('goalBar');
  const pctEl = document.getElementById('goalPct');
  if (bar) bar.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '% Completed';
}

function renderLevels() {
  const el = document.getElementById('levelsList');
  if (!el) return;
  el.innerHTML = levelData.map(l => `
    <div class="level-list-item" onclick="openLevel(${l.level})">
      <div class="level-badge l${l.level}" style="background:${l.color}">${l.level}</div>
      <div class="level-info">
        <h4>${l.name}</h4>
        <p>${l.total.toLocaleString()} vocabulary words</p>
        <div class="level-mini-bar">
          <div class="level-mini-bar-fill" style="width:${Math.round(l.mastered/l.total*100)}%"></div>
        </div>
        <div class="level-progress-text">${l.mastered} / ${l.total}</div>
      </div>
    </div>
  `).join('');
}

function openLevel(n) {
  state.currentLevel = n;
  const lvl = levelData.find(l => l.level === n);
  const screen = document.getElementById('appScreen-levelDetail');
  if (!screen) return;

  screen.querySelector('.level-detail-tag').textContent = lvl.tag;
  screen.querySelector('.level-detail-title').textContent = lvl.name;
  screen.querySelector('.level-detail-sub').textContent = `${lvl.total.toLocaleString()} vocabulary words`;
  const pct = Math.round(lvl.mastered / lvl.total * 100);
  screen.querySelector('.level-detail-bar-fill').style.width = pct + '%';
  screen.querySelector('.level-detail-mastered').textContent = `${lvl.mastered} mastered`;
  screen.querySelector('.level-detail-banner').style.background = `linear-gradient(135deg, ${lvl.color}, ${lvl.color}cc)`;

  // Word list
  const wordList = screen.querySelector('#levelWordList');
  if (wordList) {
    const words = n === 1 ? hsk1Words : [];
    wordList.innerHTML = words.length
      ? words.map(w => `
        <div class="word-item" onclick="startFlashcards(${n})">
          <span class="word-char">${w.char}</span>
          <div class="word-info">
            <div class="word-pinyin">${w.pinyin}</div>
            <div class="word-meaning">${w.meaning}</div>
            <div class="word-burmese">${w.burmese}</div>
          </div>
          ${lvl.mastered > 0 ? `<svg class="word-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
        </div>
      `).join('')
      : '<p style="color:#9ca3af;padding:16px 0;text-align:center;font-size:14px">Unlock this level to browse words</p>';
  }

  document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
}

function startFlashcards(level) {
  state.currentLevel = level;
  state.currentCardIndex = 0;
  state.cardFlipped = false;
  renderFlashcard();

  document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
  document.getElementById('appScreen-flashcard').classList.add('active');
}

function renderFlashcard() {
  const words = state.currentLevel === 1 ? hsk1Words : [{ char: '?', pinyin: '?', meaning: 'Unlock this level', burmese: 'ဤအဆင့်ကို သော့ဖွင့်ပါ', sentences: [] }];
  const word = words[state.currentCardIndex % words.length];
  const total = state.currentLevel === 1 ? 300 : levelData.find(l => l.level === state.currentLevel)?.total || 300;
  const idx = state.currentCardIndex + 1;

  const progressFill = document.getElementById('flashcardProgressFill');
  const progressCount = document.getElementById('flashcardProgressCount');
  if (progressFill) progressFill.style.width = (idx / total * 100) + '%';
  if (progressCount) progressCount.textContent = `${idx}/${total}`;

  const front = document.getElementById('flashcardFront');
  const back = document.getElementById('flashcardBack');
  const card = document.getElementById('flashcardCard');

  if (front) front.innerHTML = `
    <span class="flashcard-tag">HSK ${state.currentLevel} · #${idx}</span>
    <div class="flashcard-char">${word.char}</div>
    ${state.showPinyin ? `<div class="flashcard-pinyin">${word.pinyin}</div>` : ''}
    <button class="flashcard-audio-btn" onclick="event.stopPropagation(); playAudio('${word.pinyin}')">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
    </button>
  `;

  if (back) back.innerHTML = `
    <span class="flashcard-tag">HSK ${state.currentLevel} · #${idx}</span>
    <div class="flashcard-char">${word.char}</div>
    <div class="flashcard-pinyin">${word.pinyin}</div>
    <div class="flashcard-meaning">${word.meaning}</div>
    <div class="flashcard-burmese">${word.burmese}</div>
    ${word.sentences.length ? `
      <div class="flashcard-sentences">
        ${word.sentences.map(s => `<div class="flashcard-sentence">${s}</div>`).join('')}
      </div>
    ` : ''}
  `;

  if (card) {
    card.classList.remove('flipped');
    state.cardFlipped = false;
  }
}

function flipCard() {
  const card = document.getElementById('flashcardCard');
  if (!card) return;
  state.cardFlipped = !state.cardFlipped;
  card.classList.toggle('flipped', state.cardFlipped);
}

function nextCard(correct) {
  const words = state.currentLevel === 1 ? hsk1Words : [{}];
  if (correct) {
    state.goalProgress = Math.min(state.goalTarget, state.goalProgress + 1);
    renderGoal();
  }
  state.currentCardIndex = (state.currentCardIndex + 1) % words.length;
  renderFlashcard();
}

function skipCard() {
  nextCard(false);
}

function playAudio(pinyin) {
  showToast('🔊 Playing: ' + pinyin);
}

function renderProgress() {
  const el = document.getElementById('progressLevelList');
  if (!el) return;
  el.innerHTML = levelData.map(l => `
    <div class="progress-level-item">
      <div class="level-badge l${l.level}" style="background:${l.color};width:36px;height:36px;font-size:14px">${l.level}</div>
      <div class="progress-level-info">
        <div class="progress-level-row">
          <span class="progress-level-name">${l.name}</span>
          <span class="progress-level-count">${l.mastered} / ${l.total}</span>
        </div>
        <div class="progress-level-bar">
          <div class="progress-level-fill" style="width:${Math.round(l.mastered/l.total*100)}%;background:${l.color}"></div>
        </div>
      </div>
    </div>
  `).join('');

  // Update ring
  const totalMastered = levelData.reduce((s, l) => s + l.mastered, 0);
  const totalWords = levelData.reduce((s, l) => s + l.total, 0);
  const pct = Math.round(totalMastered / totalWords * 100);
  const ring = document.getElementById('progressRingFill');
  if (ring) {
    const circumference = 220;
    ring.style.strokeDashoffset = circumference - (circumference * pct / 100);
  }
  const pctEl = document.getElementById('progressRingPct');
  if (pctEl) pctEl.textContent = pct + '%';
  const numEl = document.getElementById('progressMasteredNum');
  if (numEl) numEl.innerHTML = `${totalMastered.toLocaleString()} <span>/ ${totalWords.toLocaleString()}</span>`;
}

function renderSettings() {
  // Settings are static, just toggle interactions handled elsewhere
}

// ============================================
// TOAST
// ============================================
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:#1e1b4b;color:#fff;padding:10px 20px;border-radius:24px;font-size:13px;font-weight:600;z-index:9999;transition:all .3s;opacity:0;pointer-events:none;white-space:nowrap;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2200);
}

// ============================================
// SETTINGS INTERACTIONS
// ============================================
function initSettingsApp() {
  // Toggle pinyin
  const pinyinToggle = document.getElementById('pinyinToggle');
  if (pinyinToggle) {
    pinyinToggle.addEventListener('click', () => {
      pinyinToggle.classList.toggle('off');
      state.showPinyin = !pinyinToggle.classList.contains('off');
    });
  }

  // Translation language pills
  document.querySelectorAll('[data-lang]').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('[data-lang]').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      state.translationLang = pill.dataset.lang;
    });
  });

  // Chinese character pills
  document.querySelectorAll('[data-chars]').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('[data-chars]').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      state.chineseChars = pill.dataset.chars;
    });
  });
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Page sections default
  document.querySelectorAll('.page-section').forEach((p, i) => {
    if (i === 0) p.classList.add('active');
  });

  initModal();
  initLangToggle();
  initShop();

  // Smooth scroll for in-page anchor buttons
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
});

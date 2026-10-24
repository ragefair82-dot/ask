/* ===== АСК — логика сайта ===== */
(function () {
  'use strict';

  /* ---------- Утилиты ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const formatPrice = (num) =>
    new Intl.NumberFormat('ru-RU').format(Math.round(num)) + ' ₽';

  /* ============================================================
     1. Тёмная тема — запоминаем выбор в localStorage
     ============================================================ */
  const themeToggle = $('#theme-toggle');
  const THEME_KEY = 'ask-theme';

  function applyTheme(theme) {
    // Тёмная тема = чекбокс НЕ отмечен (светлая активируется :has(:checked))
    themeToggle.checked = theme === 'light';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }

  (function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (saved === 'light' || saved === 'dark') {
      applyTheme(saved);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      applyTheme('light');
    } else {
      applyTheme('dark');
    }
  })();

  themeToggle.addEventListener('change', () => {
    applyTheme(themeToggle.checked ? 'light' : 'dark');
  });

  /* ============================================================
     2. Мобильное меню — закрываем при клике по ссылке
     ============================================================ */
  const menuToggle = $('#menu-toggle');
  $$('.mobile-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.checked = false;
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuToggle.checked) menuToggle.checked = false;
  });

  /* ============================================================
     3. Переключение языка (RU / EN)
     ============================================================ */
  const I18N = {
    ru: {}, // русский — исходный текст в разметке
    en: {
      'nav.about': 'About',
      'nav.advantages': 'Advantages',
      'nav.gallery': 'Projects',
      'nav.calc': 'Calculator',
      'nav.faq': 'FAQ',
      'nav.contacts': 'Contacts',
      'cta.calc': 'Calculate cost',
      'hero.tag': 'Production in Moscow · since 2011',
      'hero.title': 'Furniture you will <span>never forget</span>',
      'hero.sub': 'Kitchens, wardrobes, walk-in closets and hallways made to your size. Own production, premium hardware and a 5-year warranty — no middleman markups.',
      'hero.projects': 'View projects',
      'hero.stat1': 'years in business',
      'hero.stat2': 'completed projects',
      'hero.stat3': 'warranty on all furniture',
      'about.eyebrow': '01 · About us',
      'about.title': 'A workshop where furniture is <em>craft</em>',
      'about.badge': 'Since 2011',
      'about.badgeSmall': 'we make furniture by hand',
      'about.p1': 'ASK started in a garage with a single machine and the desire to make furniture the way big salons do not: exact to size, from honest materials and without compromising on details. Today it is a 2,400 m² production facility with its own CNC machines.',
      'about.p2': 'We design, cut, paint and assemble everything ourselves. That is why we are responsible for every millimetre: from the first measurement to the final hinge adjustment. No subcontractors — only our team of 38 craftsmen.',
      'about.p3': 'We work with Egger chipboard, MDF enamel, veneer and solid wood. Hardware — Blum, Hettich and Hafele: drawers close softly and last for decades.',
      'about.fact1': 'craftsmen on staff',
      'about.fact2': 'average production time',
      'about.fact3': 'of clients recommend us',
      'about.founder': 'Alexey Sergeev',
      'about.founderRole': 'Founder and chief technologist',
      'adv.eyebrow': '02 · Advantages',
      'adv.title': 'Why choose <em>ASK</em>',
      'adv.1t': 'Own production',
      'adv.1p': 'A 2,400 m² workshop, HOMAG and Biesse machines. We control quality at every stage and do not overpay intermediaries.',
      'adv.2t': 'Individual project',
      'adv.2p': '3D visualization before work begins. We fit every shelf to your things, appliances and habits.',
      'adv.3t': 'Exact deadlines',
      'adv.3p': 'The deadline is fixed in the contract. For each day of delay we return 0.5% of the order value.',
      'adv.4t': '5-year warranty',
      'adv.4p': 'Official warranty on the body, facades and assembly. We fix any defect caused by us free of charge.',
      'adv.5t': 'Premium hardware',
      'adv.5p': 'Blum, Hettich, Hafele and Salice: soft closing, up to 70 kg per drawer, service life from 20 years.',
      'adv.6t': 'Free measurement',
      'adv.6p': 'A measurer will arrive at a convenient time within 24 hours, take measurements and suggest solutions on site.',
      'gal.eyebrow': '03 · Projects',
      'gal.title': 'Our <em>works</em>',
      'gal.all': 'All',
      'gal.kitchens': 'Kitchens',
      'gal.wardrobes': 'Wardrobes',
      'gal.cloakrooms': 'Walk-in closets',
      'gal.hallways': 'Hallways',
      'gal.sort': 'Sort:',
      'gal.sortPopular': 'By popularity',
      'gal.sortPriceAsc': 'By price ↑',
      'gal.sortPriceDesc': 'By price ↓',
      'gal.sortNew': 'Newest',
      'gal.empty': 'Nothing found — try another category or query.',
      'gal.p1mat': 'MDF enamel, quartz worktop',
      'gal.p2mat': 'Egger chipboard, mirror, black profile',
      'gal.p3mat': 'Oak veneer, LED lighting',
      'gal.p4mat': 'Chipboard, MDF, bench with drawer',
      'gal.p5mat': 'Matte enamel, ash solid wood',
      'gal.p6mat': 'Veneer, floor-to-ceiling hinged facades',
      'gal.p7mat': 'MDF, glass, brass hardware',
      'gal.p8mat': 'Chipboard, hidden handles',
      'calc.eyebrow': '04 · Calculator',
      'calc.title': 'Find out the <em>cost</em> in a minute',
      'calc.type': 'Furniture type',
      'calc.typeKitchen': 'Kitchen',
      'calc.typeWardrobe': 'Sliding wardrobe',
      'calc.typeCloakroom': 'Walk-in closet',
      'calc.typeHallway': 'Hallway',
      'calc.typeTable': 'Table',
      'calc.typeCabinet': 'Cabinet',
      'calc.dims': 'Dimensions <small>(in centimetres)</small>',
      'calc.len': 'Length',
      'calc.wid': 'Width',
      'calc.hei': 'Height',
      'calc.material': 'Body and facade material',
      'calc.matBase': 'base',
      'calc.options': 'Additional options',
      'calc.totalLabel': 'Preliminary cost',
      'calc.note': 'The exact calculation is made after a free measurement and project approval.',
      'calc.sumType': 'Type',
      'calc.sumMat': 'Material',
      'calc.sumTerm': 'Production time',
      'calc.sumTermVal': '21–28 days',
      'calc.sumWarranty': 'Warranty',
      'calc.sumWarrantyVal': '5 years',
      'calc.order': 'Leave a request',
      'faq.eyebrow': '05 · Questions',
      'faq.title': 'Frequent <em>questions</em>',
      'faq.q1': 'How long does production take?',
      'faq.a1': 'On average from 21 to 35 working days from signing the contract. The time depends on the complexity of the project and the material: a chipboard wardrobe is made faster, a kitchen with enamel facades takes longer. The exact date is fixed in the contract.',
      'faq.q2': 'How is the measurement done and how much does it cost?',
      'faq.a2': 'The measurement is completely free and obliges you to nothing. A specialist arrives within 24 hours after the request, takes measurements, photographs the room and suggests the optimal layout. In 2–3 days you receive a 3D project and an estimate.',
      'faq.q3': 'What hardware is used in the furniture?',
      'faq.a3': 'We work only with proven brands: Blum, Hettich, Hafele and Salice. Hinges and slides with soft closers are rated for 200,000 opening cycles. If you want, we can select budget hardware — but by default we install premium.',
      'faq.q4': 'What does the 5-year warranty cover?',
      'faq.a4': 'The warranty covers the body, facades, hardware and assembly. If a defect not caused by you appears within 5 years, we will come and fix it free of charge. Warranty terms are written in the contract, not in small print.',
      'faq.q5': 'How is the order paid?',
      'faq.a5': '50% prepayment when signing the contract, the rest after delivery and assembly, when you accept the work. Interest-free instalments for 12 months through partner banks are possible. Payment by card, transfer or invoice for legal entities.',
      'faq.q6': 'Do you deliver and assemble furniture?',
      'faq.a6': 'Yes, delivery in Moscow and the region is included in the price for orders from 100,000 ₽. Assembly is done by our fitters, not third-party teams. After installation we clean up and adjust all facades and drawers.',
      'contacts.eyebrow': '06 · Contacts',
      'contacts.title': "Let's <em>discuss</em> your project",
      'contacts.addr': 'Showroom address',
      'contacts.addrVal': 'Moscow, Promyshlennaya st., 14, bldg. 2',
      'contacts.phone': 'Phone',
      'contacts.email': 'Email',
      'contacts.hours': 'Working hours',
      'contacts.hoursVal': 'Mon–Sat: 9:00–20:00 · Sun: 10:00–18:00',
      'contacts.map': 'Promyshlennaya st., 14b2 · 7 minutes walk from Tekhnopark metro',
      'form.title': 'Leave a request',
      'form.sub': 'We will call back within 15 minutes during working hours.',
      'form.name': 'Your name',
      'form.tel': 'Phone',
      'form.msg': 'Comment',
      'form.agree': 'I agree to the processing of personal data and to the <a href="#privacy">privacy policy</a>',
      'form.send': 'Send request',
      'footer.about': 'Custom-made case furniture. We design, produce and assemble — kitchens, wardrobes, walk-in closets and hallways with a 5-year warranty.',
      'footer.sections': 'Sections',
      'footer.products': 'Products',
      'footer.clients': 'For clients',
      'footer.measure': 'Free measurement',
      'footer.warranty': 'Warranty',
      'footer.copy': '© 2025 ASK. All rights reserved.',
      'footer.privacy': 'Privacy policy'
    }
  };

  // Сохраняем исходные тексты для возврата на RU
  const ruCache = new Map();
  $$('[data-i18n], [data-i18n-html]').forEach((el) => {
    const key = el.dataset.i18n || el.dataset.i18nHtml;
    if (!key) return;
    if (el.dataset.i18nHtml !== undefined) {
      ruCache.set(key, { type: 'html', value: el.innerHTML });
    } else {
      ruCache.set(key, { type: 'text', value: el.textContent });
    }
  });

  function setLang(lang) {
    const dict = I18N[lang] || {};
    $$('[data-i18n], [data-i18n-html]').forEach((el) => {
      const key = el.dataset.i18n || el.dataset.i18nHtml;
      if (!key) return;
      const isHtml = el.dataset.i18nHtml !== undefined;
      if (lang === 'ru') {
        const cached = ruCache.get(key);
        if (cached) {
          if (cached.type === 'html') el.innerHTML = cached.value;
          else el.textContent = cached.value;
        }
        return;
      }
      const val = dict[key];
      if (val === undefined) return;
      if (isHtml) el.innerHTML = val;
      else el.textContent = val;
    });

    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;

    $$('.lang a[data-lang-btn]').forEach((a) => {
      const on = a.dataset.langBtn === lang;
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });

    try { localStorage.setItem('ask-lang', lang); } catch (e) {}
    // Пересчитать калькулятор, т.к. подписи материала могли смениться
    updateCalculator(true);
  }

  $$('.lang a[data-lang-btn]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      setLang(a.dataset.langBtn);
    });
  });

  (function initLang() {
    let saved = null;
    try { saved = localStorage.getItem('ask-lang'); } catch (e) {}
    if (saved === 'en') setLang('en');
    else setLang('ru');
  })();

  /* ============================================================
     4. Галерея: фильтр + сортировка
     ============================================================ */
  const galGrid = $('#gal-grid');
  const galEmpty = $('#gal-empty');
  const chips = $$('.chip[data-filter]');
  const sortSelect = $('#sort');
  let activeFilter = 'all';

  function getCards() {
    return $$('.proj', galGrid);
  }

  function applyGallery() {
    const cards = getCards();
    const sort = sortSelect ? sortSelect.value : 'popular';

    // Сортировка
    const sorted = cards.slice().sort((a, b) => {
      const pa = Number(a.dataset.price || 0);
      const pb = Number(b.dataset.price || 0);
      const popA = Number(a.dataset.popularity || 0);
      const popB = Number(b.dataset.popularity || 0);
      const dateA = a.dataset.date || '';
      const dateB = b.dataset.date || '';
      switch (sort) {
        case 'price-asc': return pa - pb;
        case 'price-desc': return pb - pa;
        case 'new': return dateB.localeCompare(dateA);
        case 'popular':
        default: return popB - popA;
      }
    });

    // Переставляем в DOM
    sorted.forEach((card) => galGrid.appendChild(card));

    // Фильтрация
    let visible = 0;
    sorted.forEach((card) => {
      const match = activeFilter === 'all' || card.dataset.category === activeFilter;
      card.hidden = !match;
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    if (galEmpty) galEmpty.hidden = visible !== 0;
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => {
        c.classList.remove('on');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('on');
      chip.setAttribute('aria-pressed', 'true');
      activeFilter = chip.dataset.filter;
      applyGallery();
    });
  });

  if (sortSelect) sortSelect.addEventListener('change', applyGallery);
  applyGallery();

  /* ============================================================
     5. Поиск по проектам (оверлей)
     ============================================================ */
  const searchOverlay = $('#search-overlay');
  const searchOpenBtn = $('#search-open');
  const searchCloseBtn = $('#search-close');
  const searchInput = $('#search-input');
  const searchResults = $('#search-results');

  const PROJECTS = getCards().map((card) => {
    const img = $('img', card);
    const title = $('h3', card) ? $('h3', card).textContent.trim() : '';
    const mat = $('.mat', card) ? $('.mat', card).textContent.trim() : '';
    const price = $('.price', card) ? $('.price', card).textContent.trim() : '';
    const href = $('.pic', card) ? $('.pic', card).getAttribute('href') : '#gallery';
    const cat = $('.cat', card) ? $('.cat', card).textContent.trim() : '';
    return {
      title,
      mat,
      price,
      href,
      cat,
      img: img ? img.getAttribute('src') : '',
      search: ((card.dataset.search || '') + ' ' + title + ' ' + mat + ' ' + price + ' ' + cat).toLowerCase()
    };
  });

  function openSearch() {
    searchOverlay.hidden = false;
    // даём кадр на анимацию
    requestAnimationFrame(() => searchOverlay.classList.add('open'));
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput && searchInput.focus(), 80);
    renderSearch(searchInput ? searchInput.value : '');
  }
  function closeSearch() {
    searchOverlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { searchOverlay.hidden = true; }, 300);
  }

  function renderSearch(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) {
      searchResults.innerHTML = '<p class="search-hint">Начните вводить запрос — например, «кухня», «дуб» или «389».</p>';
      return;
    }
    const found = PROJECTS.filter((p) => p.search.includes(q));
    if (!found.length) {
      searchResults.innerHTML = '<p class="search-none">Ничего не найдено. Попробуйте «кухня», «шкаф», «шпон» или цену.</p>';
      return;
    }
    searchResults.innerHTML = found.map((p) => `
      <a class="search-result" href="${p.href}" data-result-link>
        <img src="${p.img}" alt="" loading="lazy">
        <span class="sr-info">
          <b>${p.title}</b>
          <span>${p.cat}${p.mat ? ' · ' + p.mat : ''}</span>
        </span>
        <span class="sr-price">${p.price}</span>
      </a>
    `).join('');
  }

  if (searchOpenBtn) searchOpenBtn.addEventListener('click', (e) => { e.preventDefault(); openSearch(); });
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
  if (searchOverlay) {
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) closeSearch();
    });
    searchResults.addEventListener('click', (e) => {
      const link = e.target.closest('[data-result-link]');
      if (link) {
        closeSearch();
      }
    });
  }
  if (searchInput) {
    searchInput.addEventListener('input', () => renderSearch(searchInput.value));
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('open')) closeSearch();
    // Ctrl/Cmd + K — открыть поиск
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
  });

  // Оверлей скрыт через [hidden] — убираем атрибут из стартового CSS-конфликта
  if (searchOverlay) searchOverlay.hidden = true;

  /* ============================================================
     6. Калькулятор стоимости
     ============================================================ */
  const calcForm = $('#calc-form');
  const totalValue = $('#total-value');
  const sumType = $('#sum-type');
  const sumMat = $('#sum-mat');

  // Базовые ставки за м² и множители
  const BASE_RATES = {
    kitchen: 14000,
    wardrobe: 9000,
    cloakroom: 8000,
    hallway: 7000,
    table: 11000,
    cabinet: 9500
  };

  // Минимальная стоимость по типу
  const MIN_PRICE = {
    kitchen: 120000,
    wardrobe: 45000,
    cloakroom: 60000,
    hallway: 35000,
    table: 25000,
    cabinet: 22000
  };

  const MAT_NAMES_RU = {
    m1: 'ЛДСП Egger',
    m2: 'МДФ-эмаль',
    m3: 'Шпон',
    m4: 'Массив'
  };
  const MAT_NAMES_EN = {
    m1: 'Egger chipboard',
    m2: 'MDF enamel',
    m3: 'Veneer',
    m4: 'Solid wood'
  };
  const TYPE_NAMES_RU = {
    kitchen: 'Кухня', wardrobe: 'Шкаф-купе', cloakroom: 'Гардеробная',
    hallway: 'Прихожая', table: 'Стол', cabinet: 'Тумба'
  };
  const TYPE_NAMES_EN = {
    kitchen: 'Kitchen', wardrobe: 'Sliding wardrobe', cloakroom: 'Walk-in closet',
    hallway: 'Hallway', table: 'Table', cabinet: 'Cabinet'
  };

  function currentLang() {
    return document.body.dataset.lang === 'en' ? 'en' : 'ru';
  }

  function updateCalculator(force) {
    if (!calcForm) return;

    const lang = currentLang();
    const type = $('#type').value;
    const len = Math.max(30, Number($('#len').value) || 320);
    const wid = Math.max(20, Number($('#wid').value) || 60);
    const hei = Math.max(30, Number($('#hei').value) || 240);

    // Площадь в м²: фронтальная площадь + глубина влияет частично
    const area = (len / 100) * (hei / 100); // фронтальная площадь
    const depthFactor = 1 + (wid / 100 - 0.6) * 0.4; // 60 см — базовая глубина

    const base = BASE_RATES[type] || 9000;
    let price = base * area * Math.max(0.6, depthFactor);

    // Материал (радио)
    const matRadio = $('input[name="mat"]:checked', calcForm);
    const matMultiplier = matRadio ? Number(matRadio.value) : 0;
    price *= (1 + matMultiplier);

    // Опции
    const opts = $$('input[type="checkbox"]', calcForm);
    let flatAdd = 0;
    let percentAdd = 0;
    opts.forEach((opt) => {
      if (!opt.checked) return;
      const val = Number(opt.value) || 0;
      if (val > 0 && val < 1) percentAdd += val; // проценты (0.06)
      else flatAdd += val; // фиксированные рубли
    });
    price *= (1 + percentAdd);
    price += flatAdd;

    // Минимальный порог
    price = Math.max(price, MIN_PRICE[type] || 20000);

    // Округляем красиво
    price = Math.round(price / 1000) * 1000;

    if (totalValue) totalValue.textContent = new Intl.NumberFormat('ru-RU').format(price);

    if (sumType) {
      sumType.textContent = (lang === 'en' ? TYPE_NAMES_EN : TYPE_NAMES_RU)[type] || type;
    }
    if (sumMat) {
      const matId = matRadio ? matRadio.id : 'm1';
      sumMat.textContent = (lang === 'en' ? MAT_NAMES_EN : MAT_NAMES_RU)[matId] || '—';
    }
  }

  if (calcForm) {
    calcForm.addEventListener('input', () => updateCalculator());
    calcForm.addEventListener('change', () => updateCalculator());
    // Стартовый расчёт
    updateCalculator(true);
  }

  /* ============================================================
     7. Форма заявки — валидация и сообщение об успехе
     ============================================================ */
  const leadForm = $('#lead-form');
  const formStatus = $('#form-status');

  function setStatus(text, ok) {
    if (!formStatus) return;
    formStatus.textContent = text;
    formStatus.className = 'form-status ' + (ok ? 'ok' : 'err');
  }

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#name');
      const tel = $('#tel');
      const agree = $('#agree');

      let valid = true;

      [name, tel].forEach((inp) => {
        inp.classList.remove('invalid');
        if (!inp.value.trim()) {
          inp.classList.add('invalid');
          valid = false;
        }
      });

      // Телефон: минимум 10 цифр
      const digits = tel.value.replace(/\D/g, '');
      if (digits.length < 10) {
        tel.classList.add('invalid');
        valid = false;
      }

      if (agree && !agree.checked) {
        setStatus('Нужно согласие на обработку данных.', false);
        return;
      }

      if (!valid) {
        setStatus('Проверьте имя и телефон.', false);
        return;
      }

      // Имитация отправки
      setStatus('Отправляем…', true);
      const btn = leadForm.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;

      setTimeout(() => {
        setStatus('Спасибо! Заявка отправлена — перезвоним в течение 15 минут.', true);
        leadForm.reset();
        if (btn) btn.disabled = false;
        const agreeReset = $('#agree');
        if (agreeReset) agreeReset.checked = true;
        // Сброс подсветки
        $$('.input', leadForm).forEach((i) => i.classList.remove('invalid'));
      }, 700);
    });

    // Убираем подсветку ошибки при вводе
    $$('.input', leadForm).forEach((inp) => {
      inp.addEventListener('input', () => inp.classList.remove('invalid'));
    });
  }

  /* ============================================================
     8. Плавное появление блоков при прокрутке (fallback)
        — если CSS scroll-driven animations не поддерживаются
     ============================================================ */
  const supportsScrollTimeline =
    CSS && CSS.supports && CSS.supports('animation-timeline', 'view()');

  if (!supportsScrollTimeline && !prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealEls = $$('.reveal');
    revealEls.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1)';
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.style.opacity = '1';
          el.style.transform = 'none';
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => io.observe(el));
  }

  /* ============================================================
     9. Плавное закрытие мобильного меню при клике по пустому месту
     ============================================================ */
  const mobileMenu = $('.mobile-menu');
  if (mobileMenu) {
    document.addEventListener('click', (e) => {
      if (!menuToggle.checked) return;
      if (mobileMenu.contains(e.target)) return;
      if (e.target.closest('.burger')) return;
      menuToggle.checked = false;
    });
  }

  /* ============================================================
     10. Мелочи: обновление active-состояния языка в футере и т.п.
        (не требуется — работает через setLang)
     ============================================================ */

  // Обновим калькулятор при смене языка, если он уже был инициализирован
  // (setLang уже вызывает updateCalculator, но вызовем на всякий случай после загрузки)
  document.addEventListener('DOMContentLoaded', () => {
    updateCalculator();
  });

})();
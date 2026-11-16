'use strict';

const $ = id => document.getElementById(id);
const copy = {
  ko: {
    archive: '미니카 아카이브', catalogNav: '아카이브', collectionNav: '내 컬렉션', nav: '메뉴', login: '로그인', register: '계정 만들기', logout: '로그아웃',
    search: '검색', query: '브랜드, 차명, 품번 검색', brand: '브랜드', releaseYear: '출시 연도', releaseMonth: '출시 월', allBrands: '모든 브랜드', allYears: '모든 연도', allMonths: '모든 월',
    collectionStatus: '소장 상태', all: '전체', owned: '보유', missing: '미보유', add: '보유 등록', remove: '보유 해제', spotlight: '모델 상세 보기', products: '제품 목록',
    holdingList: '보유 제품', missingList: '미보유 제품', results: '검색 결과', reset: '조건 초기화', loading: '제품을 불러오는 중…', empty: '이 조건에 맞는 제품이 없습니다.',
    archiveEmpty: '카탈로그에 저장된 제품이 없습니다.', ownedEmpty: '아직 등록한 제품이 없습니다. 아카이브에서 보유 등록을 눌러 주세요.',
    notSignedIn: '로그인하면 내 보유 상태를 볼 수 있습니다.', loadError: '목록을 불러올 수 없습니다.', detailError: '제품 정보를 불러올 수 없습니다.',
    retry: '다시 시도', page: '페이지', previous: '이전', next: '다음', detail: '제품 상세', close: '닫기', series: '시리즈', scale: '스케일', model: '차명', release: '미니카 출시월',
    original: '일본어 원문', translated: '상품 설명 번역', translateWait: '이 Mac에서 번역 중…', machine: '자동 번역', translateError: '상품 설명을 번역하지 못했습니다.', source: 'TOMYTEC 공식 제품 페이지', photos: '제품 사진', noPhoto: '저장된 사진이 없습니다.', photo: '사진',
    username: '아이디', password: '비밀번호', authIntro: '이 Mac에 저장된 내 컬렉션을 관리하세요.', createIntro: '이 Mac에서 사용할 아이디와 비밀번호를 정하세요.',
    authSwitch: '새 로컬 계정 만들기', loginSwitch: '기존 계정으로 로그인', account: '내 계정', signedInAs: '로그인한 계정', sessionEnded: '로그인 시간이 지났습니다. 다시 로그인해 주세요.',
    invalidCredentials: '아이디 또는 비밀번호를 확인해 주세요.', duplicate: '이미 사용 중인 아이디입니다.', invalidUser: '사용할 수 있는 아이디를 입력해 주세요.',
    invalidPassword: '비밀번호 조건을 확인해 주세요.', invalidInput: '입력값을 확인해 주세요.', network: '로컬 서버 연결을 확인하고 다시 시도해 주세요.',
    saved: '보유 제품에 추가했습니다.', removed: '보유 등록을 해제했습니다.', signedOut: '로그아웃했습니다.', busy: '처리 중…', noDate: '출시월 미상',
    error: '요청을 처리할 수 없습니다.', archiveAll: '전체 제품', holdingsTotal: '내 보유', count: '개', months: '월'
  },
  en: {
    archive: 'Minicar archive', catalogNav: 'Archive', collectionNav: 'My collection', nav: 'Navigation', login: 'Sign in', register: 'Create account', logout: 'Sign out',
    search: 'Search', query: 'Search by brand, model or product code', brand: 'Brand', releaseYear: 'Release year', releaseMonth: 'Month', allBrands: 'All brands', allYears: 'All years', allMonths: 'All months',
    collectionStatus: 'Collection status', all: 'All', owned: 'Owned', missing: 'Unowned', add: 'Add to collection', remove: 'Remove from collection', spotlight: 'View model', products: 'Catalog',
    holdingList: 'Owned models', missingList: 'Unowned models', results: 'Search results', reset: 'Reset filters', loading: 'Loading models…', empty: 'No models match these filters.',
    archiveEmpty: 'There are no saved models in this archive.', ownedEmpty: 'Your collection is empty. Add a model from the archive to get started.',
    notSignedIn: 'Sign in to view your collection.', loadError: 'Could not load the catalog.', detailError: 'Could not load this model.',
    retry: 'Try again', page: 'Page', previous: 'Previous', next: 'Next', detail: 'Model details', close: 'Close', series: 'Series', scale: 'Scale', model: 'Model', release: 'Model release',
    original: 'Japanese original', translated: 'Translated description', translateWait: 'Translating on this Mac…', machine: 'Machine translation', translateError: 'Could not translate this description.', source: 'Official TOMYTEC product page', photos: 'Model photos', noPhoto: 'No photo saved.', photo: 'Photo',
    username: 'Username', password: 'Password', authIntro: 'Sign in to manage the collection saved on this Mac.', createIntro: 'Choose a username and password for your account on this Mac.',
    authSwitch: 'Create a local account', loginSwitch: 'Sign in with an existing account', account: 'My account', signedInAs: 'Signed in as', sessionEnded: 'Your session expired. Please sign in again.',
    invalidCredentials: 'Check your username and password.', duplicate: 'That username is already in use.', invalidUser: 'Enter a valid username.',
    invalidPassword: 'Check the password requirements.', invalidInput: 'Check the fields and try again.', network: 'Check your connection to the local server and try again.',
    saved: 'Added to your collection.', removed: 'Removed from your collection.', signedOut: 'Signed out.', busy: 'Working…', noDate: 'Release unknown',
    error: 'Could not complete the request.', archiveAll: 'Archived models', holdingsTotal: 'Owned', count: '', months: ''
  }
};

Object.assign(copy.ko, {
  source: '공식 사진 · TOMYTEC 제품 페이지 ↗', machine: '저장된 자동 번역',
  holdingsError: '소장 기록을 불러오지 못했습니다.', storage: '컬렉션 저장', deviceInfo: '보유 기록을 이 브라우저에 저장합니다. 다른 기기로 옮길 때는 백업 파일을 가져오세요.', export: '소장 기록 내보내기', import: '소장 기록 가져오기', imported: '백업의 소장품을 현재 기록에 추가했습니다.', backupError: '미니카 아카이브에서 내보낸 JSON 파일을 선택해 주세요.', saveError: '기기에 저장하지 못했습니다. 브라우저의 저장 권한을 확인하세요.',
  folderConnect: '사진 폴더 연결', folderConnected: '사진 폴더 연결됨', folderDevice: '기기에 저장한 사진 보기',
  folderTitle: '이 기기의 사진 폴더', folderHelp: 'Mac에 저장한 미니카 아카이브에서 archive → products 폴더를 선택하세요. 사진과 저장된 번역은 이 기기에서만 열립니다.',
  folderChoose: 'products 폴더 선택', folderChange: '다른 폴더 선택', disconnect: '연결 해제',
  folderError: 'archive 안의 products 폴더를 선택하고 브라우저에 읽기 권한을 허용해 주세요.',
  network: '인터넷 연결을 확인한 뒤 다시 시도해 주세요.'
});
Object.assign(copy.en, {
  source: 'Official photos · TOMYTEC product page ↗', machine: 'Saved machine translation',
  holdingsError: 'Could not load your collection.', storage: 'Collection storage', deviceInfo: 'Your collection is saved in this browser. Export a backup to move it to another device.', export: 'Export collection', import: 'Import collection', imported: 'The items in your backup were added to your collection.', backupError: 'Choose a JSON backup exported by Garage Index.', saveError: 'Could not save to this device. Check browser storage permissions.',
  folderConnect: 'Connect photo folder', folderConnected: 'Photo folder connected', folderDevice: 'View photos saved on this device',
  folderTitle: 'Photos on this device', folderHelp: 'Select archive → products from your saved minicar archive. Your photos and saved translations open on this device.',
  folderChoose: 'Choose products folder', folderChange: 'Choose another folder', disconnect: 'Disconnect folder',
  folderError: 'Select the products folder inside archive and allow your browser to read it.',
  network: 'Check your internet connection and try again.'
});

function readLanguage() {
  try { return localStorage.getItem('garage-index-language') === 'en' ? 'en' : 'ko'; }
  catch { return 'ko'; }
}
const state = {
  lang: readLanguage(), data: null, activeDetail: null, detailData: null,
  catalogRequest: null, detailRequest: null, page: 1, owned: 'all', q: '', brand: '', year: '', month: ''
};
const t = key => copy[state.lang][key];
const number = value => Number(value || 0).toLocaleString(state.lang);
const element = (tag, value, className) => {
  const node = document.createElement(tag);
  if (value !== undefined && value !== null) node.textContent = value;
  if (className) node.className = className;
  return node;
};
function button(text, onClick, className) {
  const node = element('button', text, className);
  node.type = 'button';
  node.addEventListener('click', onClick);
  return node;
}
function locationToState() {
  const p = new URLSearchParams(location.search);
  state.q = p.get('q') || '';
  state.brand = p.get('brand') || '';
  state.year = p.get('year') || '';
  state.month = p.get('month') || '';
  state.owned = ['yes', 'no'].includes(p.get('owned')) ? p.get('owned') : 'all';
  state.page = Math.max(1, parseInt(p.get('page'), 10) || 1);
  $('query').value = state.q;
}
function queryParams() {
  const p = new URLSearchParams();
  for (const key of ['q', 'brand', 'year', 'month']) if (state[key]) p.set(key, state[key]);
  if (state.owned !== 'all') p.set('owned', state.owned);
  if (state.page > 1) p.set('page', state.page);
  return p;
}
function storeRoute(replace = false) {
  const p = queryParams().toString();
  const href = location.pathname + (p ? '?' + p : '') + location.hash;
  if (href !== location.pathname + location.search + location.hash) history[replace ? 'replaceState' : 'pushState']({}, '', href);
}
function dateLabel(raw, compact = false) {
  if (!raw) return '';
  const match = /^(\d{4})-(\d{1,2})$/.exec(raw);
  if (!match || Number(match[2]) < 1 || Number(match[2]) > 12) return raw;
  const month = new Date(Number(match[1]), Number(match[2]) - 1);
  const now = new Date();
  const future = month > new Date(now.getFullYear(), now.getMonth());
  const label = compact ? raw.replace('-', '.') : new Intl.DateTimeFormat(state.lang === 'ko' ? 'ko-KR' : 'en-US', {year: 'numeric', month: state.lang === 'ko' ? 'long' : 'short'}).format(month);
  return future ? (state.lang === 'ko' ? label + ' 예정' : label + ' (planned)') : label;
}
const cardURLs = new Set();
const detailURLs = new Set();
let cardRender = 0;

function releaseURLs(group) {
  for (const url of group) URL.revokeObjectURL(url);
  group.clear();
}
function makeFileURL(file, group) {
  const url = URL.createObjectURL(file);
  group.add(url);
  return url;
}
function applyCopy() {
  renderFolder();
  document.documentElement.lang = state.lang;
  document.title = t('archive') + ' · Garage Index';
  document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
  $('navigation').setAttribute('aria-label', t('nav'));
  $('query').placeholder = t('query');
  $('query').setAttribute('aria-label', t('query'));
  $('pagination').setAttribute('aria-label', t('page'));
  document.querySelectorAll('[data-close]').forEach(node => node.setAttribute('aria-label', t('close')));
  for (const lang of ['ko','en']) $('lang-' + lang).setAttribute('aria-pressed', String(state.lang === lang));
  $('account-label').textContent = store.getAccountLabel?.(state.lang) || t('storage');
  $('heading').textContent = state.owned === 'yes' ? t('collectionNav') : t('archive');
  $('nav-owned').setAttribute('aria-current', state.owned === 'yes' ? 'page' : 'false');
  $('nav-catalog').setAttribute('aria-current', state.owned === 'yes' ? 'false' : 'page');
  document.querySelectorAll('[data-owned]').forEach(node => node.setAttribute('aria-pressed', String(node.dataset.owned === state.owned)));
}
function renderSelect(id, allLabel, options, value) {
  const select = $(id);
  select.replaceChildren(new Option(t(allLabel), ''), ...options.map(o => new Option(o.label, o.value)));
  if (value && !options.some(o => String(o.value) === String(value))) select.add(new Option(value, value));
  select.value = value;
}
function renderFacets(facets) {
  renderSelect('brand', 'allBrands', facets.brands || [], state.brand);
  renderSelect('year', 'allYears', (facets.years || []).map(y => ({value: String(y), label: String(y)})), state.year);
  const months = Array.from({length: 12}, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: state.lang === 'ko' ? (i + 1) + t('months') : new Intl.DateTimeFormat('en', {month:'short'}).format(new Date(2020,i))
  }));
  renderSelect('month', 'allMonths', months, state.month ? String(state.month).padStart(2, '0') : '');
}
function toast(message) {
  const node = $('toast');
  node.textContent = message;
  node.hidden = false;
  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => { node.hidden = true; }, 2600);
}
const storagePrefix = 'garage-index:owned:';
const deviceStore = {
  async init() {},
  async getOwned() {
    const items = new Set();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(storagePrefix)) {
        const id = Number(key.slice(storagePrefix.length));
        if (Number.isSafeInteger(id) && id > 0) items.add(id);
      }
    }
    return items;
  },
  async setOwned(id, owned) {
    const key = storagePrefix + id;
    if (owned) localStorage.setItem(key, '1');
    else localStorage.removeItem(key);
  },
};
const store = window.collectionStore || deviceStore;
function setNotice(key, retry) {
  const node = $('catalog-notice');
  node.replaceChildren(document.createTextNode(t(key)));
  if (retry) node.append(button(t('retry'), retry));
  node.hidden = false;
}
function titleOf(item) {
  return item.title || item.model || item.title_ja || item.code || '#' + item.id;
}
function titleOnCard(item) {
  const title = titleOf(item);
  if (!item.code || !title.toLocaleLowerCase().startsWith(item.code.toLocaleLowerCase())) return title;
  const rest = title.slice(item.code.length).trim();
  return rest || title;
}
function badge(node, item) {
  const owned = Boolean(item.owned);
  const unavailable = item.owned === null;
  node.disabled = unavailable;
  const label = unavailable ? t('holdingsError') : owned ? t('owned') : t('add');
  node.setAttribute('aria-pressed', String(owned));
  node.setAttribute('aria-label', titleOf(item) + ' · ' + (owned ? t('remove') : t('add')));
  const text = node.querySelector('.toggle-copy');
  text.textContent = label;
  text.dataset.short = unavailable ? '—' : owned ? t('owned') : (state.lang === 'ko' ? '등록' : 'Add');
}
function card(item, index) {
  const node = $('card-template').content.firstElementChild.cloneNode(true);
  const imageButton = node.querySelector('.card-image');
  imageButton.setAttribute('aria-label', t('detail') + ' · ' + titleOf(item));
  imageButton.addEventListener('click', () => openDetail(item.id));
  const img = node.querySelector('img');
  const renderId = cardRender;
  if (archiveFolder.connected && item.thumbnail) {
    archiveFolder.file(item.id, 'thumbnail.jpg').then(file => {
      if (!file || renderId !== cardRender || !node.isConnected) return;
      const url = makeFileURL(file, cardURLs);
      img.loading = index < 4 ? 'eager' : 'lazy';
      img.addEventListener('error', () => { imageButton.hidden = true; }, {once:true});
      img.src = url;
      img.hidden = false;
      imageButton.hidden = false;
    }).catch(() => {});
  }
  node.querySelector('.card-series').textContent = item.series || item.brand;
  node.querySelector('.card-code').textContent = item.code || item.brand;
  node.querySelector('.card-scale').textContent = item.scale || '';
  const name = node.querySelector('.card-title');
  name.textContent = titleOnCard(item);
  name.addEventListener('click', () => openDetail(item.id));
  const date = node.querySelector('.card-date');
  date.append(element('span',dateLabel(item.release_month) || t('noDate'),'date-full'),element('span',dateLabel(item.release_month,true) || t('noDate'),'date-short'));
  const own = node.querySelector('.card-own');
  badge(own,item);
  own.addEventListener('click', () => toggleOwned(item, own));
  return node;
}
function jump(page) {
  state.page = page;
  storeRoute();
  loadCatalog();
  $('results-title').scrollIntoView({block:'start',behavior:'instant'});
}
function pagination(data) {
  const nav = $('pagination');
  nav.replaceChildren();
  if (data.pages <= 1) return;
  const btn = (label, page, disabled, current) => {
    const node = button(label, () => jump(page));
    node.disabled = disabled;
    if (current) node.setAttribute('aria-current','page');
    nav.append(node);
  };
  btn(t('previous'),data.page-1,data.page <= 1,false);
  const pages = [...new Set([1, data.page-1, data.page, data.page+1, data.pages])].filter(p => p > 0 && p <= data.pages).sort((a,b) => a-b);
  pages.forEach((p,i) => {
    if (i && p-pages[i-1] > 1) nav.append(element('span','…'));
    btn(number(p),p,false,p === data.page);
  });
  btn(t('next'),data.page+1,data.page >= data.pages,false);
}
function renderCatalog(data) {
  state.data = data;
  applyCopy();
  renderFacets(data.facets || {});
  releaseURLs(cardURLs);
  cardRender++;
  $('cards').replaceChildren(...data.items.map(card));
  $('totals').replaceChildren(element('span', t('archiveAll') + ' ' + number(data.stats.total) + t('count')));
  if (data.stats.owned !== null) $('totals').append(element('span', t('holdingsTotal') + ' ' + number(data.stats.owned) + t('count')));
  const filtered = Boolean(state.q || state.brand || state.year || state.month);
  $('results-title').textContent = filtered ? t('results') : t(state.owned === 'yes' ? 'holdingList' : state.owned === 'no' ? 'missingList' : 'products');
  $('result-count').textContent = number(data.total) + t('count');
  $('clear-filters').hidden = !filtered;
  $('catalog-notice').hidden = true;
  if (!data.items.length) setNotice(!data.stats.total ? 'archiveEmpty' : filtered ? 'empty' : state.owned === 'yes' ? 'ownedEmpty' : 'empty');
  pagination(data);
}
async function loadCatalog() {
  state.catalogRequest?.abort();
  const controller = new AbortController();
  state.catalogRequest = controller;
  $('cards').setAttribute('aria-busy','true');
  if (!state.data) setNotice('loading');
  const p = queryParams();
  p.set('lang',state.lang);
  try {
    let owned;
    let errorLoadingHoldings = false;
    try { owned = await store.getOwned(); }
    catch {
      if (controller.signal.aborted) return;
      if (state.owned !== 'all') {
        $('cards').replaceChildren(); $('pagination').replaceChildren();
        $('result-count').textContent = ''; $('totals').replaceChildren();
        setNotice('holdingsError', loadCatalog);
        return;
      }
      owned = new Set();
      errorLoadingHoldings = true;
    }
    const body = await garageCatalog.search(p, state.lang, owned);
    if (errorLoadingHoldings) {
      for (const item of body.items) item.owned = null;
      body.stats.owned = null;
    }
    if (controller.signal.aborted) return;
    if (body.page !== state.page) { state.page = body.page; storeRoute(true); }
    renderCatalog(body);
    if (errorLoadingHoldings) toast(t('holdingsError'));
  } catch (error) {
    if (error.name !== 'AbortError') {
      $('cards').replaceChildren(); $('pagination').replaceChildren();
      releaseURLs(cardURLs); cardRender++; $('result-count').textContent = '';
      setNotice('loadError', loadCatalog);
    }
  } finally {
    if (!controller.signal.aborted) $('cards').setAttribute('aria-busy','false');
  }
}
function changeFilters(values) {
  Object.assign(state,values,{page:1});
  $('query').value = state.q;
  storeRoute(); applyCopy(); loadCatalog();
}
function setOwnedFilter(value) {
  changeFilters({owned:value});
}
async function toggleOwned(item, node, desired = !Boolean(item.owned)) {
  node.disabled = true;
  try {
    await store.setOwned(item.id, desired);
    item.owned = desired;
    badge(node,item);
    toast(t(item.owned ? 'saved' : 'removed'));
    if (state.activeDetail === item.id && state.detailData) state.detailData.owned = item.owned;
    await loadCatalog();
  } catch (error) {
    toast(store === deviceStore ? t('saveError') : error.message || t('saveError'));
  } finally { node.disabled = false; }
}
function officialURL(item) {
  try {
    const url = new URL(item.source_url);
    return url.protocol === 'https:' && url.hostname === 'minicar.tomytec.co.jp' ? url.href : '';
  } catch { return ''; }
}
function renderDetail(item) {
  state.detailData = item;
  $('detail-code').textContent = item.code || item.brand || t('detail');
  const gallery = element('div', null, 'detail-gallery');
  const main = element('div',null,'detail-main');
  const images = item.localImages || [];
  gallery.append(main);
  if (images.length) {
    const photo = new Image();
    photo.src = images[0];
    photo.alt = titleOf(item) + ' · ' + t('photo') + ' 1';
    main.append(photo);
    if (images.length > 1) {
      const strip = element('div',null,'filmstrip');
      strip.setAttribute('aria-label', t('photos'));
      images.forEach((url, i) => {
        const select = button('',() => {
          photo.src = url;
          photo.alt = titleOf(item) + ' · ' + t('photo') + ' ' + (i + 1);
          [...strip.children].forEach((b,j) => b.setAttribute('aria-pressed',String(j === i)));
        });
        select.setAttribute('aria-label', t('photo') + ' ' + (i + 1));
        select.setAttribute('aria-pressed', String(i === 0));
        const small = new Image();
        small.alt = ''; small.loading = 'lazy'; small.decoding = 'async'; small.src = url;
        select.append(small); strip.append(select);
      });
      gallery.append(strip);
    }
  }
  const info = element('div',null,'detail-info');
  const title = element('h2',titleOnCard(item)); title.id = 'detail-title';
  $('detail-dialog').setAttribute('aria-labelledby','detail-title');
  const own = element('button',null,'card-own');
  own.type = 'button';
  const icon = element('span',null,'toggle-icon'); icon.setAttribute('aria-hidden','true');
  own.append(icon,element('span',null,'toggle-copy'));
  badge(own,item);
  own.addEventListener('click',() => toggleOwned(item,own));
  info.append(title,own);
  const specs = element('dl');
  for (const [key,value] of [['brand',item.brand],['model',item.model],['series',item.series],['release',dateLabel(item.release_month)],['scale',item.scale]]) {
    if (value) specs.append(element('dt',t(key)),element('dd',value));
  }
  info.append(specs);
  const text = element('div',null,'detail-text');
  if (item.description && item.description !== item.description_ja) text.append(element('p',item.description));
  if (item.localTranslation) {
    const panel = element('details');
    panel.append(element('summary',t('translated')),element('small',t('machine')),element('p',item.localTranslation));
    text.append(panel);
  }
  if (item.title_ja || item.description_ja) {
    const original = element('details');
    const raw = element('div'); raw.lang = 'ja';
    if (item.title_ja) raw.append(element('strong',item.title_ja));
    if (item.description_ja) raw.append(element('p',item.description_ja));
    original.append(element('summary',t('original')),raw);
    text.append(original);
  }
  const url = officialURL(item);
  if (url) {
    const link = element('a', t('source'), 'official-link');
    link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    text.prepend(link);
  }
  $('detail-body').classList.toggle('text-detail',!images.length);
  $('detail-body').replaceChildren(...(images.length ? [gallery] : []),info,text);
}
async function enrichFromFolder(item, lang, signal) {
  if (!archiveFolder.connected) return;
  const [raw, saved] = await Promise.all([
    archiveFolder.json(item.id, 'product.json'),
    archiveFolder.json(item.id, 'translations/' + lang + '.json')
  ]);
  if (signal.aborted || !raw || Number(raw.id) !== Number(item.id)) return;
  item.description_ja = typeof raw.description_ja === 'string' ? raw.description_ja : '';
  item.localTranslation = typeof saved?.text === 'string' ? saved.text : '';
  const names = Array.isArray(raw.images) ? raw.images.filter(p => typeof p === 'string' && /^photos\/[^/]+$/.test(p)) : [];
  if (!names.length && raw.thumbnail === 'thumbnail.jpg') names.push('thumbnail.jpg');
  const photos = await Promise.all(names.map(path => archiveFolder.file(item.id, path)));
  if (!signal.aborted) item.localImages = photos.filter(Boolean).map(file => makeFileURL(file,detailURLs));
}
async function openDetail(id) {
  state.detailRequest?.abort();
  releaseURLs(detailURLs);
  const ctrl = new AbortController(); state.detailRequest = ctrl;
  state.activeDetail = id; state.detailData = null;
  const dialog = $('detail-dialog');
  dialog.removeAttribute('aria-labelledby');
  dialog.setAttribute('aria-label',t('detail'));
  $('detail-code').textContent = t('detail');
  $('detail-body').replaceChildren(element('p',t('loading'),'detail-status'));
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  try {
    const owned = await store.getOwned().catch(() => null);
    const detail = await garageCatalog.product(id, state.lang, owned || new Set());
    if (!owned) detail.owned = null;
    if (ctrl.signal.aborted || !dialog.open) return;
    renderDetail(detail);
    if (archiveFolder.connected) {
      try {
        await enrichFromFolder(detail,state.lang,ctrl.signal);
        if (!ctrl.signal.aborted && dialog.open) renderDetail(detail);
      } catch { /* Remote facts stay usable if device access was revoked. */ }
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      const banner = element('div', t('detailError') + ' ', 'detail-status');
      banner.append(button(t('retry'),() => openDetail(id)));
      $('detail-body').replaceChildren(banner);
    }
  }
}
function renderStorage() {
  $('auth-title').textContent = t('storage');
  $('auth-intro').textContent = t('deviceInfo');
  $('backup-export').textContent = t('export');
  $('backup-import').textContent = t('import');
}
function openStorage() {
  if (typeof store.openAccount === 'function') return store.openAccount(state.lang);
  renderStorage();
  $('backup-message').textContent = '';
  if (!$('auth-dialog').open) $('auth-dialog').showModal();
}
$('backup-export').addEventListener('click', async () => {
  try {
    const data = {format:'garage-index-collection', version:1, owned:[...await store.getOwned()].sort((a,b) => a-b)};
    const url = URL.createObjectURL(new Blob([JSON.stringify(data)], {type:'application/json'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'garage-index-collection.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  } catch { $('backup-message').textContent = t('saveError'); }
});
$('backup-import').addEventListener('click', () => $('backup-file').click());
$('backup-file').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > 1000000) throw new Error();
    const data = JSON.parse(await file.text());
    if (data.format !== 'garage-index-collection' || data.version !== 1 || !Array.isArray(data.owned) ||
        !data.owned.every(id => Number.isSafeInteger(id) && id > 0)) throw new Error();
    for (const id of new Set(data.owned)) await store.setOwned(id, true);
    $('backup-message').textContent = t('imported');
    await loadCatalog();
  } catch { $('backup-message').textContent = t('backupError'); }
  event.target.value = '';
});
function renderFolder() {
  $('folder-button-label').textContent = t(archiveFolder.connected ? 'folderConnected' : 'folderConnect');
  $('folder-status').textContent = archiveFolder.connected ? archiveFolder.directoryName : t('folderDevice');
  $('choose-folder').textContent = t(archiveFolder.connected ? 'folderChange' : 'folderChoose');
  $('forget-folder').hidden = !archiveFolder.connected;
}
function refreshFolderView() {
  renderFolder();
  if (state.data) renderCatalog(state.data);
  if (state.activeDetail !== null) openDetail(state.activeDetail);
}
function changeLanguage(lang) {
  if (state.lang === lang) return;
  state.lang = lang;
  try { localStorage.setItem('garage-index-language',lang); } catch {}
  applyCopy(); renderFacets(state.data?.facets || {});
  if ($('auth-dialog').open) renderStorage();
  if (state.activeDetail !== null) openDetail(state.activeDetail);
  loadCatalog();
}
$('search-form').addEventListener('submit', event => { event.preventDefault(); changeFilters({q:$('query').value.trim()}); });
for (const key of ['brand','year','month']) $(key).addEventListener('change',event => changeFilters({[key]:event.target.value,q:$('query').value.trim()}));
$('clear-filters').addEventListener('click', () => changeFilters({q:'',brand:'',year:'',month:''}));
document.querySelectorAll('[data-owned]').forEach(node => node.addEventListener('click', () => setOwnedFilter(node.dataset.owned)));
$('nav-catalog').addEventListener('click', () => changeFilters({owned:'all',q:'',brand:'',year:'',month:''}));
$('nav-owned').addEventListener('click', () => changeFilters({owned:'yes',q:'',brand:'',year:'',month:''}));
$('account').addEventListener('click', openStorage);
$('open-folder').addEventListener('click',() => {
  $('folder-message').textContent = ''; renderFolder(); $('folder-dialog').showModal();
});
$('choose-folder').addEventListener('click',async () => {
  const control = $('choose-folder');
  control.disabled = true; $('folder-message').textContent = '';
  try {
    await archiveFolder.connect();
    refreshFolderView(); $('folder-dialog').close();
  } catch (error) {
    if (error.name !== 'AbortError') $('folder-message').textContent = t('folderError');
  } finally { control.disabled = false; }
});
$('forget-folder').addEventListener('click',async () => {
  await archiveFolder.disconnect();
  refreshFolderView(); $('folder-dialog').close();
});
$('lang-ko').addEventListener('click',() => changeLanguage('ko'));
$('lang-en').addEventListener('click',() => changeLanguage('en'));
document.querySelectorAll('[data-close]').forEach(node => node.addEventListener('click',() => $(node.dataset.close).close()));
for (const dialog of [$('detail-dialog'),$('auth-dialog'),$('folder-dialog')]) dialog.addEventListener('click',event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
$('detail-dialog').addEventListener('close', () => {
  state.detailRequest?.abort(); state.activeDetail = null; state.detailData = null;
  releaseURLs(detailURLs); $('detail-body').replaceChildren();
});
window.addEventListener('popstate', () => {
  locationToState(); applyCopy(); loadCatalog();
});
function refreshCollection() {
  applyCopy();
  loadCatalog();
  if (state.activeDetail !== null) openDetail(state.activeDetail);
}
window.addEventListener('collection-changed', refreshCollection);
window.addEventListener('storage', event => {
  if (event.key === null || event.key.startsWith(storagePrefix)) refreshCollection();
});
async function init() {
  locationToState(); applyCopy(); renderFacets({});
  try { await store.init(); } catch (error) { toast(error.message || t('saveError')); }
  await loadCatalog();
  if (await archiveFolder.restore().catch(() => false) || archiveFolder.connected) refreshFolderView();
}
init();

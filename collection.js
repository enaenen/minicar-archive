'use strict';

// Guest ownership is kept by this browser. A connected account stores only
// product IDs in the app's private, per-user Puter key-value namespace.
(() => {
  const prefix = 'garage-index:minicar:v1:owned:';
  const connectionKey = 'garage-index:minicar:v1:connected';
  const copy = {
    ko: { guest: '기기 저장', cloud: '동기화 계정', account: '내 컬렉션 저장', close: '닫기',
      intro: '로그인 전에는 이 브라우저에 저장합니다. Puter 계정으로 로그인하면 같은 계정의 보유 기록을 휴대폰과 컴퓨터에서 볼 수 있습니다.',
      separate: '기기에 저장한 보유 기록은 그대로 유지됩니다. 로그인 후에는 계정의 컬렉션을 엽니다.',
      connected: '이 계정으로 등록한 제품의 보유 여부가 다른 기기와 동기화됩니다.',
      signIn: 'Puter로 로그인', signOut: '로그아웃하고 기기 저장으로 전환', loading: '로그인 준비 중…',
      waiting: 'Puter 로그인 창에서 계속하세요.', retry: '다시 연결', offline: '계정에 연결할 수 없습니다. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.',
      cancelled: '로그인을 완료하지 않았습니다. 다시 시도할 수 있습니다.' },
    en: { guest: 'On this device', cloud: 'Sync account', account: 'Collection storage', close: 'Close',
      intro: 'Before sign-in, your collection is saved in this browser. Sign in with a Puter account to see its collection on your phone and computer.',
      separate: 'Your device collection stays here. Signing in opens the collection saved to your account.',
      connected: 'Products marked as owned sync to other devices signed in to this account.',
      signIn: 'Sign in with Puter', signOut: 'Sign out and use device storage', loading: 'Preparing sign-in…',
      waiting: 'Continue in the Puter sign-in window.', retry: 'Reconnect', offline: 'Could not connect to your account. Check your connection and try again.',
      cancelled: 'Sign-in was not completed. You can try again.' }
  };
  let sdkPromise, initPromise, dialog, lang = 'ko';
  let account = null, connected = false, generation = 0, pendingLogin = false;
  let cloudSnapshot = null, readPromise = null;
  const validId = id => Number.isSafeInteger(id) && id > 0;
  const emit = () => window.dispatchEvent(new Event('collection-changed'));

  function invalidate() {
    generation++;
    cloudSnapshot = null;
    readPromise = null;
  }

  function sdk() {
    if (window.puter?.auth && window.puter?.kv) return Promise.resolve(window.puter);
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const timer = setTimeout(fail, 12000);
      function fail() {
        clearTimeout(timer);
        script.onload = null;
        script.onerror = null;
        script.remove();
        sdkPromise = null;
        reject(new Error('Puter SDK unavailable'));
      }
      script.async = true;
      script.src = 'https://js.puter.com/v2/';
      script.onload = () => {
        if (!window.puter?.auth || !window.puter?.kv) { fail(); return; }
        clearTimeout(timer);
        resolve(window.puter);
      };
      script.onerror = fail;
      document.head.append(script);
    });
    return sdkPromise;
  }

  function deviceOwned() {
    const result = new Set();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        const id = Number(key.slice(prefix.length));
        if (validId(id)) result.add(id);
      }
    }
    return result;
  }

  function changeMode(next, user) {
    if (next) localStorage.setItem(connectionKey, '1');
    else localStorage.removeItem(connectionKey);
    connected = next;
    account = user;
    invalidate();
    emit();
  }

  // User identity is looked up from the provider, never from cached display data.
  async function restore() {
    const revision = generation;
    const p = await sdk();
    if (revision !== generation || !connected) return;
    if (!p.auth.isSignedIn()) { changeMode(false, null); return; }
    const user = await p.auth.getUser();
    if (revision === generation && connected) account = user;
  }

  async function init() {
    if (initPromise) return initPromise;
    // Guest browsing should still render when browser storage is disabled.
    try { connected = localStorage.getItem(connectionKey) === '1'; } catch { connected = false; }
    initPromise = connected ? restore().catch(() => {}) : Promise.resolve();
    return initPromise;
  }

  function assertSession() {
    if (!connected || !account || !window.puter?.auth.isSignedIn() || !localStorage.getItem(connectionKey)) {
      invalidate();
      account = null;
      throw new Error(copy[lang].offline);
    }
  }

  async function getOwned() {
    await init();
    if (!connected) return deviceOwned();
    if (!account) await restore();
    if (!connected) return deviceOwned();
    assertSession();
    if (cloudSnapshot && Date.now() - cloudSnapshot.at < 15000) return new Set(cloudSnapshot.ids);
    if (!readPromise) {
      const revision = generation;
      const task = window.puter.kv.list(prefix + '*').then(keys => {
        if (generation !== revision) return getOwned();
        assertSession();
        if (!Array.isArray(keys)) throw new Error(copy[lang].offline);
        const ids = new Set(keys.filter(k => typeof k === 'string' && k.startsWith(prefix))
          .map(k => Number(k.slice(prefix.length))).filter(validId));
        cloudSnapshot = {at:Date.now(), ids};
        return ids;
      }).catch(error => {
        if (generation === revision) cloudSnapshot = null;
        throw error;
      }).finally(() => { if (readPromise === task) readPromise = null; });
      readPromise = task;
    }
    return new Set(await readPromise);
  }

  async function setOwned(id, owned) {
    if (!validId(id) || typeof owned !== 'boolean' || pendingLogin) throw new Error('Invalid collection update');
    await init();
    const key = prefix + id;
    if (connected) {
      assertSession();
      const revision = generation;
      if (owned) await window.puter.kv.set(key, 1);
      else await window.puter.kv.del(key);
      if (generation === revision) invalidate();
    } else {
      if (owned) localStorage.setItem(key, '1');
      else localStorage.removeItem(key);
    }
    emit();
  }

  function getAccountLabel(locale) {
    lang = locale === 'en' ? 'en' : 'ko';
    return connected ? account?.username || copy[lang].cloud : copy[lang].guest;
  }

  function buildDialog() {
    const node = document.createElement('dialog');
    node.className = 'auth-dialog';
    node.id = 'collection-storage';
    node.setAttribute('aria-labelledby','storage-title');
    node.innerHTML = '<div class="dialog-top"><span class="dialog-brand">Garage Index</span><button type="button" class="close"><span aria-hidden="true">×</span></button></div>' +
      '<div class="auth-content"><h2 id="storage-title"></h2><p data-intro></p><p data-note></p>' +
      '<p data-status role="status" aria-live="polite"></p><button type="button" data-action class="primary"></button>' +
      '<button type="button" data-disconnect class="switch-auth"></button></div>';
    node.querySelector('.close').onclick = () => node.close();
    node.addEventListener('click', e => { if (e.target === node) node.close(); });
    document.body.append(node);
    return node;
  }

  async function openAccount(locale) {
    lang = locale === 'en' ? 'en' : 'ko';
    const t = copy[lang];
    if (!dialog) dialog = buildDialog();
    const q = selector => dialog.querySelector(selector);
    if (!dialog.open) dialog.showModal();
    q('.close').setAttribute('aria-label', t.close);
    q('#storage-title').textContent = t.account;
    const action = q('[data-action]'), disconnect = q('[data-disconnect]'), status = q('[data-status]');
    function paint() {
      q('[data-intro]').textContent = connected ? t.connected : t.intro;
      q('[data-note]').textContent = connected ? (account?.username || '') : t.separate;
      action.hidden = Boolean(connected && account);
      action.textContent = connected ? t.retry : t.signIn;
      action.disabled = pendingLogin;
      disconnect.hidden = !connected;
      disconnect.disabled = pendingLogin;
      disconnect.textContent = t.signOut;
    }
    paint();
    status.textContent = '';
    disconnect.onclick = async () => {
      disconnect.disabled = true;
      try {
        const p = window.puter;
        changeMode(false, null);
        if (p) await p.auth.signOut();
        dialog.close();
      } catch {
        paint(); status.textContent = t.offline;
      }
    };
    // Load the SDK before enabling sign-in so the popup opens during a real
    // user click (Safari and mobile browsers may discard async user gestures).
    async function prepare() {
      action.disabled = true;
      status.textContent = t.loading;
      try {
        const p = await sdk();
        if (connected && !account) await restore();
        paint();
        status.textContent = pendingLogin ? t.waiting : '';
        action.onclick = async () => {
          if (pendingLogin) return;
          pendingLogin = true;
          paint(); status.textContent = t.waiting;
          try {
            if (!p.auth.isSignedIn()) await p.auth.signIn();
            if (!p.auth.isSignedIn()) throw new Error('Sign-in canceled');
            const user = await p.auth.getUser();
            changeMode(true, user);
            dialog.close();
          } catch { status.textContent = t.cancelled; }
          finally { pendingLogin = false; paint(); }
        };
      } catch {
        paint();
        status.textContent = t.offline;
        action.textContent = t.retry;
        action.onclick = prepare;
      }
    }
    if (!connected || !account) await prepare();
  }

  window.addEventListener('storage', event => {
    if (!event.key || event.key === connectionKey) {
      account = null;
      invalidate();
      connected = localStorage.getItem(connectionKey) === '1';
      initPromise = connected ? restore().catch(() => {}) : Promise.resolve();
      emit();
    } else if (event.key.startsWith(prefix) && !connected) emit();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && connected) {
      invalidate(); account = null; emit();
    }
  });
  window.collectionStore = { init, getOwned, setOwned, getAccountLabel, openAccount };
})();

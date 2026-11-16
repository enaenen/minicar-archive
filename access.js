'use strict';

window.readArchiveCatalog = (() => {
  const readKey = value => {
    const raw = value.trim();
    if (/^[A-Za-z0-9_-]{43}$/.test(raw)) return raw;
    try {
      const url = new URL(raw, location.href);
      const key = new URLSearchParams(url.hash.slice(1)).get('k') || '';
      return /^[A-Za-z0-9_-]{43}$/.test(key) ? key : '';
    } catch { return ''; }
  };
  let encrypted;
  let opened;
  async function decrypt(keyString) {
    if (!encrypted) {
      encrypted = fetch('./catalog.bin').then(response => {
        if (!response.ok) throw new Error('Cannot load archived catalog');
        return response.arrayBuffer();
      }).catch(error => { encrypted = null; throw error; });
    }
    const bytes = new Uint8Array(await encrypted);
    const rawKey = Uint8Array.from(atob(keyString.replaceAll('-', '+').replaceAll('_', '/') + '='), c => c.charCodeAt(0));
    const key = await crypto.subtle.importKey('raw', rawKey, 'AES-GCM', false, ['decrypt']);
    const plain = await crypto.subtle.decrypt({name:'AES-GCM', iv:bytes.subarray(0,12)}, key, bytes.subarray(12));
    const stream = new Blob([plain]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Response(stream).json();
  }
  function askForKey(failed) {
    return new Promise(resolve => {
      const dialog = document.createElement('dialog');
      dialog.className = 'auth-dialog';
      const box = document.createElement('form');
      box.className = 'dialog-inner';
      box.style.padding = '28px';
      const heading = document.createElement('h2');
      heading.textContent = '개인 아카이브 열기';
      const label = document.createElement('label');
      label.textContent = '개인 링크 또는 열기 키';
      const input = document.createElement('input');
      input.type = 'password'; input.required = true; input.autocomplete = 'off';
      input.style.width = '100%'; input.style.marginBlock = '8px 12px'; input.style.padding = '10px';
      const error = document.createElement('p');
      error.setAttribute('role','status');
      if (failed) error.textContent = '이 링크로 아카이브를 열 수 없습니다. 저장해 둔 개인 링크를 확인하세요.';
      const button = document.createElement('button');
      button.type = 'submit'; button.className = 'primary'; button.textContent = '아카이브 열기';
      label.append(input); box.append(heading,label,button,error); dialog.append(box);
      document.body.append(dialog); dialog.showModal();
      dialog.addEventListener('cancel', e => e.preventDefault());
      box.addEventListener('submit', async e => {
        e.preventDefault();
        const key = readKey(input.value);
        if (!key) { error.textContent = '전체 개인 링크 또는 올바른 열기 키를 입력하세요.'; return; }
        button.disabled = true;
        try {
          const data = await decrypt(key);
          const url = new URL(location.href); url.hash = 'k=' + key;
          history.replaceState(history.state,'',url);
          dialog.close(); dialog.remove(); resolve(data);
        } catch { error.textContent = '열지 못했습니다. 개인 링크와 네트워크 연결을 확인하세요.'; }
        finally { button.disabled = false; }
      });
    });
  }
  return () => {
    if (!opened) opened = (async () => {
      const key = readKey(location.href);
      if (!key) return askForKey(false);
      try { return await decrypt(key); }
      catch (e) {
        if (e.name === 'OperationError') return askForKey(true);
        throw e;
      }
    })().catch(e => {opened=null; throw e;});
    return opened;
  };
})();

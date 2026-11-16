'use strict';

// The browser stores a read-only directory handle. File-input mode keeps only
// session-scoped File references, and neither path sends any file over the network.
(() => {
  const idPattern = /^[1-9][0-9]*$/;
  const photoPattern = /^photos\/[A-Za-z0-9_-]+\.(?:jpg|jpeg|webp|png|gif|avif)$/i;
  const permission = { mode: 'read' };
  let root = null;
  let remembered = null;
  let files = null;
  let name = '';
  let revision = 0;

  function validPath(path) {
    return typeof path === 'string' && (path === 'product.json' || path === 'thumbnail.jpg' ||
      path === 'translations/ko.json' || path === 'translations/en.json' || photoPattern.test(path));
  }

  function abortError() {
    return new DOMException('Folder selection canceled', 'AbortError');
  }

  function invalidFolder() {
    return new DOMException('Select the products folder containing numbered product directories.', 'DataError');
  }

  async function stored(mode, operation) {
    if (!window.indexedDB) return null;
    return new Promise((resolve, reject) => {
      const open = indexedDB.open('minicar-archive-folders', 1);
      open.onupgradeneeded = () => open.result.createObjectStore('directories');
      open.onerror = () => reject(open.error);
      open.onblocked = () => reject(new Error('Folder storage is busy'));
      open.onsuccess = () => {
        const db = open.result;
        const tx = db.transaction('directories', mode);
        let request;
        try {
          request = operation(tx.objectStore('directories'));
        } catch (error) {
          db.close();
          reject(error);
          return;
        }
        tx.oncomplete = () => { db.close(); resolve(request.result); };
        tx.onabort = () => { db.close(); reject(tx.error); };
        tx.onerror = () => { db.close(); reject(tx.error); };
      };
    });
  }

  async function validateDirectory(directory) {
    for await (const entry of directory.values()) {
      if (entry.kind !== 'directory' || !idPattern.test(entry.name)) continue;
      try {
        await entry.getFileHandle('product.json');
        return;
      } catch (error) {
        if (error.name !== 'NotFoundError' && error.name !== 'TypeMismatchError') throw error;
      }
    }
    throw invalidFolder();
  }

  function folderInput() {
    const input = document.createElement('input');
    input.type = 'file';
    if (!('webkitdirectory' in input)) {
      throw new DOMException('Folder selection is unavailable in this browser.', 'NotSupportedError');
    }
    input.webkitdirectory = true;
    input.multiple = true;
    input.hidden = true;
    document.body.append(input);
    return new Promise((resolve, reject) => {
      let dialog;
      function finish() {
        dialog?.remove();
        input.remove();
      }
      function cancel() { finish(); reject(abortError()); }
      input.addEventListener('cancel', cancel, {once: true});
      input.addEventListener('change', () => {
        const entries = new Map();
        let folderName = '';
        let valid = false;
        for (const file of input.files) {
          const [top, id, ...parts] = file.webkitRelativePath.split('/');
          const path = parts.join('/');
          if (!idPattern.test(id) || !validPath(path)) continue;
          if (folderName && top !== folderName) continue;
          folderName = top;
          entries.set(id + '/' + path, file);
          if (path === 'product.json') valid = true;
        }
        finish();
        if (valid) resolve({entries, name: folderName});
        else reject(invalidFolder());
      }, {once: true});
      // A denied native picker can consume the activating click. Offer another
      // explicit click for the fallback rather than starting an inert input.
      if (navigator.userActivation && !navigator.userActivation.isActive) {
        dialog = document.createElement('dialog');
        const isEnglish = document.documentElement.lang === 'en';
        const choose = document.createElement('button');
        const dismiss = document.createElement('button');
        choose.type = dismiss.type = 'button';
        choose.textContent = isEnglish ? 'Select products folder' : 'products 폴더 선택';
        dismiss.textContent = isEnglish ? 'Cancel' : '취소';
        choose.addEventListener('click', () => input.click());
        dismiss.addEventListener('click', cancel);
        dialog.addEventListener('cancel', cancel);
        dialog.append(choose, dismiss, input);
        document.body.append(dialog);
        dialog.showModal();
      } else {
        input.click();
      }
    });
  }

  async function restore() {
    const current = revision;
    try {
      const handle = await stored('readonly', store => store.get('products'));
      if (!handle || current !== revision) return false;
      remembered = handle;
      if (await handle.queryPermission(permission) !== 'granted') return false;
      try {
        await validateDirectory(handle);
      } catch (error) {
        if (current === revision && ['DataError', 'NotFoundError'].includes(error.name)) remembered = null;
        throw error;
      }
      if (current !== revision) return false;
      root = handle;
      files = null;
      name = handle.name;
      return true;
    } catch {
      return false;
    }
  }

  async function connect() {
    const current = ++revision;
    let handle;
    if (typeof window.showDirectoryPicker === 'function') {
      try {
        if (remembered && !root && await remembered.requestPermission(permission) === 'granted') {
          handle = remembered;
        } else {
          handle = await window.showDirectoryPicker({ id: 'minicar-products', mode: 'read' });
        }
        await validateDirectory(handle);
      } catch (error) {
        if (handle === remembered && current === revision) remembered = null;
        if (error.name !== 'SecurityError' && error.name !== 'NotAllowedError') throw error;
        handle = null;
      }
    }
    if (handle) {
      if (current !== revision) throw abortError();
      root = remembered = handle;
      files = null;
      name = handle.name;
      await stored('readwrite', store => store.put(handle, 'products')).catch(() => {});
    } else {
      const chosen = await folderInput();
      if (current !== revision) throw abortError();
      root = remembered = null;
      files = chosen.entries;
      name = chosen.name;
      await stored('readwrite', store => store.delete('products')).catch(() => {});
    }
    return true;
  }

  async function disconnect() {
    ++revision;
    root = remembered = files = null;
    name = '';
    await stored('readwrite', store => store.delete('products')).catch(() => {});
  }

  async function file(productId, path) {
    const id = String(productId);
    if (!idPattern.test(id) || !validPath(path)) return null;
    if (files) return files.get(id + '/' + path) || null;
    if (!root) return null;
    try {
      let dir = await root.getDirectoryHandle(id);
      const [first, second] = path.split('/');
      if (second) dir = await dir.getDirectoryHandle(first);
      const handle = await dir.getFileHandle(second || first);
      return await handle.getFile();
    } catch {
      return null;
    }
  }

  async function json(productId, path) {
    if (!validPath(path) || !path.endsWith('.json')) return null;
    const data = await file(productId, path);
    if (!data) return null;
    try { return JSON.parse(await data.text()); } catch { return null; }
  }

  window.archiveFolder = Object.freeze({
    get connected() { return Boolean(root || files); },
    get directoryName() { return name; },
    restore, connect, disconnect, file, json
  });
})();

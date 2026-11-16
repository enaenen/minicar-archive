'use strict';

window.garageCatalog = (() => {
  const size = 24;
  const normalize = value => String(value ?? '').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  let loaded;

  async function loadCatalogData() {
    if (typeof window.readArchiveCatalog === 'function') return window.readArchiveCatalog();
    const response = await fetch(new URL('./catalog.json', document.baseURI));
    if (!response.ok) throw new Error('Catalog is unavailable.');
    return response.json();
  }

  async function load() {
    if (!loaded) {
      loaded = loadCatalogData().then(catalog => {
        const byId = new Map(catalog.products.map(product => [product.id, product]));
        const years = [...new Set(catalog.products.map(p => p.month.slice(0,4)).filter(Boolean))].sort().reverse();
        const facets = {};
        for (const lang of ['ko', 'en']) {
          facets[lang] = {years, brands: Object.entries(catalog.brands).map(([value, labels]) => ({value, label:labels[lang]}))
            .sort((a,b) => a.label.localeCompare(b.label, lang))};
        }
        return {...catalog, byId, facets};
      }).catch(error => { loaded = null; throw error; });
    }
    return loaded;
  }

  function card(catalog, p, lang, owned) {
    const names = p[lang];
    return {id: p.id, code: p.code, title: names.title, model: names.model, series: names.series,
      brand: p.brands.map(key => catalog.brands[key][lang]).join(' / '), scale: p.scale, release_month: p.month,
      thumbnail: p.thumbnail || '', owned: owned.has(p.id)};
  }

  async function search(params, lang, owned) {
    const catalog = await load();
    const q = (params.get('q') || '').trim().slice(0,200);
    const terms = q.split(/\s+/).map(normalize).filter(Boolean);
    const brand = params.get('brand');
    const year = params.get('year');
    const month = params.get('month');
    const state = params.get('owned');
    const rows = catalog.products.filter(p =>
      (!brand || p.brands.includes(brand)) &&
      (!/^\d{4}$/.test(year) || p.month.startsWith(year)) &&
      (!/^(?:0?[1-9]|1[0-2])$/.test(month) || p.month.slice(5) === month.padStart(2,'0')) &&
      (state !== 'yes' || owned.has(p.id)) && (state !== 'no' || !owned.has(p.id)) &&
      terms.every(term => p.search.includes(term)));
    if (terms.length) {
      const k = normalize(q);
      const priority = p => normalize(p.code) === k ? 2 :
        [p.ko.title, p.en.title, p.ja].some(title => normalize(title).includes(k)) ? 1 : 0;
      const buckets = [[],[],[]];
      for (const item of rows) buckets[priority(item)].push(item);
      rows.splice(0,rows.length,...buckets[2],...buckets[1],...buckets[0]);
    }
    const pages = Math.max(1, Math.ceil(rows.length / size));
    const requested = Number(params.get('page'));
    const page = Number.isSafeInteger(requested) ? Math.min(pages,Math.max(1,requested)) : 1;
    let count = 0;
    for (const id of owned) if (catalog.byId.has(id)) count++;
    return {total: rows.length, items: rows.slice((page-1)*size,page*size).map(p => card(catalog,p,lang,owned)),
      stats: {total: catalog.products.length, owned: count}, facets: catalog.facets[lang], page, pages};
  }

  async function product(id, lang, owned) {
    const catalog = await load();
    const p = catalog.byId.get(Number(id));
    if (!p) throw new Error('Unknown product');
    return {...card(catalog,p,lang,owned), title_ja: p.ja, description: p[lang].description,
      source_url: 'https://minicar.tomytec.co.jp/product/detail.html?id=' + p.id};
  }
  return {search, product};
})();

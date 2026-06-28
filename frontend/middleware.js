export const config = {
  matcher: ['/', '/catalog', '/catalog/(.*)', '/product/(.*)'],
};

const API = 'https://luxplast-kg.onrender.com/api';
const SITE = 'https://luxplast-kg.vercel.app';
const BASE_TITLE = 'LUXPLAST.KG — Одноразовая посуда и упаковка';
const BASE_DESC =
  'Одноразовая посуда и упаковочные материалы. Бишкек, рынок Дордой. Оптом и в розницу, бесплатная доставка по КР.';

async function getMeta(pathname) {
  if (pathname === '/catalog') {
    return {
      title: 'Каталог — LUXPLAST.KG',
      description:
        'Каталог одноразовой посуды и упаковочных материалов. Коробки для пиццы, ланч-боксы, стаканы, пакеты. Бишкек, Дордой.',
    };
  }

  if (pathname.startsWith('/catalog/')) {
    const slug = pathname.slice('/catalog/'.length);
    try {
      const res = await fetch(`${API}/categories`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const cats = await res.json();
        const cat = cats.find((c) => c.slug === slug);
        if (cat) {
          return {
            title: `${cat.name} — LUXPLAST.KG`,
            description: `${cat.name} — купить оптом и в розницу в Бишкеке. Рынок Дордой. Бесплатная доставка по КР.`,
          };
        }
      }
    } catch {}
  }

  if (pathname.startsWith('/product/')) {
    const slug = pathname.slice('/product/'.length);
    try {
      const res = await fetch(`${API}/products/${slug}`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const p = await res.json();
        return {
          title: `${p.name} — LUXPLAST.KG`,
          description: p.description
            ? p.description.replace(/\s+/g, ' ').slice(0, 160)
            : `${p.name} — купить оптом и в розницу. Бишкек, рынок Дордой.`,
        };
      }
    } catch {}
  }

  return { title: BASE_TITLE, description: BASE_DESC };
}

export default async function middleware(req) {
  const url = new URL(req.url);
  const { title, description } = await getMeta(url.pathname);

  const htmlRes = await fetch(new URL('/index.html', url.origin));
  let html = await htmlRes.text();

  const ogUrl = `${SITE}${url.pathname}`;
  const metaTags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${ogUrl}">`,
    `<meta property="og:site_name" content="LUXPLAST.KG">`,
    `<meta name="twitter:card" content="summary">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
  ].join('\n    ');

  html = html
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/, '')
    .replace('<head>', `<head>\n    ${metaTags}`);

  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

import { useEffect } from 'react';

const BASE = 'LUXPLAST.KG';
const BASE_DESC = 'Одноразовая посуда и упаковочные материалы. Бишкек, рынок Дордой. Оптом и в розницу, бесплатная доставка по КР.';

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : `${BASE} — Одноразовая посуда и упаковка`;

    const desc = description || BASE_DESC;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);
  }, [title, description]);
}

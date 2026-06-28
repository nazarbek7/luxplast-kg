import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Search, X, ChevronRight, Loader2, SlidersHorizontal } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ui/ProductCard';
import { categoryApi, productApi } from '../services/api';

export default function CatalogPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  useEffect(() => {
    categoryApi.getAll().then((cats) => {
      setCategories(cats);
      setCategoriesLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!categoriesLoaded) return;
    const found = categorySlug ? categories.find((c) => c.slug === categorySlug) || null : null;
    setActiveCategory(found);
  }, [categorySlug, categoriesLoaded]);

  useEffect(() => {
    if (!categoriesLoaded) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      setProducts([]);
      const params = { page, limit: 16 };
      if (activeCategory) params.category = activeCategory._id;
      if (search.trim()) params.search = search.trim();
      productApi
        .getAll(params)
        .then((data) => {
          if (cancelled) return;
          setProducts(data.products || []);
          setTotalPages(data.totalPages || 1);
          setTotal(data.total || 0);
        })
        .catch(() => { if (!cancelled) { setProducts([]); setTotal(0); } })
        .finally(() => { if (!cancelled) setLoading(false); });
    }, search ? 400 : 0);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [activeCategory, search, page, categoriesLoaded]);

  const handleCategoryClick = (cat) => {
    setSidebarOpen(false);
    setSearch('');
    setPage(1);
    navigate(cat ? `/catalog/${cat.slug}` : '/catalog');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-brand">Главная</Link>
          <ChevronRight size={14} />
          {activeCategory ? (
            <>
              <Link to="/catalog" className="hover:text-brand">Каталог</Link>
              <ChevronRight size={14} />
              <span className="text-gray-800 font-medium">{activeCategory.name}</span>
            </>
          ) : (
            <span className="text-gray-800 font-medium">Каталог</span>
          )}
        </div>
      </div>

      {/* Контент */}
      <div className="flex-1 w-full">
      <div className="container-custom py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[208px_1fr] xl:grid-cols-[224px_1fr] gap-6 items-start">

        {/* Сайдбар — выровнен с логотипом */}
        <aside className="hidden lg:flex flex-col w-52 xl:w-56 bg-white rounded-2xl border border-gray-100 p-3 sticky top-20 self-start">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2 pb-2 pt-1">
            Категории
          </p>
          <button
            onClick={() => handleCategoryClick(null)}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              !activeCategory ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            Все товары
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryClick(cat)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeCategory?._id === cat._id
                  ? 'bg-brand text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </aside>

        {/* Мобильный сайдбар */}
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-2xl flex flex-col lg:hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-semibold text-gray-800">Категории</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
                <button onClick={() => handleCategoryClick(null)} className={`w-full text-left px-3 py-3 rounded-xl text-sm font-medium ${!activeCategory ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  Все товары
                </button>
                {categories.map((cat) => (
                  <button key={cat._id} onClick={() => handleCategoryClick(cat)} className={`w-full text-left px-3 py-3 rounded-xl text-sm font-medium ${activeCategory?._id === cat._id ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Правая колонка: поиск + товары */}
        <div className="min-w-0 flex flex-col gap-4">

          {/* Поиск + фильтр */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 bg-white rounded-xl px-3 py-2 flex-shrink-0"
            >
              <SlidersHorizontal size={15} />
              Фильтр
              {activeCategory && <span className="w-1.5 h-1.5 rounded-full bg-brand ml-0.5" />}
            </button>

            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Поиск товара..."
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-blue-50 text-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {!loading && total > 0 && (
              <span className="text-sm text-gray-500 hidden sm:block flex-shrink-0">
                {activeCategory?.name || 'Все товары'} ·{' '}
                <span className="font-semibold text-gray-700">{total} товаров</span>
              </span>
            )}
          </div>

          {/* Спиннер */}
          {loading && (
            <div className="w-full flex flex-col items-center justify-center py-32 gap-3">
              <Loader2 size={36} className="animate-spin text-brand" />
              <p className="text-sm text-gray-400">Загружаем товары...</p>
            </div>
          )}

          {/* Пусто */}
          {!loading && products.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-gray-700 font-semibold text-lg">Товары не найдены</p>
              <p className="text-gray-400 text-sm mt-1 text-center">
                {search ? `По запросу «${search}» ничего не найдено` : 'В этой категории пока нет товаров'}
              </p>
              {(search || activeCategory) && (
                <button onClick={() => { setSearch(''); handleCategoryClick(null); }} className="mt-4 btn-primary py-2 text-sm">
                  Показать все товары
                </button>
              )}
            </div>
          )}

          {/* Сетка товаров */}
          {!loading && products.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        p === page ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </div>
      </div>

      <Footer />
    </div>
  );
}

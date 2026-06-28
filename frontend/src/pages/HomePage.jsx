import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Award, Users, Phone, CheckCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ui/ProductCard';
import CategoryCard from '../components/ui/CategoryCard';
import { categoryApi, productApi } from '../services/api';
import { usePageMeta } from '../hooks/usePageMeta';

const WA_LINK = 'https://wa.me/996504502233';

const ADVANTAGES = [
  { icon: Truck, title: 'Бесплатная доставка', desc: 'По всему Кыргызстану. Доставляем в любой город и район страны.', color: 'text-blue-600 bg-blue-50' },
  { icon: Award, title: 'Гарантия качества', desc: 'Работаем только с проверенными поставщиками. Вся продукция сертифицирована.', color: 'text-amber-600 bg-amber-50' },
  { icon: Users, title: 'Оптом и в розницу', desc: 'Специальные цены для кафе, ресторанов и оптовых покупателей.', color: 'text-green-600 bg-green-50' },
  { icon: Phone, title: 'Быстрый заказ', desc: 'Заказывайте через WhatsApp — ответим в течение нескольких минут.', color: 'text-purple-600 bg-purple-50' },
];

export default function HomePage() {
  usePageMeta(null, 'Одноразовая посуда и упаковочные материалы оптом и в розницу. Бишкек, рынок Дордой. Бесплатная доставка по КР.');
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      categoryApi.getAll(),
      productApi.getAll({ featured: true, limit: 8 }),
    ])
      .then(([cats, prods]) => {
        setCategories(cats.slice(0, 8));
        setFeatured(prods.products || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-dark via-brand to-brand-light overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container-custom relative py-16 md:py-24 lg:py-32 text-white">
          <div className="max-w-2xl animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-sm font-medium px-3 py-1.5 rounded-full mb-6">
              <CheckCircle size={14} />
              Оптом и в розницу · Бесплатная доставка по КР
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              LUXPLAST<span className="text-primary-200">.KG</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-2 font-medium">
              Одноразовая посуда и упаковочные материалы
            </p>
            <p className="text-primary-200 text-base mb-8 max-w-xl">
              Широкий ассортимент для кафе, ресторанов, фаст-фуда, кондитерских и магазинов. Бишкек, рынок «Дордой».
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/catalog" className="btn-primary bg-white text-brand hover:bg-primary-50 shadow-xl">
                Смотреть каталог
                <ArrowRight size={18} />
              </Link>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                Заказать в WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container-custom py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[['500+', 'товаров в наличии'], ['100+', 'постоянных клиентов'], ['5+', 'лет на рынке'], ['0 сом', 'доставка по КР']].map(([val, label]) => (
            <div key={label}>
              <div className="text-xl font-extrabold text-brand">{val}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Категории товаров</h2>
            <Link to="/catalog" className="text-brand font-medium text-sm hover:underline flex items-center gap-1">
              Все категории <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map((cat, i) => (
                <CategoryCard key={cat._id} category={cat} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured products */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Популярные товары</h2>
              <p className="text-gray-500 text-sm mt-1">Самые продаваемые позиции</p>
            </div>
            <Link to="/catalog" className="text-brand font-medium text-sm hover:underline flex items-center gap-1">
              Весь каталог <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-72 bg-white rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          {!loading && featured.length === 0 && (
            <div className="text-center py-12 text-gray-400">Товары загружаются...</div>
          )}
        </div>
      </section>

      {/* Advantages */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <h2 className="section-title text-center mb-10">Почему выбирают нас?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADVANTAGES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card p-6 text-center">
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={26} />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 md:py-16 bg-brand">
        <div className="container-custom text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Нужен оптовый заказ?</h2>
          <p className="text-primary-200 mb-6 max-w-xl mx-auto">
            Свяжитесь с нами через WhatsApp и получите специальные условия для оптовых покупателей и кафе/ресторанов.
          </p>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-whatsapp text-base px-8 py-4">
            Написать в WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

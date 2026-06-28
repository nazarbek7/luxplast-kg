import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, ShoppingBag, Star, TrendingUp, ArrowRight } from 'lucide-react';
import { categoryApi, productApi } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ categories: 0, products: 0, featured: 0 });
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    Promise.all([
      categoryApi.getAll(),
      productApi.getAll({ limit: 5 }),
      productApi.getAll({ featured: true, limit: 1 }),
    ]).then(([cats, prods, feat]) => {
      setStats({
        categories: cats.length,
        products: prods.total || 0,
        featured: feat.total || 0,
      });
      setRecentProducts(prods.products || []);
    });
  }, []);

  const STAT_CARDS = [
    { label: 'Категорий', value: stats.categories, icon: FolderOpen, color: 'bg-blue-50 text-blue-600', link: '/admin/categories' },
    { label: 'Товаров', value: stats.products, icon: ShoppingBag, color: 'bg-green-50 text-green-600', link: '/admin/products' },
    { label: 'Хит-товаров', value: stats.featured, icon: Star, color: 'bg-amber-50 text-amber-600', link: '/admin/products' },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
        <p className="text-gray-500 text-sm mt-1">Обзор вашего магазина</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} to={link} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
              <Icon size={22} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent products */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-brand" /> Последние товары
          </h2>
          <Link to="/admin/products" className="text-sm text-brand hover:underline flex items-center gap-1">
            Все <ArrowRight size={14} />
          </Link>
        </div>
        <div className="space-y-3">
          {recentProducts.map((p) => (
            <div key={p._id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ShoppingBag size={16} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">{p.name}</p>
                <p className="text-xs text-gray-400">{p.category?.name}</p>
              </div>
              <div className="text-sm font-semibold text-brand flex-shrink-0">
                {p.price ? `${p.price} сом` : '—'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

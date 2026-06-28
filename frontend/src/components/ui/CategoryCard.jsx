import { Link } from 'react-router-dom';
import { Package, Pizza, Box, Coffee, Disc, ShoppingBag, Utensils, Container, Archive } from 'lucide-react';

const ICON_MAP = {
  Pizza, Box, Coffee, Disc, ShoppingBag, Utensils, Container, Package: Package, Archive,
};

const COLORS = [
  'from-blue-50 to-blue-100 text-blue-700 border-blue-200',
  'from-green-50 to-green-100 text-green-700 border-green-200',
  'from-amber-50 to-amber-100 text-amber-700 border-amber-200',
  'from-purple-50 to-purple-100 text-purple-700 border-purple-200',
  'from-rose-50 to-rose-100 text-rose-700 border-rose-200',
  'from-cyan-50 to-cyan-100 text-cyan-700 border-cyan-200',
  'from-orange-50 to-orange-100 text-orange-700 border-orange-200',
  'from-indigo-50 to-indigo-100 text-indigo-700 border-indigo-200',
];

export default function CategoryCard({ category, index = 0 }) {
  const IconComponent = ICON_MAP[category.icon] || Package;
  const colorClass = COLORS[index % COLORS.length];

  return (
    <Link
      to={`/catalog/${category.slug}`}
      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border bg-gradient-to-br ${colorClass} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center`}
    >
      <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center shadow-sm">
        <IconComponent size={24} />
      </div>
      <span className="font-semibold text-sm leading-tight">{category.name}</span>
    </Link>
  );
}

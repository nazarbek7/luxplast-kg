import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Tag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const PLACEHOLDER = 'https://placehold.co/400x400/e0f2fe/0369a1?text=LUXPLAST';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const image = product.images?.[0] || PLACEHOLDER;
  const price = product.price ? `${product.price.toLocaleString()} сом` : 'Цена по запросу';

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="card group flex flex-col overflow-hidden">
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden aspect-square bg-gray-50">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
          loading="lazy"
        />
        {product.isFeatured && (
          <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Tag size={10} /> Хит
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-700 text-sm font-semibold px-3 py-1 rounded-full">Нет в наличии</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        <Link to={`/product/${product.slug}`} className="font-semibold text-gray-800 hover:text-brand line-clamp-2 text-sm leading-snug flex-1">
          {product.name}
        </Link>
        {product.category?.name && (
          <span className="text-xs text-gray-400">{product.category.name}</span>
        )}
        <div className="font-bold text-brand text-base">{price}</div>

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            added
              ? 'bg-green-500 text-white'
              : product.inStock
              ? 'bg-brand text-white hover:bg-brand-dark active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {added ? (
            <><Check size={15} /> Добавлено</>
          ) : (
            <><ShoppingCart size={15} /> В корзину</>
          )}
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Package, Loader2, AlertCircle, CheckCircle, ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ui/ProductCard';
import { productApi } from '../services/api';
import { useCart } from '../context/CartContext';

const PLACEHOLDER = 'https://placehold.co/600x600/e0f2fe/0369a1?text=LUXPLAST';
const WA_NUMBER = '996504502233';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setQty(1);
    productApi.getOne(slug)
      .then((p) => {
        setProduct(p);
        setSelectedImage(0);
        if (p.category?._id) {
          productApi.getAll({ category: p.category._id, limit: 4 }).then((data) => {
            setRelated((data.products || []).filter((r) => r._id !== p._id).slice(0, 4));
          });
        }
      })
      .catch(() => setError('Товар не найден'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={40} className="animate-spin text-brand" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <AlertCircle size={48} className="text-red-400" />
          <p className="text-gray-500 text-lg">{error || 'Товар не найден'}</p>
          <Link to="/catalog" className="btn-primary">Вернуться в каталог</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images?.length ? product.images : [PLACEHOLDER];
  const price = product.price ? `${product.price.toLocaleString()} ${product.priceUnit || 'сом'}` : 'Цена по запросу';
  const waText = encodeURIComponent(
    `Здравствуйте! Хочу заказать:\n• ${product.name} — ${qty} шт${product.price ? ` (${(product.price * qty).toLocaleString()} сом)` : ''}\n\nПрошу связаться для подтверждения.`
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-3 flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link to="/" className="hover:text-brand">Главная</Link>
          <ChevronRight size={14} />
          <Link to="/catalog" className="hover:text-brand">Каталог</Link>
          {product.category && (
            <>
              <ChevronRight size={14} />
              <Link to={`/catalog/${product.category.slug}`} className="hover:text-brand">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight size={14} />
          <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* Product detail */}
      <section className="container-custom py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = PLACEHOLDER; }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-brand' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = PLACEHOLDER; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            {product.isFeatured && (
              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full w-fit">
                ⭐ Хит продаж
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>

            {product.category && (
              <div className="flex items-center gap-2">
                <Package size={14} className="text-gray-400" />
                <Link to={`/catalog/${product.category.slug}`} className="text-sm text-brand hover:underline">
                  {product.category.name}
                </Link>
              </div>
            )}

            <div className="text-3xl font-extrabold text-brand">{price}</div>

            <div className="flex items-center gap-2">
              {product.inStock ? (
                <span className="flex items-center gap-1.5 text-green-600 font-medium text-sm">
                  <CheckCircle size={16} /> В наличии
                </span>
              ) : (
                <span className="text-red-500 font-medium text-sm">Нет в наличии</span>
              )}
            </div>

            {product.description && (
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            )}

            {/* Specifications */}
            {product.specifications?.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Характеристики</h3>
                <dl className="space-y-2">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <dt className="text-gray-500">{spec.key}</dt>
                      <dd className="font-medium text-gray-800">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Qty + Add to cart */}
            {product.inStock && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-brand hover:text-brand transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-bold text-gray-800 text-lg">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-brand hover:text-brand transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {product.price && (
                  <span className="text-gray-400 text-sm">
                    = <span className="font-bold text-gray-700">{(product.price * qty).toLocaleString()} сом</span>
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-semibold transition-all duration-200 ${
                  added
                    ? 'bg-green-500 text-white'
                    : product.inStock
                    ? 'bg-brand text-white hover:bg-brand-dark active:scale-95'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {added ? (
                  <><Check size={20} /> Добавлено в корзину</>
                ) : (
                  <><ShoppingCart size={20} /> В корзину</>
                )}
              </button>

              <a
                href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp flex-1 py-4 text-base"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Заказать в WhatsApp
              </a>
            </div>

            <div className="text-xs text-gray-400 flex items-center gap-1">
              🚚 Бесплатная доставка по всему Кыргызстану
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-10 md:py-14">
          <div className="container-custom">
            <h2 className="section-title mb-6">Похожие товары</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

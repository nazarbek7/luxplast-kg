import { X, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const PLACEHOLDER = 'https://placehold.co/80x80/e0f2fe/0369a1?text=LP';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalPrice, clearCart, sendToWhatsApp } = useCart();

  if (!isOpen) return null;

  const handleQtyInput = (productId, value) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1) updateQty(productId, num);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[60] w-full max-w-xs bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.10)] flex flex-col border-l border-gray-100">

      {/* Шапка */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-brand" />
          <span className="font-bold text-gray-800">Корзина</span>
          {items.length > 0 && (
            <span className="bg-brand text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {items.length}
            </span>
          )}
        </div>
        <button onClick={closeCart} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Пустая */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
          <ShoppingCart size={48} className="text-gray-200" />
          <p className="text-gray-500 font-medium">Корзина пуста</p>
          <p className="text-gray-400 text-sm">Добавьте товары из каталога</p>
        </div>
      ) : (
        <>
          {/* Список */}
          <div className="flex-1 overflow-y-auto py-2 px-3 space-y-2">
            {items.map(({ product, qty }) => (
              <div key={product._id} className="flex gap-2.5 bg-gray-50 rounded-xl p-2.5">
                <img
                  src={product.images?.[0] || PLACEHOLDER}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-white"
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">
                    {product.name}
                  </p>
                  {product.price && (
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {product.price.toLocaleString()} сом / шт
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-1.5">
                    {/* Кол-во: − [input] + */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQty(product._id, qty - 1)}
                        disabled={qty <= 1}
                        className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand hover:text-brand disabled:opacity-40 transition-colors"
                      >
                        <Minus size={11} />
                      </button>

                      <input
                        type="number"
                        min="1"
                        value={qty}
                        onChange={(e) => handleQtyInput(product._id, e.target.value)}
                        className="w-10 h-6 text-center text-xs font-bold text-gray-800 border border-gray-200 rounded-md bg-white focus:outline-none focus:border-brand"
                        style={{ MozAppearance: 'textfield' }}
                      />

                      <button
                        onClick={() => updateQty(product._id, qty + 1)}
                        className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand hover:text-brand transition-colors"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {product.price && (
                        <span className="text-xs font-bold text-brand">
                          {(product.price * qty).toLocaleString()} сом
                        </span>
                      )}
                      <button
                        onClick={() => removeItem(product._id)}
                        className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Итого */}
          <div className="border-t border-gray-100 px-4 py-3 space-y-2.5 flex-shrink-0">
            {totalPrice > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Итого</span>
                <span className="text-lg font-extrabold text-brand">
                  {totalPrice.toLocaleString()} сом
                </span>
              </div>
            )}

            <button onClick={sendToWhatsApp} className="btn-whatsapp w-full py-2.5 text-sm font-semibold">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Оформить заказ в WhatsApp
            </button>

            <button onClick={clearCart} className="w-full text-center text-xs text-gray-400 hover:text-red-400 transition-colors py-0.5">
              Очистить корзину
            </button>
          </div>
        </>
      )}
    </div>
  );
}

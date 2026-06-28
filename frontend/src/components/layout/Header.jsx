import { Menu, Package2, Phone, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const PHONE = '+996 504 502 233';
const WA_LINK = `https://wa.me/996504502233`;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { totalItems, openCart } = useCart();

  const navLinks = [
    { label: 'Главная', to: '/' },
    { label: 'Каталог', to: '/catalog' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* Top bar */}
      <div className="bg-brand text-white text-sm py-1.5 hidden md:block">
        <div className="container-custom flex justify-between items-center">
          <span>🚚 Бесплатная доставка по всему Кыргызстану</span>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
            📞 {PHONE}
          </a>
        </div>
      </div>

      {/* Main header */}
      <div className="container-custom h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center">
            <Package2 size={20} className="text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-bold text-lg text-brand tracking-tight">LUXPLAST</div>
            <div className="text-xs text-gray-400 -mt-0.5">.KG</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to))
                  ? 'bg-primary-50 text-brand'
                  : 'text-gray-600 hover:text-brand hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand transition-colors">
            <Phone size={16} />
            <span>{PHONE}</span>
          </a>

          {/* Cart button */}
          <button
            onClick={openCart}
            className="relative p-2 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-brand transition-colors"
            aria-label="Корзина"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-0.5">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>

          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-whatsapp py-2 text-sm">
            WhatsApp
          </a>
        </div>

        {/* Mobile: cart + phone + burger */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={openCart}
            className="relative p-2 text-gray-600"
            aria-label="Корзина"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-brand text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5">
                {totalItems}
              </span>
            )}
          </button>
          <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="p-2 text-brand">
            <Phone size={20} />
          </a>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-600">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                pathname === link.to ? 'bg-primary-50 text-brand' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { setMenuOpen(false); openCart(); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ShoppingCart size={18} />
            Корзина {totalItems > 0 && `(${totalItems})`}
          </button>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full mt-2"
          >
            Заказать в WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}

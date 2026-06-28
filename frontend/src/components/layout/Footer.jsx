import { Link } from 'react-router-dom';
import { Package2, Phone, Mail, MapPin, Instagram, Send } from 'lucide-react';

const WA_LINK = 'https://wa.me/996504502233';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center">
              <Package2 size={20} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-lg">LUXPLAST.KG</div>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Одноразовая посуда и упаковочные материалы. Для кафе, ресторанов, фаст-фуда и магазинов.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-gray-700 hover:bg-brand flex items-center justify-center transition-colors">
              <Instagram size={16} />
            </a>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-9 h-9 rounded-full bg-gray-700 hover:bg-green-600 flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            <a href="https://t.me" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-9 h-9 rounded-full bg-gray-700 hover:bg-blue-500 flex items-center justify-center transition-colors">
              <Send size={16} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white font-semibold mb-4">Навигация</h3>
          <ul className="space-y-2 text-sm">
            {[['Главная', '/'], ['Каталог', '/catalog'], ['Контакты', '#contacts']].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold mb-4">Категории</h3>
          <ul className="space-y-2 text-sm">
            {['Коробки для пиццы', 'Ланч-боксы', 'Стаканы', 'Пакеты', 'Одноразовая посуда', 'Контейнеры'].map((cat) => (
              <li key={cat}>
                <Link to="/catalog" className="hover:text-white transition-colors">{cat}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacts */}
        <div id="contacts">
          <h3 className="text-white font-semibold mb-4">Контакты</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 flex-shrink-0 text-brand-light" />
              <a href="tel:+996504502233" className="hover:text-white">+996 504 502 233</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={16} className="mt-0.5 flex-shrink-0 text-brand-light" />
              <a href="mailto:luxplast.kg@gmail.com" className="hover:text-white break-all">luxplast.kg@gmail.com</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 flex-shrink-0 text-brand-light" />
              <span>Бишкек, рынок «Дордой»</span>
            </li>
          </ul>
          <a
            href="https://2gis.kg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-4 text-xs text-brand-light hover:underline"
          >
            📍 Открыть на 2ГИС
          </a>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} LUXPLAST.KG. Все права защищены.</span>
          <span>Оптом и в розницу · Бесплатная доставка по КР</span>
        </div>
      </div>
    </footer>
  );
}

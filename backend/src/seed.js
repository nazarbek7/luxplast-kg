require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

const categories = [
  { name: 'Коробки для пиццы',       slug: 'korobki-dlya-pizza',    icon: 'Pizza',       order: 1, description: 'Картонные и гофрокартонные коробки для пиццы всех размеров' },
  { name: 'Ланч-боксы',              slug: 'lanch-boksy',           icon: 'Box',         order: 2, description: 'Одноразовые контейнеры для доставки и упаковки еды' },
  { name: 'Стаканы',                 slug: 'stakany',               icon: 'Coffee',      order: 3, description: 'Бумажные и пластиковые стаканы для горячих и холодных напитков' },
  { name: 'Крышки для стаканов',     slug: 'kryshki-dlya-stakanov', icon: 'Disc',        order: 4, description: 'Крышки плоские и купольные для стаканов разных диаметров' },
  { name: 'Пакеты',                  slug: 'pakety',                icon: 'ShoppingBag', order: 5, description: 'Майка, мусорные, ZIP-LOCK, фасовочные и вакуумные пакеты' },
  { name: 'Одноразовая посуда',      slug: 'odnorazovaya-posuda',   icon: 'Utensils',    order: 6, description: 'Тарелки, вилки, ложки, ножи, шпажки для шашлыка' },
  { name: 'Контейнеры',             slug: 'konteinery',            icon: 'Container',   order: 7, description: 'Контейнеры для еды, супов и соусов с крышками' },
  { name: 'Упаковочные материалы',   slug: 'upakovochnye-materialy', icon: 'Package',    order: 8, description: 'Фольга, плёнка, пергамент, салфетки, бумажные пакеты' },
];

const getProductsData = (categoryMap) => [
  // Коробки для пиццы
  { name: 'Коробка для пиццы 25×25 см', category: categoryMap['korobki-dlya-pizza'], price: 12, description: '25×25 см, белый гофрокартон, стандарт', isFeatured: true, specifications: [{ key: 'Размер', value: '25×25 см' }, { key: 'Материал', value: 'Гофрокартон' }] },
  { name: 'Коробка для пиццы 30×30 см', category: categoryMap['korobki-dlya-pizza'], price: 15, description: '30×30 см, гофрокартон, усиленная', isFeatured: false, specifications: [{ key: 'Размер', value: '30×30 см' }] },
  { name: 'Коробка для пиццы 35×35 см', category: categoryMap['korobki-dlya-pizza'], price: 18, description: '35×35 см, усиленный гофрокартон', specifications: [{ key: 'Размер', value: '35×35 см' }] },

  // Ланч-боксы
  { name: 'Ланч-бокс 500 мл', category: categoryMap['lanch-boksy'], price: 8, description: 'Одноразовый контейнер с крышкой, 500 мл, PP пластик', isFeatured: true, specifications: [{ key: 'Объём', value: '500 мл' }, { key: 'Материал', value: 'PP пластик' }] },
  { name: 'Ланч-бокс 750 мл', category: categoryMap['lanch-boksy'], price: 10, description: 'Одноразовый контейнер с крышкой, 750 мл', isFeatured: false, specifications: [{ key: 'Объём', value: '750 мл' }] },
  { name: 'Ланч-бокс крафт 1000 мл', category: categoryMap['lanch-boksy'], price: 22, description: 'Экологичный крафт-бокс с крышкой, 1000 мл', isFeatured: true, specifications: [{ key: 'Объём', value: '1000 мл' }, { key: 'Материал', value: 'Крафт-бумага' }] },

  // Стаканы
  { name: 'Бумажный стакан 250 мл', category: categoryMap['stakany'], price: 4, description: 'Бумажный стакан для горячих напитков, 250 мл', isFeatured: true, specifications: [{ key: 'Объём', value: '250 мл' }, { key: 'Тип', value: 'Горячие напитки' }] },
  { name: 'Стакан Ripple 350 мл (двойные стенки)', category: categoryMap['stakany'], price: 7, description: 'Двойные стенки, не обжигает руки, для кофе', isFeatured: true, specifications: [{ key: 'Объём', value: '350 мл' }, { key: 'Стенки', value: 'Двойные' }] },
  { name: 'Пластиковый стакан 500 мл (коктейль)', category: categoryMap['stakany'], price: 5, description: 'Прозрачный PET стакан для холодных напитков', specifications: [{ key: 'Объём', value: '500 мл' }, { key: 'Материал', value: 'PET' }] },
  { name: 'Стакан Bubble Tea 700 мл', category: categoryMap['stakany'], price: 6, description: 'Широкое горлышко 90 мм для жемчужного чая', isFeatured: true, specifications: [{ key: 'Объём', value: '700 мл' }, { key: 'Горлышко', value: '90 мм' }] },

  // Крышки для стаканов
  { name: 'Крышка плоская 80 мм', category: categoryMap['kryshki-dlya-stakanov'], price: 2, description: 'Плоская крышка для стакана диаметром 80 мм', specifications: [{ key: 'Диаметр', value: '80 мм' }, { key: 'Тип', value: 'Флэт' }] },
  { name: 'Крышка купол 90 мм (Bubble Tea)', category: categoryMap['kryshki-dlya-stakanov'], price: 2.5, description: 'Купольная крышка для стакана 90 мм', specifications: [{ key: 'Диаметр', value: '90 мм' }, { key: 'Тип', value: 'Купол' }] },

  // Пакеты
  { name: 'Пакет-майка белый (500 шт)', category: categoryMap['pakety'], price: 180, description: 'Полиэтиленовый пакет-майка, 500 штук в упаковке', isFeatured: true, specifications: [{ key: 'Количество', value: '500 шт' }, { key: 'Цвет', value: 'Белый' }] },
  { name: 'ZIP-LOCK пакет 10×15 см (100 шт)', category: categoryMap['pakety'], price: 45, description: 'Зип-пакеты для хранения, прозрачные', specifications: [{ key: 'Размер', value: '10×15 см' }, { key: 'Количество', value: '100 шт' }] },
  { name: 'Мусорные пакеты 60 л (30 шт)', category: categoryMap['pakety'], price: 35, description: 'Мусорные пакеты 60 литров, прочные', specifications: [{ key: 'Объём', value: '60 л' }, { key: 'Количество', value: '30 шт' }] },

  // Одноразовая посуда
  { name: 'Тарелка пластик 165 мм (100 шт)', category: categoryMap['odnorazovaya-posuda'], price: 55, description: 'Белые пластиковые тарелки, 100 штук', isFeatured: true, specifications: [{ key: 'Диаметр', value: '165 мм' }, { key: 'Количество', value: '100 шт' }] },
  { name: 'Вилка пластиковая (100 шт)', category: categoryMap['odnorazovaya-posuda'], price: 25, description: 'Одноразовые вилки из PS пластика', specifications: [{ key: 'Материал', value: 'PS' }, { key: 'Количество', value: '100 шт' }] },
  { name: 'Набор приборов (ложка+вилка+нож, 50 шт)', category: categoryMap['odnorazovaya-posuda'], price: 65, description: 'Набор одноразовых приборов, 50 комплектов', isFeatured: true, specifications: [{ key: 'Количество', value: '50 наборов' }] },
  { name: 'Шпажки для шашлыка 25 см (100 шт)', category: categoryMap['odnorazovaya-posuda'], price: 30, description: 'Деревянные шпажки для шашлыка, 25 см', specifications: [{ key: 'Длина', value: '25 см' }, { key: 'Количество', value: '100 шт' }] },

  // Контейнеры
  { name: 'Контейнер для соуса 50 мл (100 шт)', category: categoryMap['konteinery'], price: 40, description: 'Маленький контейнер для соуса с крышкой', isFeatured: true, specifications: [{ key: 'Объём', value: '50 мл' }, { key: 'Количество', value: '100 шт' }] },
  { name: 'Контейнер для супа 500 мл (50 шт)', category: categoryMap['konteinery'], price: 75, description: 'Контейнер для горячих блюд, 500 мл', specifications: [{ key: 'Объём', value: '500 мл' }, { key: 'Количество', value: '50 шт' }] },

  // Упаковочные материалы
  { name: 'Алюминиевая фольга 100 м', category: categoryMap['upakovochnye-materialy'], price: 120, description: 'Пищевая алюминиевая фольга, рулон 100 метров', isFeatured: true, specifications: [{ key: 'Длина', value: '100 м' }, { key: 'Ширина', value: '30 см' }] },
  { name: 'Пищевая плёнка 200 м', category: categoryMap['upakovochnye-materialy'], price: 95, description: 'Стрейч-плёнка для упаковки продуктов', specifications: [{ key: 'Длина', value: '200 м' }, { key: 'Ширина', value: '30 см' }] },
  { name: 'Пергаментная бумага 40 м', category: categoryMap['upakovochnye-materialy'], price: 80, description: 'Бумага для выпечки и упаковки', isFeatured: false, specifications: [{ key: 'Длина', value: '40 м' }, { key: 'Ширина', value: '38 см' }] },
  { name: 'Влажные салфетки (1000 шт)', category: categoryMap['upakovochnye-materialy'], price: 350, description: 'Влажные салфетки для кафе и ресторанов', isFeatured: true, specifications: [{ key: 'Количество', value: '1000 шт' }] },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    const createdCategories = await Category.insertMany(categories);
    const categoryMap = {};
    createdCategories.forEach((c) => { categoryMap[c.slug] = c._id; });
    console.log(`Created ${createdCategories.length} categories`);

    const productsData = getProductsData(categoryMap).map((p, i) => ({
      ...p,
      slug: p.name.toLowerCase()
        .replace(/[^a-zа-яё0-9\s]/gi, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() + '-' + (i + 1),
    }));

    const createdProducts = await Product.insertMany(productsData);
    console.log(`Created ${createdProducts.length} products`);

    console.log('\n✅ Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();

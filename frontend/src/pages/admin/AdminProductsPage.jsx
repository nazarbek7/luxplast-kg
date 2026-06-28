import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Save, Search, ImagePlus, Star } from 'lucide-react';
import { productApi, categoryApi, uploadApi } from '../../services/api';

const EMPTY_FORM = {
  name: '', slug: '', description: '', category: '', price: '', priceUnit: 'сом',
  inStock: true, isFeatured: false, isActive: true, images: [],
  specifications: [],
};

const PLACEHOLDER = 'https://placehold.co/80x80/e0f2fe/0369a1?text=IMG';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const loadProducts = () => {
    setLoading(true);
    const params = { page, limit: 15 };
    if (search) params.search = search;
    if (filterCat) params.category = filterCat;
    productApi.getAll(params)
      .then((data) => { setProducts(data.products || []); setTotal(data.total || 0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { categoryApi.getAll().then(setCategories); }, []);
  useEffect(() => {
    const t = setTimeout(loadProducts, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [page, search, filterCat]);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, category: categories[0]?._id || '' });
    setEditTarget(null);
    setError('');
    setModal('create');
  };

  const openEdit = (p) => {
    setForm({
      name: p.name, slug: p.slug, description: p.description || '',
      category: p.category?._id || p.category || '',
      price: p.price ?? '', priceUnit: p.priceUnit || 'сом',
      inStock: p.inStock, isFeatured: p.isFeatured, isActive: p.isActive,
      images: p.images || [],
      specifications: p.specifications || [],
    });
    setEditTarget(p);
    setError('');
    setModal('edit');
  };

  const closeModal = () => { setModal(null); setEditTarget(null); };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadApi.upload(file);
      setForm((p) => ({ ...p, images: [...p.images, url] }));
    } catch {
      setError('Ошибка загрузки изображения');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (i) => setForm((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));

  const addSpec = () => setForm((p) => ({ ...p, specifications: [...p.specifications, { key: '', value: '' }] }));
  const updateSpec = (i, field, value) => setForm((p) => {
    const specs = [...p.specifications];
    specs[i] = { ...specs[i], [field]: value };
    return { ...p, specifications: specs };
  });
  const removeSpec = (i) => setForm((p) => ({ ...p, specifications: p.specifications.filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    if (!form.name.trim()) return setError('Название обязательно');
    if (!form.category) return setError('Выберите категорию');
    setSaving(true);
    setError('');
    const payload = { ...form, price: form.price === '' ? null : Number(form.price) };
    try {
      if (modal === 'create') {
        await productApi.create(payload);
      } else {
        await productApi.update(editTarget._id, payload);
      }
      closeModal();
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Удалить товар "${p.name}"?`)) return;
    await productApi.remove(p._id);
    loadProducts();
  };

  const f = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const totalPages = Math.ceil(total / 15);

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Товары</h1>
          <p className="text-gray-500 text-sm mt-1">{total} товаров</p>
        </div>
        <button onClick={openCreate} className="btn-primary py-2.5">
          <Plus size={18} /> Добавить
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Поиск товара..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand text-sm bg-white" />
        </div>
        <select value={filterCat} onChange={(e) => { setFilterCat(e.target.value); setPage(1); }} className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand text-sm bg-white">
          <option value="">Все категории</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand" size={32} /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Товар</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Категория</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Цена</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden sm:table-cell">Статус</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                        {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">IMG</div>}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-800 flex items-center gap-1">
                          {p.isFeatured && <Star size={12} className="text-amber-400 flex-shrink-0" />}
                          {p.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.category?.name || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-brand">{p.price ? `${p.price} ${p.priceUnit}` : '—'}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {p.inStock ? 'В наличии' : 'Нет'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand hover:bg-primary-50 transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand'}`}>{p}</button>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-900">
                {modal === 'create' ? 'Новый товар' : 'Редактировать товар'}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-4">
              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Изображения</label>
                <div className="flex gap-2 flex-wrap">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = PLACEHOLDER; }} />
                      <button onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  <label className={`w-16 h-16 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-brand hover:bg-primary-50 transition-colors ${uploading ? 'opacity-50' : ''}`}>
                    {uploading ? <Loader2 size={16} className="animate-spin text-brand" /> : <><ImagePlus size={18} className="text-gray-400" /><span className="text-xs text-gray-400 mt-0.5">Фото</span></>}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
                <p className="text-xs text-gray-400 mt-1">Или вставьте URL: <input value="" placeholder="https://..." className="inline border-b border-gray-200 text-xs focus:outline-none focus:border-brand w-40" onBlur={(e) => { if (e.target.value) { setForm((p) => ({ ...p, images: [...p.images, e.target.value] })); e.target.value = ''; }}} /></p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Название *</label>
                  <input value={form.name} onChange={f('name')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand focus:ring-2 focus:ring-primary-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Категория *</label>
                  <select value={form.category} onChange={f('category')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand bg-white">
                    <option value="">Выберите...</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Цена (оставьте пустым = по запросу)</label>
                  <div className="flex gap-2">
                    <input type="number" value={form.price} onChange={f('price')} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand" placeholder="0" />
                    <input value={form.priceUnit} onChange={f('priceUnit')} className="w-20 px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand text-sm" placeholder="сом" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Описание</label>
                  <textarea value={form.description} onChange={f('description')} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand resize-none" />
                </div>
              </div>

              {/* Specs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Характеристики</label>
                  <button onClick={addSpec} className="text-xs text-brand hover:underline flex items-center gap-1"><Plus size={12} /> Добавить</button>
                </div>
                <div className="space-y-2">
                  {form.specifications.map((spec, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={spec.key} onChange={(e) => updateSpec(i, 'key', e.target.value)} placeholder="Параметр" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-brand" />
                      <input value={spec.value} onChange={(e) => updateSpec(i, 'value', e.target.value)} placeholder="Значение" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-brand" />
                      <button onClick={() => removeSpec(i)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4">
                {[
                  { key: 'inStock', label: 'В наличии' },
                  { key: 'isFeatured', label: '⭐ Хит продаж' },
                  { key: 'isActive', label: 'Активен (показывать)' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))} className="rounded" />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white">
              <button onClick={closeModal} className="btn-secondary flex-1 py-2.5">Отмена</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-2.5 disabled:opacity-70">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

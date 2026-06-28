import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Save, FolderOpen } from 'lucide-react';
import { categoryApi } from '../../services/api';

const EMPTY_FORM = { name: '', slug: '', description: '', icon: 'Package', order: 0, isActive: true };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    categoryApi.getAll().then(setCategories).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditTarget(null);
    setError('');
    setModal('create');
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', icon: cat.icon || 'Package', order: cat.order || 0, isActive: cat.isActive });
    setEditTarget(cat);
    setError('');
    setModal('edit');
  };

  const closeModal = () => { setModal(null); setEditTarget(null); };

  const handleSave = async () => {
    if (!form.name.trim()) return setError('Название обязательно');
    setSaving(true);
    setError('');
    try {
      if (modal === 'create') {
        await categoryApi.create(form);
      } else {
        await categoryApi.update(editTarget._id, form);
      }
      closeModal();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Удалить категорию "${cat.name}"?`)) return;
    await categoryApi.remove(cat._id);
    load();
  };

  const f = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Категории</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} категорий</p>
        </div>
        <button onClick={openCreate} className="btn-primary py-2.5">
          <Plus size={18} /> Добавить
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand" size={32} /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Название</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Slug</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden sm:table-cell">Порядок</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Статус</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                        <FolderOpen size={15} className="text-brand" />
                      </div>
                      <span className="font-medium text-gray-800">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{cat.order}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cat.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {cat.isActive ? 'Активна' : 'Скрыта'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand hover:bg-primary-50 transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(cat)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {modal === 'create' ? 'Новая категория' : 'Редактировать категорию'}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Название *</label>
                <input value={form.name} onChange={f('name')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand focus:ring-2 focus:ring-primary-100" placeholder="Пицца коробкалары" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
                <input value={form.slug} onChange={f('slug')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand focus:ring-2 focus:ring-primary-100 font-mono text-sm" placeholder="pizza-korobkalary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Описание</label>
                <textarea value={form.description} onChange={f('description')} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand focus:ring-2 focus:ring-primary-100 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Иконка (Lucide)</label>
                  <input value={form.icon} onChange={f('icon')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand text-sm" placeholder="Package" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Порядок</label>
                  <input type="number" value={form.order} onChange={f('order')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand text-sm" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="rounded" />
                <span className="text-sm text-gray-700">Активна (отображается на сайте)</span>
              </label>
              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
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

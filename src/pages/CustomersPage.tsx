import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  Building,
  Edit2,
  Trash2,
  X,
  Loader2,
  ChevronDown,
  Tag,
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string;
  notes: string | null;
  tags: string[] | null;
  created_at: string;
}

const statusOptions = [
  { value: 'lead', label: 'Lead', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200' },
  { value: 'contacted', label: 'Contato Realizado', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200' },
  { value: 'negotiating', label: 'Negociacao', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200' },
  { value: 'proposal', label: 'Proposta Enviada', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200' },
  { value: 'client', label: 'Cliente Fechado', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200' },
  { value: 'lost', label: 'Perdido', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200' },
];

export function CustomersPage() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [saving, setSaving] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead',
    notes: '',
    tags: '',
  });

  useEffect(() => {
    loadCustomers();
  }, [user, filterStatus]);

  const loadCustomers = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filterStatus) {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query) ||
      customer.company?.toLowerCase().includes(query) ||
      customer.phone?.includes(query)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const customerData = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        company: formData.company || null,
        status: formData.status,
        notes: formData.notes || null,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : null,
        user_id: user!.id,
      };

      if (showEditModal && selectedCustomer) {
        const { error } = await supabase
          .from('customers')
          .update(customerData)
          .eq('id', selectedCustomer.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('customers').insert(customerData);

        if (error) throw error;
      }

      await loadCustomers();
      closeModals();
    } catch (error) {
      console.error('Error saving customer:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCustomer) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', selectedCustomer.id);

      if (error) throw error;
      await loadCustomers();
      closeModals();
    } catch (error) {
      console.error('Error deleting customer:', error);
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      company: customer.company || '',
      status: customer.status,
      notes: customer.notes || '',
      tags: customer.tags?.join(', ') || '',
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'lead',
      notes: '',
      tags: '',
    });
  };

  const getStatusConfig = (status: string) => {
    return statusOptions.find((s) => s.value === status) || statusOptions[0];
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950">
      <Navbar />
      <Sidebar />

      <div className="lg:pl-64 pt-16">
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-secondary-900 dark:text-white">CRM</h1>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                {customers.length} {customers.length === 1 ? 'cliente' : 'clientes'}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Cliente
            </button>
          </div>

          {/* Filters */}
          <div className="card p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-12"
                />
              </div>

              <select
                value={filterStatus || ''}
                onChange={(e) => setFilterStatus(e.target.value || null)}
                className="px-4 py-3 bg-white dark:bg-secondary-800 border-2 border-secondary-200 dark:border-secondary-700 rounded-xl focus:border-primary-500 transition-all"
              >
                <option value="">Todos</option>
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {statusOptions.map((status) => {
                const count = customers.filter((c) => c.status === status.value).length;
                return (
                  <button
                    key={status.value}
                    onClick={() => setFilterStatus(filterStatus === status.value ? null : status.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      filterStatus === status.value
                        ? status.color
                        : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 border-secondary-200 dark:border-secondary-700 hover:bg-secondary-200 dark:hover:bg-secondary-700'
                    }`}
                  >
                    {status.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customers List */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="h-6 bg-secondary-200 dark:bg-secondary-700 rounded w-1/4 mb-3" />
                  <div className="h-4 bg-secondary-100 dark:bg-secondary-800 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : filteredCustomers.length > 0 ? (
            <div className="space-y-3">
              {filteredCustomers.map((customer, idx) => {
                const statusConfig = getStatusConfig(customer.status);
                return (
                  <div
                    key={customer.id}
                    className="card p-4 hover:shadow-md transition-all animate-fade-in"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {customer.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-secondary-900 dark:text-white truncate">
                            {customer.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                          {customer.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              {customer.phone}
                            </span>
                          )}
                          {customer.email && (
                            <span className="flex items-center gap-1 truncate">
                              <Mail className="w-3.5 h-3.5" />
                              {customer.email}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditModal(customer)}
                          className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-white transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(customer)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-secondary-500 dark:text-secondary-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Tag className="w-6 h-6 text-secondary-400" />
              </div>
              <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">
                Nenhum cliente
              </h3>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
                {searchQuery || filterStatus ? 'Ajuste os filtros' : 'Adicione seu primeiro cliente'}
              </p>
              {!searchQuery && !filterStatus && (
                <button onClick={() => setShowAddModal(true)} className="btn-primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModals} />
          <div className="relative w-full max-w-lg bg-white dark:bg-secondary-900 rounded-2xl shadow-xl animate-scale-in">
            <div className="flex items-center justify-between p-4 border-b border-secondary-100 dark:border-secondary-800">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                {showEditModal ? 'Editar' : 'Novo Cliente'}
              </h2>
              <button
                onClick={closeModals}
                className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
              >
                <X className="w-5 h-5 text-secondary-500 dark:text-secondary-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-200 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-200 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-200 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-200 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-200 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input-field"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-200 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="vip, prospect"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-200 mb-2">
                  Observacoes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="input-field"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-primary"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModals} />
          <div className="relative w-full max-w-md bg-white dark:bg-secondary-900 rounded-2xl shadow-xl animate-scale-in">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                Excluir Cliente
              </h3>
              <p className="text-secondary-600 dark:text-secondary-300 text-sm mb-6">
                Excluir <strong>{selectedCustomer?.name}</strong>?
              </p>
              <div className="flex gap-3">
                <button onClick={closeModals} className="flex-1 btn-secondary">
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

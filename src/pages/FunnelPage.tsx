import { useState, useEffect, DragEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { Users, DollarSign, TrendingUp, GripVertical } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

const funnelStages = [
  { id: 'lead', title: 'Leads', color: 'bg-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-800' },
  { id: 'contacted', title: 'Contato', color: 'bg-yellow-500', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', borderColor: 'border-yellow-200 dark:border-yellow-800' },
  { id: 'negotiating', title: 'Negociacao', color: 'bg-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20', borderColor: 'border-purple-200 dark:border-purple-800' },
  { id: 'proposal', title: 'Proposta', color: 'bg-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20', borderColor: 'border-orange-200 dark:border-orange-800' },
  { id: 'client', title: 'Cliente', color: 'bg-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20', borderColor: 'border-green-200 dark:border-green-800' },
  { id: 'lost', title: 'Perdidos', color: 'bg-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20', borderColor: 'border-red-200 dark:border-red-800' },
];

export function FunnelPage() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedCustomer, setDraggedCustomer] = useState<Customer | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, [user]);

  const loadCustomers = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: DragEvent, customer: Customer) => {
    setDraggedCustomer(customer);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (e: DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOverStage(null);

    if (!draggedCustomer || draggedCustomer.status === stageId) {
      setDraggedCustomer(null);
      return;
    }

    // Optimistic update
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === draggedCustomer.id ? { ...c, status: stageId } : c
      )
    );

    // Update in database
    try {
      const { error } = await supabase
        .from('customers')
        .update({ status: stageId })
        .eq('id', draggedCustomer.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating customer status:', error);
      // Revert on error
      loadCustomers();
    }

    setDraggedCustomer(null);
  };

  const getCustomersByStage = (stageId: string) => {
    return customers.filter((c) => c.status === stageId);
  };

  const getStageValue = (stageId: string) => {
    // Mock value calculation - in real app this would be based on deal values
    const stageCustomers = getCustomersByStage(stageId);
    const avgValue = stageId === 'client' ? 2500 : stageId === 'proposal' ? 1800 : 500;
    return stageCustomers.length * avgValue;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      <Sidebar />

      <div className="lg:pl-64 pt-16">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-secondary-900">Funil de Vendas</h1>
            <p className="text-secondary-500 mt-1">
              Arraste e solte os cards para mover entre etapas
            </p>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-xl">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Total no Funil</p>
                  <p className="text-xl font-bold text-secondary-900">{customers.length}</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-100 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Fechados</p>
                  <p className="text-xl font-bold text-secondary-900">
                    {getCustomersByStage('client').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-100 rounded-xl">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Em Proposta</p>
                  <p className="text-xl font-bold text-secondary-900">
                    {formatCurrency(getStageValue('proposal'))}
                  </p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary-100 rounded-xl">
                  <DollarSign className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Faturado</p>
                  <p className="text-xl font-bold text-secondary-900">
                    {formatCurrency(getStageValue('client'))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {funnelStages.slice(0, 5).map((stage) => (
                <div key={stage.id} className="animate-pulse">
                  <div className="h-8 bg-secondary-200 rounded mb-4" />
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-24 bg-secondary-100 rounded-xl" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
              {funnelStages.map((stage) => {
                const stageCustomers = getCustomersByStage(stage.id);
                const stageValue = getStageValue(stage.id);
                const isDropTarget = dragOverStage === stage.id;

                return (
                  <div
                    key={stage.id}
                    className={`min-w-[280px] lg:min-w-0 flex-shrink-0 rounded-2xl transition-all ${
                      isDropTarget ? 'ring-2 ring-primary-500 ring-offset-2' : ''
                    }`}
                    onDragOver={(e) => handleDragOver(e, stage.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, stage.id)}
                  >
                    {/* Stage Header */}
                    <div
                      className={`px-4 py-3 rounded-xl mb-3 ${stage.bgColor} border ${stage.borderColor}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                          <h3 className="font-semibold text-secondary-900 text-sm">
                            {stage.title}
                          </h3>
                        </div>
                        <span className="text-sm font-medium text-secondary-600 bg-white px-2 py-0.5 rounded-full">
                          {stageCustomers.length}
                        </span>
                      </div>
                      {stageValue > 0 && (
                        <p className="text-xs text-secondary-500">
                          {formatCurrency(stageValue)}
                        </p>
                      )}
                    </div>

                    {/* Cards */}
                    <div className="space-y-3 min-h-[200px] p-1">
                      {stageCustomers.length > 0 ? (
                        stageCustomers.map((customer) => {
                          const isDragging = draggedCustomer?.id === customer.id;
                          return (
                            <div
                              key={customer.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, customer)}
                              className={`bg-white rounded-xl p-4 border border-secondary-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${
                                isDragging
                                  ? 'opacity-50 scale-95'
                                  : ''
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <GripVertical className="w-4 h-4 text-secondary-300 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                      {customer.name[0].toUpperCase()}
                                    </div>
                                    <h4 className="font-medium text-secondary-900 truncate">
                                      {customer.name}
                                    </h4>
                                  </div>
                                  {customer.company && (
                                    <p className="text-xs text-secondary-500 mt-1 truncate">
                                      {customer.company}
                                    </p>
                                  )}
                                  {customer.phone && (
                                    <p className="text-xs text-secondary-400 mt-1">
                                      {customer.phone}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex items-center justify-center h-32 border-2 border-dashed border-secondary-200 rounded-xl">
                          <p className="text-sm text-secondary-400">Arraste cards aqui</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 card p-6 bg-gradient-to-r from-primary-50 to-primary-100/50 border border-primary-200">
            <h3 className="font-semibold text-secondary-900 mb-2">Como usar o Funil</h3>
            <ul className="text-sm text-secondary-600 space-y-1">
              <li>• Arraste e solte os cards para mover clientes entre etapas</li>
              <li>• Clique em um card para ver detalhes do cliente</li>
              <li>• Os valores sao calculados automaticamente com base no estagio</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

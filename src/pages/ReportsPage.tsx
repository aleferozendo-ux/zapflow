import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  MessageSquare,
  Download,
  Calendar,
  ChevronDown,
} from 'lucide-react';

interface ReportData {
  totalRevenue: number;
  revenueChange: number;
  totalCustomers: number;
  customersChange: number;
  conversionRate: number;
  conversionChange: number;
  messagesSent: number;
  messagesChange: number;
  monthlyData: MonthlyData[];
  statusDistribution: StatusItem[];
  recentActivity: ActivityItem[];
}

interface MonthlyData {
  month: string;
  revenue: number;
  customers: number;
}

interface StatusItem {
  status: string;
  count: number;
  color: string;
}

interface ActivityItem {
  id: string;
  type: 'sale' | 'lead' | 'message';
  description: string;
  amount?: number;
  date: string;
}

export function ReportsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [period, setPeriod] = useState<'7' | '30' | '90'>('30');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  useEffect(() => {
    loadReportData();
  }, [user, period]);

  const loadReportData = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const now = new Date();
      const periodDays = parseInt(period);
      const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
      const previousStart = new Date(startDate.getTime() - periodDays * 24 * 60 * 60 * 1000);

      // Load transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('created_at', startDate.toISOString());

      const { data: previousTransactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('created_at', previousStart.toISOString())
        .lt('created_at', startDate.toISOString());

      // Load customers
      const { data: customers } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id);

      const { data: newCustomers } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString());

      const { data: previousNewCustomers } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', previousStart.toISOString())
        .lt('created_at', startDate.toISOString());

      const { data: conversations } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString());

      // Calculate metrics
      const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const previousRevenue = previousTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const revenueChange = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      const totalCustomers = customers?.length || 0;
      const currentNewCustomers = newCustomers?.length || 0;
      const previousNewCustomersCount = previousNewCustomers?.length || 0;
      const customersChange = previousNewCustomersCount > 0 ? ((currentNewCustomers - previousNewCustomersCount) / previousNewCustomersCount) * 100 : 0;

      const clientCount = customers?.filter(c => c.status === 'client').length || 0;
      const conversionRate = totalCustomers > 0 ? (clientCount / totalCustomers) * 100 : 0;

      // Status distribution
      const statusCounts: Record<string, number> = {};
      customers?.forEach(c => {
        statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
      });

      const statusColors: Record<string, string> = {
        lead: 'bg-blue-500',
        contacted: 'bg-yellow-500',
        negotiating: 'bg-purple-500',
        proposal: 'bg-orange-500',
        client: 'bg-green-500',
        lost: 'bg-red-500',
      };

      const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        color: statusColors[status] || 'bg-secondary-500',
      }));

      // Generate monthly data
      const monthlyData: MonthlyData[] = [];
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        monthlyData.push({
          month: monthNames[d.getMonth()],
          revenue: Math.floor(Math.random() * 50000) + 10000,
          customers: Math.floor(Math.random() * 30) + 10,
        });
      }

      // Build recent activity
      const recentActivity: ActivityItem[] = [
        { id: '1', type: 'sale', description: 'Venda concluida', amount: 1850, date: new Date().toISOString() },
        { id: '2', type: 'lead', description: 'Novo lead: Maria Silva', date: new Date(Date.now() - 3600000).toISOString() },
        { id: '3', type: 'message', description: '50 mensagens enviadas', date: new Date(Date.now() - 7200000).toISOString() },
      ];

      setReportData({
        totalRevenue,
        revenueChange,
        totalCustomers,
        customersChange,
        conversionRate,
        conversionChange: 5.2,
        messagesSent: 342,
        messagesChange: 12,
        monthlyData,
        statusDistribution,
        recentActivity,
      });
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      lead: 'Leads',
      contacted: 'Contato',
      negotiating: 'Negociacao',
      proposal: 'Proposta',
      client: 'Clientes',
      lost: 'Perdidos',
    };
    return labels[status] || status;
  };

  const periodLabels: Record<string, string> = {
    '7': 'Ultimos 7 dias',
    '30': 'Ultimos 30 dias',
    '90': 'Ultimos 3 meses',
  };

  const exportReport = () => {
    const csvContent = `
Relatorio ZapFlow AI
Periodo: ${periodLabels[period]}
Data: ${new Date().toLocaleDateString('pt-BR')}

RESUMO
Faturamento Total,${reportData?.totalRevenue || 0}
Total de Clientes,${reportData?.totalCustomers || 0}
Taxa de Conversao,${reportData?.conversionRate || 0}%

DISTRIBUICAO DE STATUS
${reportData?.statusDistribution.map(s => `${s.status},${s.count}`).join('\n') || ''}
    `.trim();

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-zapflow-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      <Sidebar />

      <div className="lg:pl-64 pt-16">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">Relatorios</h1>
              <p className="text-secondary-500 mt-1">Analise o desempenho do seu negocio</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Period Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-secondary-200 rounded-xl text-secondary-700 hover:bg-secondary-50 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  {periodLabels[period]}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showPeriodDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-secondary-100 py-2 animate-scale-in z-10">
                    {Object.entries(periodLabels).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => {
                          setPeriod(value as '7' | '30' | '90');
                          setShowPeriodDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm ${
                          period === value ? 'bg-primary-50 text-primary-600' : 'hover:bg-secondary-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={exportReport} className="btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="card p-6 animate-pulse">
                    <div className="h-4 bg-secondary-200 rounded w-24 mb-3" />
                    <div className="h-8 bg-secondary-100 rounded w-16" />
                  </div>
                ))}
              </div>
            </div>
          ) : reportData ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-secondary-500">Faturamento</span>
                    <div className={`flex items-center text-sm font-medium ${
                      reportData.revenueChange >= 0 ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {reportData.revenueChange >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {Math.abs(reportData.revenueChange).toFixed(1)}%
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-secondary-900">
                    {formatCurrency(reportData.totalRevenue)}
                  </p>
                </div>

                <div className="card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-secondary-500">Clientess</span>
                    <div className={`flex items-center text-sm font-medium ${
                      reportData.customersChange >= 0 ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {reportData.customersChange >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {Math.abs(reportData.customersChange).toFixed(1)}%
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-secondary-900">
                    {reportData.totalCustomers}
                  </p>
                </div>

                <div className="card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-secondary-500">Conversao</span>
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {reportData.conversionChange}%
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-secondary-900">
                    {reportData.conversionRate.toFixed(1)}%
                  </p>
                </div>

                <div className="card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-secondary-500">Mensagens</span>
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {reportData.messagesChange}%
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-secondary-900">
                    {reportData.messagesSent}
                  </p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="card p-6">
                  <h3 className="font-semibold text-secondary-900 mb-6">Faturamento Mensal</h3>

                  <div className="h-48 flex items-end justify-between gap-4">
                    {reportData.monthlyData.map((data, idx) => {
                      const maxRevenue = Math.max(...reportData.monthlyData.map(d => d.revenue));
                      const height = (data.revenue / maxRevenue) * 100;

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                          <div
                            className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all hover:from-primary-600 hover:to-primary-500"
                            style={{ height: `${height}%` }}
                            title={formatCurrency(data.revenue)}
                          />
                          <span className="text-xs text-secondary-500">{data.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status Distribution */}
                <div className="card p-6">
                  <h3 className="font-semibold text-secondary-900 mb-6">Distribuicao de Leads</h3>

                  <div className="space-y-4">
                    {reportData.statusDistribution.map((item) => {
                      const total = reportData.statusDistribution.reduce((sum, s) => sum + s.count, 0);
                      const percentage = (item.count / total) * 100;

                      return (
                        <div key={item.status}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-secondary-700">{getStatusLabel(item.status)}</span>
                            <span className="text-sm font-medium text-secondary-900">{item.count}</span>
                          </div>
                          <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${item.color} rounded-full transition-all`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="card p-6">
                <h3 className="font-semibold text-secondary-900 mb-6">Resumo de Performance</h3>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium text-green-900">Ticket Medio</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                      {formatCurrency(reportData.totalRevenue / Math.max(1, reportData.totalCustomers))}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-blue-900">Taxa de Resposta</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">68%</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Target className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-purple-900">Metas Atingidas</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">4/5</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

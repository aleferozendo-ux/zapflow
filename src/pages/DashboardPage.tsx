import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import {
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Sparkles,
  ArrowRight,
  Brain,
  Target as FunnelIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalRevenue: number;
  activeLeads: number;
  newLeads: number;
  conversionRate: number;
}

interface Transaction {
  id: string;
  amount: number;
  created_at: string;
  description: string | null;
}

interface Customer {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

export function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    activeLeads: 0,
    newLeads: 0,
    conversionRate: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [recentLeads, setRecentLeads] = useState<Customer[]>([]);
  const [aiInsights, setAiInsights] = useState<string[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      const { data: customers } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const newLeads = customers?.filter(c => c.status === 'lead').length || 0;
      const activeLeads = customers?.filter(c => !['lost', 'client'].includes(c.status)).length || 0;
      const clientCount = customers?.filter(c => c.status === 'client').length || 0;
      const conversionRate = customers?.length ? Math.round((clientCount / customers.length) * 100) : 0;

      setStats({ totalRevenue, activeLeads, newLeads, conversionRate });
      setRecentTransactions(transactions?.slice(0, 4) || []);
      setRecentLeads(customers?.slice(0, 4) || []);

      const insights = [];
      if (stats.conversionRate < 20) {
        insights.push('Sua taxa de conversao esta abaixo da media. Use o Flux para melhorar o follow-up.');
      }
      if (newLeads > 10) {
        insights.push(`${newLeads} leads aguardando contato. Responder rapido aumenta conversoes em 40%.`);
      }
      insights.push('Melhor horario para contatar: 18h as 21h, com 67% mais engajamento.');
      setAiInsights(insights.slice(0, 3));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Faturamento',
      value: stats.totalRevenue,
      prefix: 'R$',
      change: '+23%',
      changeUp: true,
      icon: DollarSign,
    },
    {
      title: 'Leads Ativos',
      value: stats.activeLeads,
      change: '+12%',
      changeUp: true,
      icon: Users,
    },
    {
      title: 'Novos Leads',
      value: stats.newLeads,
      change: '+45%',
      changeUp: true,
      icon: Target,
    },
    {
      title: 'Conversao',
      value: stats.conversionRate,
      suffix: '%',
      change: '-3%',
      changeUp: false,
      icon: TrendingUp,
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      lead: 'Lead',
      contacted: 'Contato',
      negotiating: 'Negociacao',
      proposal: 'Proposta',
      client: 'Cliente',
      lost: 'Perdido',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      lead: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      contacted: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      negotiating: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      proposal: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      client: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      lost: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    };
    return colors[status] || 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300';
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950">
      <Navbar />
      <Sidebar />

      <div className="lg:pl-64 pt-16">
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-secondary-900 dark:text-white">Dashboard</h1>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">Visao geral do seu negocio</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
            {statCards.map((stat, idx) => (
              <div
                key={stat.title}
                className="card p-4 hover:shadow-md transition-shadow animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    <stat.icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className={`flex items-center text-xs font-medium ${
                    stat.changeUp ? 'text-green-600 dark:text-green-400' : 'text-red-500'
                  }`}>
                    {stat.changeUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-secondary-500 dark:text-secondary-400 text-xs font-medium">{stat.title}</h3>
                <p className="text-xl font-bold text-secondary-900 dark:text-white mt-0.5">
                  {stat.prefix}{stat.prefix && ' '}
                  {typeof stat.value === 'number' ? stat.value.toLocaleString('pt-BR') : stat.value}
                  {stat.suffix}
                </p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {/* AI Insights */}
            <div className="card p-4 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4" />
                </div>
                <h2 className="text-base font-semibold">Insights do Flux</h2>
              </div>

              <div className="space-y-2">
                {aiInsights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-primary-200 mt-0.5 flex-shrink-0" />
                    <p className="text-primary-100">{insight}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/flux"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white hover:text-primary-100 transition-colors"
              >
                Abrir Flux <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/customers"
                className="card p-4 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary-500 transition-colors">
                  <Users className="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-medium text-secondary-900 dark:text-white text-sm">Adicionar Cliente</h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">Novo lead ou cliente</p>
              </Link>

              <Link
                to="/funnel"
                className="card p-4 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center mb-3 group-hover:bg-accent-500 transition-colors">
                  <FunnelIcon className="w-5 h-5 text-accent-600 dark:text-accent-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-medium text-secondary-900 dark:text-white text-sm">Funil de Vendas</h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">Visualizar pipeline</p>
              </Link>

              <Link
                to="/flux"
                className="card p-4 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-500 transition-colors">
                  <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-medium text-secondary-900 dark:text-white text-sm">Flux IA</h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">Assistente inteligente</p>
              </Link>

              <Link
                to="/generator"
                className="card p-4 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-3 group-hover:bg-orange-500 transition-colors">
                  <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-medium text-secondary-900 dark:text-white text-sm">Gerador</h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">Criar mensagens</p>
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mt-4">
            {/* Recent Revenue */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-secondary-900 dark:text-white">Faturamento Recente</h2>
                <Link to="/reports" className="text-primary-600 dark:text-primary-400 text-xs font-medium hover:underline">
                  Ver tudo
                </Link>
              </div>

              {loading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-12 bg-secondary-100 dark:bg-secondary-800 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentTransactions.length > 0 ? (
                <div className="space-y-2">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary-900 dark:text-white">
                            {transaction.description || 'Venda'}
                          </p>
                          <p className="text-xs text-secondary-500 dark:text-secondary-400">
                            {formatDate(transaction.created_at)}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-primary-600 dark:text-primary-400 text-sm">
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-secondary-500 dark:text-secondary-400 text-sm">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma transacao registrada.</p>
                </div>
              )}
            </div>

            {/* Recent Leads */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-secondary-900 dark:text-white">Leads Recentes</h2>
                <Link to="/customers" className="text-primary-600 dark:text-primary-400 text-xs font-medium hover:underline">
                  Ver todos
                </Link>
              </div>

              {loading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-12 bg-secondary-100 dark:bg-secondary-800 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentLeads.length > 0 ? (
                <div className="space-y-2">
                  {recentLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                          {lead.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary-900 dark:text-white">{lead.name}</p>
                          <p className="text-xs text-secondary-500 dark:text-secondary-400">{formatDate(lead.created_at)}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {getStatusLabel(lead.status)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-secondary-500 dark:text-secondary-400 text-sm">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum lead cadastrado.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

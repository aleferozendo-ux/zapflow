import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import {
  User,
  Building,
  Bell,
  Shield,
  Save,
  Loader2,
  Check,
  Camera,
  Mail,
  Phone,
  Globe,
  Key,
  Smartphone,
  ChevronRight,
} from 'lucide-react';

interface Profile {
  company_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

const navItems = [
  { id: 'profile', icon: User, label: 'Perfil' },
  { id: 'company', icon: Building, label: 'Empresa' },
  { id: 'notifications', icon: Bell, label: 'Notificacoes' },
  { id: 'security', icon: Shield, label: 'Seguranca' },
];

export function SettingsPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState<Profile>({
    company_name: '',
    phone: '',
    avatar_url: '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    newLead: true,
    newMessage: true,
    marketing: false,
  });

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          company_name: data.company_name || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setSaved(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          company_name: profile.company_name || null,
          phone: profile.phone || null,
          avatar_url: profile.avatar_url || null,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
            {user?.email?.[0].toUpperCase()}
          </div>
          <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-secondary-100 hover:bg-secondary-50 transition-colors">
            <Camera className="w-4 h-4 text-secondary-600" />
          </button>
        </div>
        <div>
          <h3 className="font-semibold text-secondary-900">Foto de Perfil</h3>
          <p className="text-sm text-secondary-500">JPG, GIF ou PNG. Max 2MB</p>
        </div>
      </div>

      {/* Form */}
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="input-field pl-12 bg-secondary-50 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-secondary-500 mt-1">O email nao pode ser alterado</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Nome Completo
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              value={profile.company_name || ''}
              onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
              placeholder="Seu nome"
              className="input-field pl-12"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Telefone
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="tel"
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+55 (11) 99999-9999"
              className="input-field pl-12"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompanySection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Nome da Empresa
        </label>
        <div className="relative">
          <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            value={profile.company_name || ''}
            onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
            placeholder="Nome da sua empresa"
            className="input-field pl-12"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Site
        </label>
        <div className="relative">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="url"
            placeholder="https://suaempresa.com"
            className="input-field pl-12"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Segmento
        </label>
        <select className="input-field">
          <option value="">Selecione</option>
          <option value="ecommerce">E-commerce</option>
          <option value="servicos">Servicos</option>
          <option value="saas">SaaS</option>
          <option value="varejo">Varejo</option>
          <option value="saude">Saude</option>
          <option value="outro">Outro</option>
        </select>
      </div>

      <div className="p-4 bg-primary-50 rounded-xl border border-primary-200">
        <h4 className="font-medium text-primary-900 mb-2">Plano Atual: Pro</h4>
        <p className="text-sm text-primary-700 mb-3">Seu plano renova em 30 dias</p>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
          Fazer Upgrade
        </button>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-secondary-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary-100 rounded-lg">
            <Mail className="w-5 h-5 text-secondary-600" />
          </div>
          <div>
            <h4 className="font-medium text-secondary-900">Notificacoes por Email</h4>
            <p className="text-sm text-secondary-500">Receba atualizacoes por email</p>
          </div>
        </div>
        <button
          onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            notifications.email ? 'bg-primary-500' : 'bg-secondary-300'
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              notifications.email ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>

      <div className="p-4 rounded-xl border border-secondary-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary-100 rounded-lg">
            <Smartphone className="w-5 h-5 text-secondary-600" />
          </div>
          <div>
            <h4 className="font-medium text-secondary-900">Notificacoes Push</h4>
            <p className="text-sm text-secondary-500">Alertas no navegador</p>
          </div>
        </div>
        <button
          onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            notifications.push ? 'bg-primary-500' : 'bg-secondary-300'
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              notifications.push ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>

      <h3 className="font-medium text-secondary-900 pt-4">Tipos de Notificacoes</h3>

      <div className="space-y-3">
        {[
          { key: 'newLead', label: 'Novo Lead', desc: 'Um novo lead e adicionado' },
          { key: 'newMessage', label: 'Nova Mensagem', desc: 'Recebe uma mensagem' },
          { key: 'marketing', label: 'Marketing', desc: 'Novidades e dicas do ZapFlow' },
        ].map((item) => (
          <label
            key={item.key}
            className="p-4 rounded-xl border border-secondary-100 flex items-center justify-between cursor-pointer hover:bg-secondary-50 transition-colors"
          >
            <div>
              <h4 className="font-medium text-secondary-900">{item.label}</h4>
              <p className="text-sm text-secondary-500">{item.desc}</p>
            </div>
            <input
              type="checkbox"
              checked={notifications[item.key as keyof typeof notifications]}
              onChange={() =>
                setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })
              }
              className="w-5 h-5 rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
            />
          </label>
        ))}
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-secondary-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary-100 rounded-lg">
            <Key className="w-5 h-5 text-secondary-600" />
          </div>
          <div>
            <h4 className="font-medium text-secondary-900">Alterar Senha</h4>
            <p className="text-sm text-secondary-500">Atualize sua senha de acesso</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-secondary-400" />
      </div>

      <div className="p-4 rounded-xl border border-secondary-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary-100 rounded-lg">
            <Smartphone className="w-5 h-5 text-secondary-600" />
          </div>
          <div>
            <h4 className="font-medium text-secondary-900">Autenticacao em Dois Fatores</h4>
            <p className="text-sm text-secondary-500">Adicione uma camada extra de seguranca</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
          Inativo
        </span>
      </div>

      <div className="p-4 rounded-xl border border-secondary-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary-100 rounded-lg">
            <Globe className="w-5 h-5 text-secondary-600" />
          </div>
          <div>
            <h4 className="font-medium text-secondary-900">Sessoes Ativas</h4>
            <p className="text-sm text-secondary-500">Gerencie onde voce esta logado</p>
          </div>
        </div>
        <span className="text-sm text-secondary-600">1 sessao</span>
      </div>

      <div className="pt-4 border-t border-secondary-100">
        <h4 className="font-medium text-red-600 mb-4">Area de Perigo</h4>
        <div className="p-4 rounded-xl border border-red-200 bg-red-50">
          <h4 className="font-medium text-red-900 mb-1">Excluir Conta</h4>
          <p className="text-sm text-red-700 mb-3">
            Esta acao e permanente e nao pode ser desfeita.
          </p>
          <button className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors">
            Excluir Minha Conta
          </button>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'company':
        return renderCompanySection();
      case 'notifications':
        return renderNotificationsSection();
      case 'security':
        return renderSecuritySection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      <Sidebar />

      <div className="lg:pl-64 pt-16">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-secondary-900">Configuracoes</h1>
            <p className="text-secondary-500 mt-1">Gerencie sua conta e preferencias</p>
          </div>

          {loading ? (
            <div className="animate-pulse">
              <div className="h-12 bg-secondary-200 rounded-xl w-48 mb-6" />
              <div className="h-64 bg-secondary-100 rounded-2xl" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Navigation */}
              <div className="lg:col-span-1">
                <div className="card p-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        activeSection === item.id
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-secondary-600 hover:bg-secondary-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-secondary-900">
                      {navItems.find((n) => n.id === activeSection)?.label}
                    </h2>
                  </div>

                  {renderSection()}

                  {activeSection !== 'notifications' && activeSection !== 'security' && (
                    <div className="mt-8 pt-6 border-t border-secondary-100">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : saved ? (
                          <>
                            <Check className="w-5 h-5 mr-2" />
                            Salvo!
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5 mr-2" />
                            Salvar Alteracoes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

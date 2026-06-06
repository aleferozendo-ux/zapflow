import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, Check, Sun, Moon } from 'lucide-react';

const features = [
  'CRM completo para gerenciar clientes',
  'Funil de vendas visual',
  'Flux - Assistente de IA',
  'Relatorios em tempo real',
];

export function SignupPage() {
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('As senhas nao coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signUpError } = await signUp(email, password);

    if (signUpError) {
      setError(signUpError.message || 'Erro ao criar conta. Tente novamente.');
      setLoading(false);
      return;
    }

    // Auto-login after signup
    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      // If auto-login fails, redirect to login page
      navigate('/login');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Features */}
        <div className="hidden lg:block">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/25">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">ZapFlow</h2>
                <p className="text-secondary-500 dark:text-secondary-400">Transforme conversas em vendas</p>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
              Comece a vender mais hoje
            </h3>
            <p className="text-secondary-600 dark:text-secondary-300">
              Crie sua conta gratuita e comece a transformar conversas em vendas em minutos.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <span className="text-secondary-700 dark:text-secondary-200">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl text-white">
            <p className="text-lg font-medium mb-2">"Triplicamos nossas vendas em 2 meses"</p>
            <p className="text-primary-100 text-sm">— Marina Santos, CEO da Loja Digital</p>
          </div>
        </div>

        {/* Right side - Form */}
        <div>
          <div className="card-elevated p-8">
            {/* Theme toggle for mobile */}
            <div className="flex items-center justify-between mb-6">
              <div className="lg:hidden flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-secondary-900 dark:text-white">ZapFlow</span>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
                ) : (
                  <Sun className="w-5 h-5 text-secondary-300" />
                )}
              </button>
            </div>

            <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
              Criar Conta
            </h3>
            <p className="text-secondary-500 dark:text-secondary-400 mb-6">
              Comece gratis hoje mesmo.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-4 rounded-xl animate-fade-in">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-200 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-200 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimo 6 caracteres"
                    className="input-field pl-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-200 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-secondary-300 dark:border-secondary-600 text-primary-500 focus:ring-primary-500" required />
                <span className="text-sm text-secondary-600 dark:text-secondary-300">
                  Eu aceito os{' '}
                  <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Termos de Servico</a>
                  {' '}e{' '}
                  <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Politica de Privacidade</a>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Criar Conta'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-secondary-600 dark:text-secondary-300">
                Ja tem uma conta?{' '}
                <a href="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">
                  Entrar
                </a>
              </p>
            </div>
          </div>

          <a href="/login" className="mt-6 flex items-center justify-center gap-2 text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para login
          </a>
        </div>
      </div>
    </div>
  );
}

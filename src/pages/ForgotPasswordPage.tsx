import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Zap, Mail, ArrowLeft, Loader2, CheckCircle, Sun, Moon } from 'lucide-react';

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await resetPassword(email);

    if (error) {
      setError('Erro ao enviar email. Verifique se o endereco esta correto.');
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">Email enviado!</h1>
          <p className="text-secondary-600 dark:text-secondary-300 mb-6">
            Enviamos instrucoes para <strong className="text-secondary-900 dark:text-white">{email}</strong>. Verifique sua caixa de entrada e spam.
          </p>
          <Link to="/login" className="btn-primary inline-flex">
            Voltar para Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/25 mb-4">
            <Zap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Recuperar Senha</h1>
          <p className="text-secondary-500 dark:text-secondary-400 mt-2 text-center">
            Digite seu email e enviaremos instrucoes para redefinir sua senha.
          </p>
        </div>

        <div className="card-elevated p-8">
          <div className="flex justify-end mb-4">
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

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Enviar Instrucoes'
              )}
            </button>
          </form>
        </div>

        <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar para login
        </Link>
      </div>
    </div>
  );
}

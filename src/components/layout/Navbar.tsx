import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Zap,
  Menu,
  X,
  LayoutDashboard,
  Users,
  Brain,
  Settings,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';

export function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-secondary-900/95 backdrop-blur-xl border-b border-secondary-100 dark:border-secondary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-all">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-secondary-900 dark:text-white">
              Zap<span className="text-primary-500">Flow</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/dashboard'
                  ? 'text-primary-600 bg-primary-50 dark:bg-primary-500/10'
                  : 'text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-50 dark:hover:bg-secondary-800'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              to="/customers"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/customers'
                  ? 'text-primary-600 bg-primary-50 dark:bg-primary-500/10'
                  : 'text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-50 dark:hover:bg-secondary-800'
              }`}
            >
              <Users className="w-5 h-5" />
              CRM
            </Link>
            <Link
              to="/flux"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/flux'
                  ? 'text-primary-600 bg-primary-50 dark:bg-primary-500/10'
                  : 'text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-50 dark:hover:bg-secondary-800'
              }`}
            >
              <Brain className="w-5 h-5" />
              Flux
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
              ) : (
                <Sun className="w-5 h-5 text-secondary-300" />
              )}
            </button>

            {/* User menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white font-semibold">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-secondary-500 dark:text-secondary-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-secondary-800 rounded-xl shadow-xl border border-secondary-100 dark:border-secondary-700 py-2 animate-scale-in">
                    <div className="px-4 py-2 border-b border-secondary-100 dark:border-secondary-700">
                      <p className="text-sm font-medium text-secondary-900 dark:text-white">{user.email}</p>
                    </div>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Configuracoes
                    </Link>
                    <button
                      onClick={signOut}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-100 dark:border-secondary-800 animate-slide-down">
            <div className="flex flex-col gap-2">
              <Link to="/dashboard" className="px-4 py-2 text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-800 rounded-lg flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </Link>
              <Link to="/customers" className="px-4 py-2 text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-800 rounded-lg flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Users className="w-5 h-5" /> CRM
              </Link>
              <Link to="/flux" className="px-4 py-2 text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-800 rounded-lg flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Brain className="w-5 h-5" /> Flux
              </Link>
              <div className="border-t border-secondary-100 dark:border-secondary-700 mt-2 pt-2">
                <Link to="/settings" className="px-4 py-2 text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-800 rounded-lg flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <Settings className="w-5 h-5" /> Configuracoes
                </Link>
                <button onClick={signOut} className="w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2">
                  <LogOut className="w-5 h-5" /> Sair
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

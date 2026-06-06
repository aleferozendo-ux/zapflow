import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import {
  LayoutDashboard,
  Users,
  Target,
  Brain,
  Sparkles,
  BarChart3,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'CRM', path: '/customers' },
  { icon: Target, label: 'Funil de Vendas', path: '/funnel' },
  { icon: Brain, label: 'Flux', path: '/flux' },
  { icon: Sparkles, label: 'Gerador', path: '/generator' },
  { icon: BarChart3, label: 'Relatorios', path: '/reports' },
  { icon: Settings, label: 'Configuracoes', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-64 bg-white dark:bg-secondary-900 border-r border-secondary-100 dark:border-secondary-800 min-h-screen pt-16 sticky top-0 hidden lg:block">
      <div className="p-4">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold'
                    : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800 hover:text-secondary-900 dark:hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary-100 dark:border-secondary-800">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-5 h-5" />
              Modo Escuro
            </>
          ) : (
            <>
              <Sun className="w-5 h-5" />
              Modo Claro
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

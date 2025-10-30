import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Users, FileText, Settings, Plus, UserCog } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { APP_TITLE } from '@/const';

interface DashboardLayoutProps {
  children: ReactNode;
  onAddProvider?: () => void;
}

export default function DashboardLayout({ children, onAddProvider }: DashboardLayoutProps) {
  const [location] = useLocation();
  const { data: currentUser } = trpc.users.me.useQuery();

  const navItems = [
    { path: '/', label: 'Providers', icon: Users },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  // Add Users menu item only for admins
  if (currentUser?.role === 'admin') {
    navItems.push({ path: '/users', label: 'Users', icon: UserCog });
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ME</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{APP_TITLE}</h1>
              <p className="text-xs text-gray-500">Provider Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {onAddProvider && (
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={onAddProvider}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Provider
            </Button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}


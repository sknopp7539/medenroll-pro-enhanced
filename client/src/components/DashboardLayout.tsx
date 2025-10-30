// trigger build
import { ReactNode, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { Users, FileText, Settings, Plus, UserCog, Building2, ClipboardCheck, LayoutDashboard, FileCheck } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';

type NavItem = {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const { data: currentUser } = trpc.users.me.useQuery();

  const navItems: NavItem[] = useMemo(() => {
    const items: NavItem[] = [
      { path: '/', label: 'Providers', icon: Users },
      { path: '/payers', label: 'Payers', icon: Building2 },
      { path: '/reviewer-dashboard', label: 'Reviewer Dashboard', icon: LayoutDashboard },
      { path: '/review-queue', label: 'Review Queue', icon: FileCheck },
      { path: '/reports', label: 'Reports', icon: ClipboardCheck },
      { path: '/settings', label: 'Settings', icon: Settings },
    ];

    // Only admins see Users
    if (currentUser?.role === 'admin') {
      items.push({ path: '/users', label: 'Users', icon: UserCog });
    }

    return items;
  }, [currentUser?.role]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white">
        <div className="p-4 border-b">
          <Link href="/">
            <a className="text-xl font-semibold">MedEnroll Pro</a>
          </Link>
          <div className="text-xs text-gray-500">Provider Management</div>
        </div>

        <nav className="p-2 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </a>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button className="w-full" onClick={() => setLocation('/providers/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Provider
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

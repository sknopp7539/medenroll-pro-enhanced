import { useState, useMemo } from 'react';
import { useProviders } from '@/contexts/ProviderContext';
import DashboardLayout from '@/components/DashboardLayout';
import ProviderCardEnhanced from '@/components/ProviderCardEnhanced';
import AddProviderDialog from '@/components/AddProviderDialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, Flag, Users } from 'lucide-react';

export default function Home() {
  const { providers, addProvider, updateProvider } = useProviders();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [priorityView, setPriorityView] = useState(false);

  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        provider.name.toLowerCase().includes(searchLower) ||
        provider.npi.includes(searchQuery) ||
        provider.license.includes(searchQuery) ||
        provider.specialty.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = statusFilter === 'all' || provider.status === statusFilter;

      // Specialty filter
      const matchesSpecialty = specialtyFilter === 'all' || provider.specialty === specialtyFilter;

      // Priority filter
      const matchesPriority = !priorityView || provider.flagged;

      return matchesSearch && matchesStatus && matchesSpecialty && matchesPriority;
    });
  }, [providers, searchQuery, statusFilter, specialtyFilter, priorityView]);

  const stats = useMemo(() => {
    return {
      total: providers.length,
      active: providers.filter(p => p.status === 'active').length,
      pending: providers.filter(p => p.status === 'pending').length,
      inactive: providers.filter(p => p.status === 'inactive').length,
      flagged: providers.filter(p => p.flagged).length,
    };
  }, [providers]);

  return (
    <DashboardLayout onAddProvider={() => setAddDialogOpen(true)}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Management Dashboard</h1>
          <p className="text-gray-600">Manage provider credentials, enrollments, and compliance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Providers</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.active}</div>
            <div className="text-sm text-gray-600">Active Providers</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending Providers</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-red-600 mb-1">{stats.inactive}</div>
            <div className="text-sm text-gray-600">Inactive Providers</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-3xl font-bold text-orange-600 mb-1">{stats.flagged}</div>
            <div className="text-sm text-gray-600">Flagged for Recredentialing</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search providers by name, NPI, license, or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="w-[180px]">
                <Users className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                <SelectItem value="Addiction">Addiction</SelectItem>
                <SelectItem value="Primary Care">Primary Care</SelectItem>
                <SelectItem value="Behavioral Health">Behavioral Health</SelectItem>
                <SelectItem value="Psychiatry">Psychiatry</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={priorityView ? 'default' : 'outline'}
              onClick={() => setPriorityView(!priorityView)}
              className={priorityView ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              <Flag className="w-4 h-4 mr-2" />
              Priority View: {priorityView ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>

        {/* Providers Grid - Responsive: 1 col mobile, 2 cols tablet, 3 cols desktop ≥1440px */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredProviders.map(provider => (
            <ProviderCardEnhanced
              key={provider.id}
              provider={provider}
              onUpdate={updateProvider}
            />
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No providers found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or add a new provider</p>
            <Button onClick={() => setAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              Add Provider
            </Button>
          </div>
        )}
      </div>

      <AddProviderDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={addProvider}
      />
    </DashboardLayout>
  );
}


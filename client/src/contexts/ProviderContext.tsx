import { createContext, useContext, ReactNode } from 'react';
import { Provider } from '@/types/provider';
import { trpc } from '@/lib/trpc';

interface ProviderContextType {
  providers: Provider[];
  isLoading: boolean;
  addProvider: (provider: Provider) => Promise<void>;
  updateProvider: (id: string, updates: Partial<Provider>) => Promise<void>;
  deleteProvider: (id: string) => Promise<void>;
  refetch: () => void;
}

const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

export function ProviderProvider({ children }: { children: ReactNode }) {
  // Fetch providers from database
  const { data: providers = [], isLoading, refetch } = trpc.providers.list.useQuery();
  
  // Mutations
  const createMutation = trpc.providers.create.useMutation({
    onSuccess: () => refetch(),
  });
  
  const updateMutation = trpc.providers.update.useMutation({
    onSuccess: () => refetch(),
  });
  
  const deleteMutation = trpc.providers.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const addProvider = async (provider: Provider) => {
    await createMutation.mutateAsync({
      provider: {
        id: provider.id,
        name: provider.name,
        credential: provider.credential,
        npi: provider.npi,
        license: provider.license,
        licenseExpiration: provider.licenseExpiration,
        specialty: provider.specialty,
        status: provider.status,
        flagged: provider.flagged,
        nextCredentialing: provider.nextCredentialing,
      },
      practiceLocations: provider.practiceLocations.map(loc => ({
        type: loc.type as 'primary' | 'secondary',
        name: loc.name,
      })),
      payerEnrollments: provider.payerEnrollments.map(enrollment => ({
        id: enrollment.id,
        payerName: enrollment.payerName,
        status: enrollment.status,
        enrollmentDate: enrollment.enrollmentDate,
        contractEnd: enrollment.contractEnd,
        nextCredentialing: enrollment.nextCredentialing,
        notes: enrollment.notes || '',
      })),
    });
  };

  const updateProvider = async (id: string, updates: Partial<Provider>) => {
    // Find the current provider
    const currentProvider = providers.find(p => p.id === id);
    if (!currentProvider) {
      throw new Error('Provider not found');
    }

    // Merge updates with current provider
    const updatedProvider = { ...currentProvider, ...updates };

    await updateMutation.mutateAsync({
      provider: {
        id: updatedProvider.id,
        name: updatedProvider.name,
        credential: updatedProvider.credential,
        npi: updatedProvider.npi,
        license: updatedProvider.license,
        licenseExpiration: updatedProvider.licenseExpiration,
        specialty: updatedProvider.specialty,
        status: updatedProvider.status,
        flagged: updatedProvider.flagged,
        nextCredentialing: updatedProvider.nextCredentialing,
      },
      practiceLocations: updatedProvider.practiceLocations.map(loc => ({
        type: loc.type as 'primary' | 'secondary',
        name: loc.name,
      })),
      payerEnrollments: updatedProvider.payerEnrollments.map(enrollment => ({
        id: enrollment.id,
        payerName: enrollment.payerName,
        status: enrollment.status,
        enrollmentDate: enrollment.enrollmentDate,
        contractEnd: enrollment.contractEnd,
        nextCredentialing: enrollment.nextCredentialing,
        notes: enrollment.notes || '',
      })),
    });
  };

  const deleteProvider = async (id: string) => {
    await deleteMutation.mutateAsync({ id });
  };

  return (
    <ProviderContext.Provider 
      value={{ 
        providers, 
        isLoading,
        addProvider, 
        updateProvider, 
        deleteProvider,
        refetch,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
}

export function useProviders() {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProviders must be used within ProviderProvider');
  }
  return context;
}


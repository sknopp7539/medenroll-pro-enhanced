import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Provider, ProviderStatus, Specialty } from '@/types/provider';
import { PAYER_NAMES } from '@/lib/sampleData';

interface AddProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (provider: Provider) => void;
}

export default function AddProviderDialog({ open, onOpenChange, onAdd }: AddProviderDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    credential: '',
    status: 'active' as ProviderStatus,
    npi: '',
    license: '',
    licenseExpiration: '',
    specialty: 'Primary Care' as Specialty,
    nextCredentialing: '',
    hiredDate: '',
    primaryLocation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const providerId = Date.now().toString();
    
    const newProvider: Provider = {
      id: providerId,
      name: formData.name,
      credential: formData.credential,
      status: formData.status,
      npi: formData.npi,
      license: formData.license,
      licenseExpiration: formData.licenseExpiration,
      specialty: formData.specialty,
      nextCredentialing: formData.nextCredentialing,
      hiredDate: formData.hiredDate,
      flagged: false,
      practiceLocations: [
        { type: 'primary', name: formData.primaryLocation },
      ],
      payerEnrollments: PAYER_NAMES.map((payer: string, index: number) => ({
        id: `${providerId}_payer_${index}`,
        payerName: payer,
        status: 'pending',
        enrollmentDate: '',
        contractEnd: '',
        nextCredentialing: '',
        notes: '',
      })),
    };

    onAdd(newProvider);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      name: '',
      credential: '',
      status: 'active',
      npi: '',
      license: '',
      licenseExpiration: '',
      specialty: 'Primary Care',
      nextCredentialing: '',
      hiredDate: '',
      primaryLocation: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Provider</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credential">Credential *</Label>
              <Input
                id="credential"
                placeholder="MD, LADC, PA, etc."
                value={formData.credential}
                onChange={(e) => setFormData({ ...formData, credential: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="npi">NPI Number *</Label>
              <Input
                id="npi"
                value={formData.npi}
                onChange={(e) => setFormData({ ...formData, npi: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">License Number *</Label>
              <Input
                id="license"
                value={formData.license}
                onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseExpiration">License Expiration *</Label>
              <Input
                id="licenseExpiration"
                type="date"
                value={formData.licenseExpiration}
                onChange={(e) => setFormData({ ...formData, licenseExpiration: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty *</Label>
              <Select
                value={formData.specialty}
                onValueChange={(value) => setFormData({ ...formData, specialty: value as Specialty })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primary Care">Primary Care</SelectItem>
                  <SelectItem value="Addiction">Addiction</SelectItem>
                  <SelectItem value="Behavioral Health">Behavioral Health</SelectItem>
                  <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as ProviderStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hiredDate">Hired/Start Date</Label>
              <Input
                id="hiredDate"
                type="date"
                value={formData.hiredDate}
                onChange={(e) => setFormData({ ...formData, hiredDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextCredentialing">Next Credentialing Date *</Label>
              <Input
                id="nextCredentialing"
                type="date"
                value={formData.nextCredentialing}
                onChange={(e) => setFormData({ ...formData, nextCredentialing: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryLocation">Primary Practice Location *</Label>
              <Input
                id="primaryLocation"
                value={formData.primaryLocation}
                onChange={(e) => setFormData({ ...formData, primaryLocation: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Provider
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


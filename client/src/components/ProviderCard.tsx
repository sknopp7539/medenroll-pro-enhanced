import { useState } from 'react';
import { Provider, PayerEnrollment } from '@/types/provider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit2, Save, X, MapPin, Flag } from 'lucide-react';

interface ProviderCardProps {
  provider: Provider;
  onUpdate: (id: string, updates: Partial<Provider>) => void;
}

export default function ProviderCard({ provider, onUpdate }: ProviderCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(provider);
  const [showAllPayers, setShowAllPayers] = useState(false);

  const handleSave = () => {
    onUpdate(provider.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(provider);
    setIsEditing(false);
  };

  const updatePayerEnrollment = (index: number, updates: Partial<PayerEnrollment>) => {
    const newEnrollments = [...editData.payerEnrollments];
    newEnrollments[index] = { ...newEnrollments[index], ...updates };
    setEditData({ ...editData, payerEnrollments: newEnrollments });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDaysUntil = (dateStr: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const today = new Date();
    const diff = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysUntilCredentialing = getDaysUntil(provider.nextCredentialing);

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="font-bold text-lg"
              />
              <Input
                value={editData.credential}
                onChange={(e) => setEditData({ ...editData, credential: e.target.value })}
                className="text-sm"
                placeholder="Credential"
              />
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
              <p className="text-gray-600">{provider.credential}</p>
            </>
          )}
        </div>
        <div className="flex gap-2 items-start">
          {provider.flagged && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Flag className="w-3 h-3" />
              FLAGGED
            </Badge>
          )}
          <Badge className={getStatusColor(provider.status)}>
            {provider.status.toUpperCase()}
          </Badge>
          {!isEditing ? (
            <>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="default" 
                onClick={() => {
                  onUpdate(provider.id, editData);
                }} 
                className="bg-green-600 hover:bg-green-700"
                title="Quick Save"
              >
                <Save className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <div className="flex gap-1">
              <Button size="sm" variant="default" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Provider Details */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <span className="text-gray-600">NPI:</span>
          {isEditing ? (
            <Input
              value={editData.npi}
              onChange={(e) => setEditData({ ...editData, npi: e.target.value })}
              className="mt-1"
            />
          ) : (
            <span className="ml-2 font-semibold">{provider.npi}</span>
          )}
        </div>
        <div>
          <span className="text-gray-600">License:</span>
          {isEditing ? (
            <div className="space-y-1">
              <Input
                value={editData.license}
                onChange={(e) => setEditData({ ...editData, license: e.target.value })}
                className="mt-1"
                placeholder="License Number"
              />
              <Input
                type="date"
                value={editData.licenseExpiration}
                onChange={(e) => setEditData({ ...editData, licenseExpiration: e.target.value })}
                className="text-xs"
              />
            </div>
          ) : (
            <span className="ml-2 font-semibold">
              {provider.license} (Exp: {new Date(provider.licenseExpiration).toLocaleDateString()})
            </span>
          )}
        </div>
        <div>
          <span className="text-gray-600">Specialty:</span>
          {isEditing ? (
            <Select
              value={editData.specialty}
              onValueChange={(value) => setEditData({ ...editData, specialty: value as any })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Primary Care">Primary Care</SelectItem>
                <SelectItem value="Addiction">Addiction</SelectItem>
                <SelectItem value="Behavioral Health">Behavioral Health</SelectItem>
                <SelectItem value="Psychiatry">Psychiatry</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <span className="ml-2 font-semibold">{provider.specialty}</span>
          )}
        </div>
        <div>
          <span className="text-gray-600">Next Credentialing:</span>
          {isEditing ? (
            <Input
              type="date"
              value={editData.nextCredentialing}
              onChange={(e) => setEditData({ ...editData, nextCredentialing: e.target.value })}
              className="mt-1"
            />
          ) : (
            <span className={`ml-2 font-semibold ${daysUntilCredentialing && daysUntilCredentialing < 0 ? 'text-red-600' : ''}`}>
              {new Date(provider.nextCredentialing).toLocaleDateString()}
              {daysUntilCredentialing !== null && (
                <span className="text-xs ml-1">
                  ({daysUntilCredentialing} days)
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Practice Locations */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Practice Locations:
        </h4>
        <div className="space-y-1">
          {provider.practiceLocations.map((loc, idx) => (
            <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
              <span className="font-medium capitalize">{loc.type}:</span> {loc.name}
            </div>
          ))}
        </div>
      </div>

      {/* Payer Enrollments */}
      <div>
        <h4 className="font-semibold text-sm mb-3">Payer Enrollments:</h4>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {editData.payerEnrollments.slice(0, showAllPayers ? editData.payerEnrollments.length : 5).map((payer, sliceIdx) => {
            const idx = editData.payerEnrollments.indexOf(payer);
            return (
            <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="font-medium mb-2">{payer.payerName}</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-gray-600">Status:</label>
                  {isEditing ? (
                    <Select
                      value={payer.status}
                      onValueChange={(value) => updatePayerEnrollment(idx, { status: value as any })}
                    >
                      <SelectTrigger className="h-8 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">
                      <Badge className={getStatusColor(payer.status)} variant="outline">
                        {payer.status}
                      </Badge>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-gray-600">Enrollment Date:</label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={payer.enrollmentDate}
                      onChange={(e) => updatePayerEnrollment(idx, { enrollmentDate: e.target.value })}
                      className="h-8 mt-1"
                    />
                  ) : (
                    <div className="mt-1">{payer.enrollmentDate || 'N/A'}</div>
                  )}
                </div>
                <div>
                  <label className="text-gray-600">Contract End:</label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={payer.contractEnd}
                      onChange={(e) => updatePayerEnrollment(idx, { contractEnd: e.target.value })}
                      className="h-8 mt-1"
                    />
                  ) : (
                    <div className="mt-1">{payer.contractEnd || 'N/A'}</div>
                  )}
                </div>
                <div>
                  <label className="text-gray-600">Next Credentialing:</label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={payer.nextCredentialing}
                      onChange={(e) => updatePayerEnrollment(idx, { nextCredentialing: e.target.value })}
                      className="h-8 mt-1"
                    />
                  ) : (
                    <div className="mt-1">{payer.nextCredentialing || 'N/A'}</div>
                  )}
                </div>
              </div>
              {isEditing && (
                <div className="mt-2">
                  <label className="text-gray-600">Notes:</label>
                  <Textarea
                    value={payer.notes || ''}
                    onChange={(e) => updatePayerEnrollment(idx, { notes: e.target.value })}
                    className="mt-1 text-xs"
                    rows={2}
                  />
                </div>
              )}
              {!isEditing && payer.notes && (
                <div className="mt-2 text-xs text-gray-600 italic">{payer.notes}</div>
              )}
            </div>
          );
          })}
          {editData.payerEnrollments.length > 5 && !showAllPayers && (
            <button
              onClick={() => setShowAllPayers(true)}
              className="w-full text-xs text-blue-600 hover:text-blue-800 text-center py-2 hover:bg-blue-50 rounded transition-colors"
            >
              + {editData.payerEnrollments.length - 5} more payers (click to expand)
            </button>
          )}
          {showAllPayers && editData.payerEnrollments.length > 5 && (
            <button
              onClick={() => setShowAllPayers(false)}
              className="w-full text-xs text-blue-600 hover:text-blue-800 text-center py-2 hover:bg-blue-50 rounded transition-colors"
            >
              Show less
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}


import { useState, useEffect } from 'react';
import { Provider, PayerEnrollment } from '@/types/provider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Edit2, Save, X, MapPin, Flag, FileText, CheckSquare, 
  Upload, ChevronDown, Info, CreditCard 
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ProviderCardProps {
  provider: Provider;
  onUpdate: (id: string, updates: Partial<Provider>) => void;
}

export default function ProviderCardEnhanced({ provider, onUpdate }: ProviderCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(provider);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Load last selected tab from localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem(`provider-${provider.id}-tab`);
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, [provider.id]);

  // Save tab selection to localStorage
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem(`provider-${provider.id}-tab`, value);
  };

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

  // Group payers by type
  const groupPayersByType = (enrollments: PayerEnrollment[]) => {
    const groups: Record<string, PayerEnrollment[]> = {
      commercial: [],
      medicare: [],
      medicaid: [],
      other: []
    };

    enrollments.forEach(enrollment => {
      const name = enrollment.payerName.toLowerCase();
      if (name.includes('medicare')) {
        groups.medicare.push(enrollment);
      } else if (name.includes('medicaid')) {
        groups.medicaid.push(enrollment);
      } else if (name.includes('blue') || name.includes('aetna') || name.includes('united') || name.includes('cigna') || name.includes('humana')) {
        groups.commercial.push(enrollment);
      } else {
        groups.other.push(enrollment);
      }
    });

    return groups;
  };

  const payerGroups = groupPayersByType(editData.payerEnrollments);

  const getGroupStats = (payers: PayerEnrollment[]) => {
    const active = payers.filter(p => p.status === 'active').length;
    const pending = payers.filter(p => p.status === 'pending').length;
    return { total: payers.length, active, pending };
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Condensed Header - Single Line */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Name and Key Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="font-semibold h-8 text-base max-w-xs"
                />
                <Input
                  value={editData.credential}
                  onChange={(e) => setEditData({ ...editData, credential: e.target.value })}
                  className="h-8 w-20"
                  placeholder="MD"
                />
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {provider.name}
                </h3>
                <Badge variant="outline" className="text-xs font-normal shrink-0">
                  {provider.credential}
                </Badge>
                <Badge variant="outline" className="text-xs font-normal shrink-0">
                  {provider.specialty}
                </Badge>
              </>
            )}
          </div>

          {/* Right: Status Badges and Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {provider.flagged && (
              <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                <Flag className="w-3 h-3" />
                FLAGGED
              </Badge>
            )}
            <Badge className={`${getStatusColor(provider.status)} text-xs`}>
              {provider.status.toUpperCase()}
            </Badge>

            {/* Secondary Info Tooltip */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                    <Info className="w-4 h-4 text-gray-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <div className="space-y-1 text-xs">
                    <div><strong>NPI:</strong> {provider.npi}</div>
                    <div><strong>License:</strong> {provider.license}</div>
                    <div><strong>Expires:</strong> {new Date(provider.licenseExpiration).toLocaleDateString()}</div>
                    <div><strong>Next Credentialing:</strong> {new Date(provider.nextCredentialing).toLocaleDateString()}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="h-8">
                <Edit2 className="w-3 h-3 mr-1" />
                Edit Provider
              </Button>
              <Button size="sm" variant="outline" className="h-8">
                <FileText className="w-3 h-3 mr-1" />
                Add Note
              </Button>
              <Button size="sm" variant="outline" className="h-8">
                <Upload className="w-3 h-3 mr-1" />
                Upload Doc
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="default" onClick={handleSave} className="bg-green-600 hover:bg-green-700 h-8">
                <Save className="w-3 h-3 mr-1" />
                Save Changes
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} className="h-8">
                <X className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            </>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {daysUntilCredentialing !== null && (
            <span className={daysUntilCredentialing < 0 ? 'text-red-600 font-semibold' : ''}>
              Credentialing: {daysUntilCredentialing} days
            </span>
          )}
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-10 bg-gray-50 px-4">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="enrollments" className="text-xs">
            <CreditCard className="w-3 h-3 mr-1" />
            Enrollments ({editData.payerEnrollments.length})
          </TabsTrigger>
          <TabsTrigger value="notes" className="text-xs">
            <FileText className="w-3 h-3 mr-1" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs">
            <CheckSquare className="w-3 h-3 mr-1" />
            Tasks
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="p-4 space-y-4">
          {/* Provider Details - Compact Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label className="text-gray-600 text-xs">NPI</label>
              {isEditing ? (
                <Input
                  value={editData.npi}
                  onChange={(e) => setEditData({ ...editData, npi: e.target.value })}
                  className="mt-1 h-8"
                />
              ) : (
                <div className="font-semibold">{provider.npi}</div>
              )}
            </div>
            <div>
              <label className="text-gray-600 text-xs">License</label>
              {isEditing ? (
                <Input
                  value={editData.license}
                  onChange={(e) => setEditData({ ...editData, license: e.target.value })}
                  className="mt-1 h-8"
                />
              ) : (
                <div className="font-semibold">{provider.license}</div>
              )}
            </div>
            <div>
              <label className="text-gray-600 text-xs">License Expiration</label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editData.licenseExpiration}
                  onChange={(e) => setEditData({ ...editData, licenseExpiration: e.target.value })}
                  className="mt-1 h-8"
                />
              ) : (
                <div className="font-semibold">{new Date(provider.licenseExpiration).toLocaleDateString()}</div>
              )}
            </div>
            <div>
              <label className="text-gray-600 text-xs">Specialty</label>
              {isEditing ? (
                <Select
                  value={editData.specialty}
                  onValueChange={(value) => setEditData({ ...editData, specialty: value as any })}
                >
                  <SelectTrigger className="mt-1 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Primary Care">Primary Care</SelectItem>
                    <SelectItem value="Addiction Medicine">Addiction Medicine</SelectItem>
                    <SelectItem value="Behavioral Health">Behavioral Health</SelectItem>
                    <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="font-semibold">{provider.specialty}</div>
              )}
            </div>
            <div className="col-span-2">
              <label className="text-gray-600 text-xs">Next Credentialing</label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editData.nextCredentialing}
                  onChange={(e) => setEditData({ ...editData, nextCredentialing: e.target.value })}
                  className="mt-1 h-8"
                />
              ) : (
                <div className={`font-semibold ${daysUntilCredentialing && daysUntilCredentialing < 0 ? 'text-red-600' : ''}`}>
                  {new Date(provider.nextCredentialing).toLocaleDateString()}
                  {daysUntilCredentialing !== null && (
                    <span className="text-xs ml-2">({daysUntilCredentialing} days)</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Practice Locations */}
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Practice Locations
            </h4>
            <div className="space-y-1">
              {provider.practiceLocations.map((loc, idx) => (
                <div key={idx} className="text-sm bg-gray-50 p-2 rounded flex items-center justify-between">
                  <div>
                    <span className="font-medium capitalize">{loc.type}:</span> {loc.name}
                  </div>
                  <Badge variant="outline" className="text-xs">{loc.type}</Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Enrollments Tab with Grouped Accordion */}
        <TabsContent value="enrollments" className="p-4">
          <Accordion type="multiple" className="space-y-2">
            {/* Commercial Payers */}
            {payerGroups.commercial.length > 0 && (
              <AccordionItem value="commercial" className="border rounded-lg">
                <AccordionTrigger className="px-4 py-2 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">Commercial Payers</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <Badge variant="outline" className="bg-blue-50">
                        {getGroupStats(payerGroups.commercial).total} plans
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        {getGroupStats(payerGroups.commercial).active} active
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {payerGroups.commercial.map((payer, idx) => {
                      const originalIdx = editData.payerEnrollments.indexOf(payer);
                      return (
                        <PayerEnrollmentCard
                          key={originalIdx}
                          payer={payer}
                          isEditing={isEditing}
                          onUpdate={(updates) => updatePayerEnrollment(originalIdx, updates)}
                          getStatusColor={getStatusColor}
                        />
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Medicare */}
            {payerGroups.medicare.length > 0 && (
              <AccordionItem value="medicare" className="border rounded-lg">
                <AccordionTrigger className="px-4 py-2 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-red-600" />
                      <span className="font-semibold">Medicare</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <Badge variant="outline" className="bg-red-50">
                        {getGroupStats(payerGroups.medicare).total} plans
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        {getGroupStats(payerGroups.medicare).active} active
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {payerGroups.medicare.map((payer, idx) => {
                      const originalIdx = editData.payerEnrollments.indexOf(payer);
                      return (
                        <PayerEnrollmentCard
                          key={originalIdx}
                          payer={payer}
                          isEditing={isEditing}
                          onUpdate={(updates) => updatePayerEnrollment(originalIdx, updates)}
                          getStatusColor={getStatusColor}
                        />
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Medicaid */}
            {payerGroups.medicaid.length > 0 && (
              <AccordionItem value="medicaid" className="border rounded-lg">
                <AccordionTrigger className="px-4 py-2 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">Medicaid</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <Badge variant="outline" className="bg-green-50">
                        {getGroupStats(payerGroups.medicaid).total} plans
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        {getGroupStats(payerGroups.medicaid).active} active
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {payerGroups.medicaid.map((payer, idx) => {
                      const originalIdx = editData.payerEnrollments.indexOf(payer);
                      return (
                        <PayerEnrollmentCard
                          key={originalIdx}
                          payer={payer}
                          isEditing={isEditing}
                          onUpdate={(updates) => updatePayerEnrollment(originalIdx, updates)}
                          getStatusColor={getStatusColor}
                        />
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Other Payers */}
            {payerGroups.other.length > 0 && (
              <AccordionItem value="other" className="border rounded-lg">
                <AccordionTrigger className="px-4 py-2 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold">Other Payers</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <Badge variant="outline" className="bg-gray-50">
                        {getGroupStats(payerGroups.other).total} plans
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        {getGroupStats(payerGroups.other).active} active
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {payerGroups.other.map((payer, idx) => {
                      const originalIdx = editData.payerEnrollments.indexOf(payer);
                      return (
                        <PayerEnrollmentCard
                          key={originalIdx}
                          payer={payer}
                          isEditing={isEditing}
                          onUpdate={(updates) => updatePayerEnrollment(originalIdx, updates)}
                          getStatusColor={getStatusColor}
                        />
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="p-4">
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Add notes about this provider's credentialing status, special requirements, or other important information.
            </div>
            <Textarea
              placeholder="Enter notes here..."
              className="min-h-[200px]"
              disabled={!isEditing}
            />
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="p-4">
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Track credentialing tasks and follow-ups for this provider.
            </div>
            <div className="text-center py-8 text-gray-400">
              <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No tasks yet. Tasks feature coming soon.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

// Separate component for payer enrollment cards
function PayerEnrollmentCard({
  payer,
  isEditing,
  onUpdate,
  getStatusColor
}: {
  payer: PayerEnrollment;
  isEditing: boolean;
  onUpdate: (updates: Partial<PayerEnrollment>) => void;
  getStatusColor: (status: string) => string;
}) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
      <div className="font-medium mb-2 text-sm">{payer.payerName}</div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="text-gray-600">Status:</label>
          {isEditing ? (
            <Select
              value={payer.status}
              onValueChange={(value) => onUpdate({ status: value as any })}
            >
              <SelectTrigger className="h-7 mt-1">
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
              onChange={(e) => onUpdate({ enrollmentDate: e.target.value })}
              className="h-7 mt-1"
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
              onChange={(e) => onUpdate({ contractEnd: e.target.value })}
              className="h-7 mt-1"
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
              onChange={(e) => onUpdate({ nextCredentialing: e.target.value })}
              className="h-7 mt-1"
            />
          ) : (
            <div className="mt-1">{payer.nextCredentialing || 'N/A'}</div>
          )}
        </div>
      </div>
      {isEditing && (
        <div className="mt-2">
          <label className="text-gray-600 text-xs">Notes:</label>
          <Textarea
            value={payer.notes || ''}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            className="mt-1 text-xs"
            rows={2}
          />
        </div>
      )}
      {!isEditing && payer.notes && (
        <div className="mt-2 text-xs text-gray-600 italic border-t pt-2">{payer.notes}</div>
      )}
    </div>
  );
}


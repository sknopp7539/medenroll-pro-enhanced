import { Provider } from '@/types/provider';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

interface PayerEnrollmentReportProps {
  providers: Provider[];
  onClose: () => void;
}

export default function PayerEnrollmentReport({ providers, onClose }: PayerEnrollmentReportProps) {
  const handleExport = () => {
    // Create CSV content
    const headers = ['Provider Name', 'Credential', 'Status', 'Payer Name', 'Enrollment Status', 'Enrollment Date', 'Contract End', 'Next Credentialing', 'Notes'];
    const rows = providers.flatMap(provider =>
      provider.payerEnrollments.map(payer => [
        provider.name,
        provider.credential,
        provider.status,
        payer.payerName,
        payer.status,
        payer.enrollmentDate || 'N/A',
        payer.contractEnd || 'N/A',
        payer.nextCredentialing || 'N/A',
        payer.notes || ''
      ])
    );

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payer-enrollment-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 print:hidden">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Payer Enrollment Report</h2>
            <p className="text-sm text-gray-600 mt-1">
              Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="default" className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={handlePrint} variant="outline">
              Print
            </Button>
            <Button onClick={onClose} variant="outline">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Report Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="print:text-sm">
            {/* Print Header */}
            <div className="hidden print:block mb-6">
              <h1 className="text-2xl font-bold">Payer Enrollment Report</h1>
              <p className="text-sm text-gray-600">
                Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{providers.length}</div>
                <div className="text-sm text-gray-600">Total Providers</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {providers.reduce((sum, p) => sum + p.payerEnrollments.filter(pe => pe.status === 'active').length, 0)}
                </div>
                <div className="text-sm text-gray-600">Active Enrollments</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {providers.reduce((sum, p) => sum + p.payerEnrollments.filter(pe => pe.status === 'pending').length, 0)}
                </div>
                <div className="text-sm text-gray-600">Pending Enrollments</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {providers.reduce((sum, p) => sum + p.payerEnrollments.filter(pe => pe.notes && pe.notes.trim() !== '').length, 0)}
                </div>
                <div className="text-sm text-gray-600">With Notes</div>
              </div>
            </div>

            {/* Provider Details */}
            {providers.map((provider, providerIdx) => (
              <div key={provider.id} className="mb-8 break-inside-avoid">
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {provider.name} <span className="text-gray-600 font-normal">({provider.credential})</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-gray-600">Status:</span>{' '}
                      <span className="font-semibold capitalize">{provider.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">NPI:</span>{' '}
                      <span className="font-semibold">{provider.npi}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Specialty:</span>{' '}
                      <span className="font-semibold">{provider.specialty}</span>
                    </div>
                  </div>
                </div>

                {/* Payer Enrollments Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b-2 border-gray-200">
                        <th className="text-left p-2 font-semibold">Payer Name</th>
                        <th className="text-left p-2 font-semibold">Status</th>
                        <th className="text-left p-2 font-semibold">Enrollment Date</th>
                        <th className="text-left p-2 font-semibold">Contract End</th>
                        <th className="text-left p-2 font-semibold">Next Credentialing</th>
                        <th className="text-left p-2 font-semibold w-1/3">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {provider.payerEnrollments.map((payer, payerIdx) => (
                        <tr 
                          key={payerIdx} 
                          className={`border-b border-gray-100 ${payer.notes ? 'bg-yellow-50' : ''}`}
                        >
                          <td className="p-2 font-medium">{payer.payerName}</td>
                          <td className="p-2">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              payer.status === 'active' ? 'bg-green-100 text-green-800' :
                              payer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {payer.status}
                            </span>
                          </td>
                          <td className="p-2">{payer.enrollmentDate || 'N/A'}</td>
                          <td className="p-2">{payer.contractEnd || 'N/A'}</td>
                          <td className="p-2">{payer.nextCredentialing || 'N/A'}</td>
                          <td className="p-2 text-xs italic text-gray-700 break-words whitespace-normal" style={{ minWidth: '200px', maxWidth: '500px' }}>
                            {payer.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


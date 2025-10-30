import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PayerEnrollmentReport from '@/components/PayerEnrollmentReport';
import { useProviders } from '@/contexts/ProviderContext';

export default function Reports() {
  const { providers } = useProviders();
  const [showPayerReport, setShowPayerReport] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">Generate and view provider credentialing reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Provider Status Report */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Provider Status Report</h3>
            <p className="text-sm text-gray-600 mb-4">Overview of all providers by status (Active, Pending, Inactive)</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
          </div>

          {/* Credentialing Due Report */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Credentialing Due Report</h3>
            <p className="text-sm text-gray-600 mb-4">Providers with upcoming credentialing deadlines</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
          </div>

          {/* Payer Enrollment Report */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payer Enrollment Report</h3>
            <p className="text-sm text-gray-600 mb-4">Detailed payer enrollment status with notes for all providers</p>
            <button 
              onClick={() => setShowPayerReport(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Generate Report
            </button>
          </div>

          {/* License Expiration Report */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">License Expiration Report</h3>
            <p className="text-sm text-gray-600 mb-4">Providers with licenses expiring soon</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
          </div>

          {/* Flagged Providers Report */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Flagged Providers Report</h3>
            <p className="text-sm text-gray-600 mb-4">All providers flagged for recredentialing</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
          </div>

          {/* Custom Report */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Report</h3>
            <p className="text-sm text-gray-600 mb-4">Build a custom report with selected criteria</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Create Custom
            </button>
          </div>
        </div>
      </div>

      {/* Payer Enrollment Report Modal */}
      {showPayerReport && (
        <PayerEnrollmentReport 
          providers={providers} 
          onClose={() => setShowPayerReport(false)} 
        />
      )}
    </DashboardLayout>
  );
}


export type ProviderStatus = 'active' | 'pending' | 'inactive';
export type Specialty = 'Addiction' | 'Primary Care' | 'Behavioral Health' | 'Psychiatry' | 'Mental Health' | string;

export interface PayerEnrollment {
  id: string;
  payerName: string;
  status: ProviderStatus;
  enrollmentDate: string;
  contractEnd: string;
  nextCredentialing: string;
  notes: string | null;
}

export interface PracticeLocation {
  type: 'primary' | 'secondary' | 'additional';
  name: string;
}

export interface Provider {
  id: string;
  name: string;
  credential: string;
  status: ProviderStatus;
  npi: string;
  license: string;
  licenseExpiration: string;
  specialty: Specialty;
  nextCredentialing: string;
  hiredDate?: string;
  practiceLocations: PracticeLocation[];
  payerEnrollments: PayerEnrollment[];
  flagged: boolean;
}


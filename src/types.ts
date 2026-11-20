export type TabType = 'home' | 'register' | 'farmers' | 'profile';

export type FarmerStatus = 'Approved' | 'Pending' | 'Active';

export interface Farmer {
  id: string; // Firestore document ID
  farmerId: string; // e.g. "FAR-2026-9281"
  fullName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  mobileNumber: string;
  fatherOrSpouseName?: string;
  category?: 'General' | 'OBC' | 'SC' | 'ST';
  village: string;
  taluk?: string;
  district: string;
  state: string;
  pinCode: string;
  landArea: number; // in Acres
  cropName: string; // primary crop
  secondaryCrops?: string;
  soilType?: string;
  irrigationSource?: string;
  aadhaarLast4?: string;
  bankAccountLast4?: string;
  status: FarmerStatus;
  registeredBy: string;
  registeredByEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface FarmerFormData {
  // Step 1: Personal Information
  fullName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  mobileNumber: string;
  fatherOrSpouseName: string;
  category: 'General' | 'OBC' | 'SC' | 'ST';
  
  // Step 2: Address Details
  village: string;
  taluk: string;
  district: string;
  state: string;
  pinCode: string;

  // Step 3: Agricultural Details
  landArea: string; // string in form, parsed to number
  cropName: string;
  secondaryCrops: string;
  soilType: string;
  irrigationSource: string;
  aadhaarLast4: string;
  bankAccountLast4: string;
}

export type RegistrationStep = 1 | 2 | 3 | 4 | 5;
// 1 = Personal Info, 2 = Address Details, 3 = Agricultural Details, 4 = Review & Submit, 5 = Successful

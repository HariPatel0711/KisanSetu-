import React, { useState } from 'react';
import {
  User,
  MapPin,
  Sprout,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Edit2,
  Copy,
  Check,
  Printer,
  Home,
  Eye,
  RotateCcw,
  AlertCircle,
  FileText,
  BadgeCheck,
  Share2,
} from 'lucide-react';
import { Farmer, FarmerFormData, RegistrationStep, TabType } from '../types';

interface RegisterWizardProps {
  userId: string;
  userEmail: string;
  onSaveFarmer: (farmerData: Omit<Farmer, 'id'>) => Promise<Farmer>;
  onNavigate: (tab: TabType) => void;
  onViewDetails: (farmer: Farmer) => void;
}

const INITIAL_FORM: FarmerFormData = {
  fullName: '',
  dob: '',
  gender: 'Male',
  mobileNumber: '',
  fatherOrSpouseName: '',
  category: 'General',
  village: '',
  taluk: '',
  district: '',
  state: 'Maharashtra',
  pinCode: '',
  landArea: '',
  cropName: 'Wheat',
  secondaryCrops: '',
  soilType: 'Black Soil',
  irrigationSource: 'Canal',
  aadhaarLast4: '',
  bankAccountLast4: '',
};

const COMMON_CROPS = [
  'Wheat',
  'Paddy (Rice)',
  'Cotton',
  'Sugarcane',
  'Maize',
  'Mustard',
  'Soybean',
  'Bajra (Pearl Millet)',
  'Jowar (Sorghum)',
  'Groundnut',
  'Gram / Chickpeas',
  'Onion',
  'Tomato',
  'Potato',
  'Coconut',
];

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Bihar',
  'Chhattisgarh',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const RegisterWizard: React.FC<RegisterWizardProps> = ({
  userId,
  userEmail,
  onSaveFarmer,
  onNavigate,
  onViewDetails,
}) => {
  const [step, setStep] = useState<RegistrationStep>(1);
  const [formData, setFormData] = useState<FarmerFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdFarmer, setCreatedFarmer] = useState<Farmer | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Field change handler
  const handleChange = (field: keyof FarmerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Step 1 Validation: Personal Information
  const validateStep1 = (): boolean => {
    const errs: { [key: string]: string } = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Farmer Name is required.';
    }
    if (!formData.dob) {
      errs.dob = 'Date of birth is required.';
    }
    if (!formData.gender) {
      errs.gender = 'Gender is required.';
    }
    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = 'Mobile Number is required.';
    } else if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
      errs.mobileNumber = 'Enter a valid 10-digit mobile number.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation: Address Details
  const validateStep2 = (): boolean => {
    const errs: { [key: string]: string } = {};
    if (!formData.village.trim()) {
      errs.village = 'Village / locality is required.';
    }
    if (!formData.district.trim()) {
      errs.district = 'District is required.';
    }
    if (!formData.state.trim()) {
      errs.state = 'State is required.';
    }
    if (!formData.pinCode.trim()) {
      errs.pinCode = 'PIN Code is required.';
    } else if (!/^\d{6}$/.test(formData.pinCode.trim())) {
      errs.pinCode = 'Enter a valid 6-digit PIN code.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation: Agricultural Details
  const validateStep3 = (): boolean => {
    const errs: { [key: string]: string } = {};
    if (!formData.landArea || isNaN(Number(formData.landArea)) || Number(formData.landArea) <= 0) {
      errs.landArea = 'Enter valid land in acres (e.g. 3.5).';
    }
    if (!formData.cropName.trim()) {
      errs.cropName = 'Primary crop name is required.';
    }
    if (formData.aadhaarLast4 && !/^\d{4}$/.test(formData.aadhaarLast4.trim())) {
      errs.aadhaarLast4 = 'Must be exactly 4 digits.';
    }
    if (formData.bankAccountLast4 && !/^\d{4}$/.test(formData.bankAccountLast4.trim())) {
      errs.bankAccountLast4 = 'Must be exactly 4 digits.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    } else if (step === 3) {
      if (validateStep3()) setStep(4);
    }
  };

  const handlePrev = () => {
    if (step > 1 && step < 5) {
      setStep((prev) => (prev - 1) as RegistrationStep);
    }
  };

  const generateFarmerId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `FAR-2026-${randomNum}`;
  };

  const handleConfirmRegistration = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const generatedId = generateFarmerId();
      const newFarmerPayload: Omit<Farmer, 'id'> = {
        farmerId: generatedId,
        fullName: formData.fullName.trim(),
        dob: formData.dob,
        gender: formData.gender,
        mobileNumber: formData.mobileNumber.trim(),
        fatherOrSpouseName: formData.fatherOrSpouseName.trim() || undefined,
        category: formData.category,
        village: formData.village.trim(),
        taluk: formData.taluk.trim() || undefined,
        district: formData.district.trim(),
        state: formData.state.trim(),
        pinCode: formData.pinCode.trim(),
        landArea: parseFloat(formData.landArea),
        cropName: formData.cropName.trim(),
        secondaryCrops: formData.secondaryCrops.trim() || undefined,
        soilType: formData.soilType || 'Alluvial',
        irrigationSource: formData.irrigationSource || 'Canal',
        aadhaarLast4: formData.aadhaarLast4.trim() || undefined,
        bankAccountLast4: formData.bankAccountLast4.trim() || undefined,
        status: 'Approved',
        registeredBy: userId,
        registeredByEmail: userEmail,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const saved = await onSaveFarmer(newFarmerPayload);
      setCreatedFarmer(saved);
      setStep(5);
    } catch (err: any) {
      console.error('Error saving farmer record:', err);
      setSubmitError(err.message || 'Failed to save record to Firebase. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (createdFarmer?.farmerId) {
      navigator.clipboard.writeText(createdFarmer.farmerId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleSharePass = async () => {
    if (!createdFarmer) return;
    const shareText = `🌾 KisanSetu Registration Pass\nFarmer: ${createdFarmer.fullName}\nID: ${createdFarmer.farmerId}\nMobile: +91 ${createdFarmer.mobileNumber}\nVillage: ${createdFarmer.village}, ${createdFarmer.state}\nCrop: ${createdFarmer.cropName} (${createdFarmer.landArea} Acres)`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Kisan Pass - ${createdFarmer.farmerId}`,
          text: shareText,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleResetForm = () => {
    setFormData(INITIAL_FORM);
    setCreatedFarmer(null);
    setStep(1);
  };

  return (
    <div className="space-y-4 pb-24 max-w-lg mx-auto">
      {/* Mobile Step Header */}
      {step < 5 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Step {step} of 4
            </span>
            <span className="text-xs font-bold text-slate-500">
              {step === 1 && 'Personal Info'}
              {step === 2 && 'Address Info'}
              {step === 3 && 'Agricultural Info'}
              {step === 4 && 'Review & Submit'}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          {/* Mini Step Pills */}
          <div className="grid grid-cols-4 gap-1 pt-1">
            {[
              { num: 1, label: 'Personal' },
              { num: 2, label: 'Address' },
              { num: 3, label: 'Land & Crop' },
              { num: 4, label: 'Review' },
            ].map((s) => (
              <div
                key={s.num}
                className={`py-1 text-center rounded-lg text-[10px] font-bold ${
                  step === s.num
                    ? 'bg-emerald-700 text-white'
                    : step > s.num
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {s.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: Personal Information */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              <span>3. Personal Information</span>
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Farmer Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="e.g. Rameshwar Patil"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 ${
                  errors.fullName ? 'border-red-400 ring-1 ring-red-300' : 'border-slate-300'
                }`}
              />
              {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 ${
                  errors.dob ? 'border-red-400 ring-1 ring-red-300' : 'border-slate-300'
                }`}
              />
              {errors.dob && <p className="text-[11px] text-red-500 mt-1">{errors.dob}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Male', 'Female', 'Other'] as const).map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => handleChange('gender', g)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      formData.gender === g
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  required
                  value={formData.mobileNumber}
                  onChange={(e) => handleChange('mobileNumber', e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile"
                  className={`w-full pl-11 pr-3 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 font-mono ${
                    errors.mobileNumber ? 'border-red-400 ring-1 ring-red-300' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.mobileNumber && (
                <p className="text-[11px] text-red-500 mt-1">{errors.mobileNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Father / Spouse Name
              </label>
              <input
                type="text"
                value={formData.fatherOrSpouseName}
                onChange={(e) => handleChange('fatherOrSpouseName', e.target.value)}
                placeholder="Parent or spouse"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Social Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Next: Address Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Address Details */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Address Details</span>
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Village / Locality <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.village}
                onChange={(e) => handleChange('village', e.target.value)}
                placeholder="Village name (e.g. Baramati)"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50 focus:bg-white ${
                  errors.village ? 'border-red-400 ring-1 ring-red-300' : 'border-slate-300'
                }`}
              />
              {errors.village && <p className="text-[11px] text-red-500 mt-1">{errors.village}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                District <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => handleChange('district', e.target.value)}
                placeholder="District (e.g. Pune)"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50 focus:bg-white ${
                  errors.district ? 'border-red-400 ring-1 ring-red-300' : 'border-slate-300'
                }`}
              />
              {errors.district && <p className="text-[11px] text-red-500 mt-1">{errors.district}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-slate-50"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Taluk / Block
                </label>
                <input
                  type="text"
                  value={formData.taluk}
                  onChange={(e) => handleChange('taluk', e.target.value)}
                  placeholder="Taluka"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={formData.pinCode}
                  onChange={(e) => handleChange('pinCode', e.target.value.replace(/\D/g, ''))}
                  placeholder="6 digits"
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-slate-50 font-mono ${
                    errors.pinCode ? 'border-red-400 ring-1 ring-red-300' : 'border-slate-300'
                  }`}
                />
              </div>
            </div>
            {errors.pinCode && <p className="text-[11px] text-red-500">{errors.pinCode}</p>}
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3 rounded-xl bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <span>Next: Agricultural Info</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Agricultural Details */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Agricultural Details</span>
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Land Holding (in Acres) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                inputMode="decimal"
                required
                value={formData.landArea}
                onChange={(e) => handleChange('landArea', e.target.value)}
                placeholder="e.g. 4.5"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50 focus:bg-white ${
                  errors.landArea ? 'border-red-400 ring-1 ring-red-300' : 'border-slate-300'
                }`}
              />
              {errors.landArea && <p className="text-[11px] text-red-500 mt-1">{errors.landArea}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Primary Crop <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.cropName}
                onChange={(e) => handleChange('cropName', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50 font-semibold"
              >
                {COMMON_CROPS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Secondary Crops
              </label>
              <input
                type="text"
                value={formData.secondaryCrops}
                onChange={(e) => handleChange('secondaryCrops', e.target.value)}
                placeholder="e.g. Jowar, Pulses"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Soil Type
                </label>
                <select
                  value={formData.soilType}
                  onChange={(e) => handleChange('soilType', e.target.value)}
                  className="w-full px-2 py-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50"
                >
                  <option value="Black Soil">Black Soil</option>
                  <option value="Alluvial Soil">Alluvial</option>
                  <option value="Red Soil">Red Soil</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Irrigation
                </label>
                <select
                  value={formData.irrigationSource}
                  onChange={(e) => handleChange('irrigationSource', e.target.value)}
                  className="w-full px-2 py-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50"
                >
                  <option value="Canal">Canal</option>
                  <option value="Tube Well">Tube Well</option>
                  <option value="Borewell">Borewell</option>
                  <option value="Rainfed">Rainfed</option>
                  <option value="Drip Irrigation">Drip</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Aadhaar (Last 4 Digits)
              </label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={4}
                value={formData.aadhaarLast4}
                onChange={(e) => handleChange('aadhaarLast4', e.target.value.replace(/\D/g, ''))}
                placeholder="Last 4 digits"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono bg-slate-50"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3 rounded-xl bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <span>Review & Submit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Submit Page */}
      {step === 4 && (
        <div className="space-y-3">
          <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <BadgeCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">4. Review & Confirm Registration</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Verify all details. Click "Edit" if changes are needed.
              </p>
            </div>
          </div>

          {submitError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* 1. Personal Review */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Personal Information</span>
              </h4>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Name</span>
                <span className="font-bold text-slate-800">{formData.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Mobile</span>
                <span className="font-mono font-bold text-slate-900">+91 {formData.mobileNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">DOB</span>
                <span className="font-semibold text-slate-800">{formData.dob}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Gender</span>
                <span className="font-semibold text-slate-800">{formData.gender}</span>
              </div>
            </div>
          </div>

          {/* 2. Address Review */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Address Details</span>
              </h4>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Village</span>
                <span className="font-bold text-slate-800">{formData.village}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">District & State</span>
                <span className="font-semibold text-slate-800">{formData.district}, {formData.state}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">PIN Code</span>
                <span className="font-mono font-bold text-slate-800">{formData.pinCode}</span>
              </div>
            </div>
          </div>

          {/* 3. Agriculture Review */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                <span>Agricultural Details</span>
              </h4>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Land Area</span>
                <span className="font-bold text-emerald-800">{formData.landArea} Acres</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Primary Crop</span>
                <span className="font-bold text-slate-800">{formData.cropName}</span>
              </div>
            </div>
          </div>

          {/* Action Button: Confirm Registration */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleConfirmRegistration}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving to Firebase...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-amber-300" />
                  <span>Confirm Registration</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handlePrev}
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
            >
              Back to Edit
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Registration Successful Page */}
      {step === 5 && createdFarmer && (
        <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-200/80 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Registration Successful
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2 font-['Plus_Jakarta_Sans']">
              Farmer Registered!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Identity record saved to Firebase Cloud Registry.
            </p>
          </div>

          {/* Generated Farmer ID Badge */}
          <div className="bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-2xl p-4 border border-emerald-300 shadow-sm space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Generated Farmer ID
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-mono font-extrabold text-emerald-800">
                {createdFarmer.farmerId}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="p-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-700"
              >
                {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Farmer: <strong>{createdFarmer.fullName}</strong> • {new Date(createdFarmer.createdAt).toLocaleDateString('en-IN')}
            </p>
          </div>

          {/* Direct Mobile Actions: View Details, Back to Dashboard, Share */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => onViewDetails(createdFarmer)}
              className="w-full py-3 rounded-xl bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm shadow flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Farmer Details</span>
            </button>

            <button
              type="button"
              onClick={handleSharePass}
              className="w-full py-2.5 rounded-xl bg-emerald-50 active:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedShare ? 'Copied Pass!' : 'Share Pass (WhatsApp / SMS)'}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-full py-2.5 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>

            <button
              type="button"
              onClick={handleResetForm}
              className="text-xs text-emerald-700 font-bold flex items-center justify-center gap-1 mx-auto pt-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Register Another Farmer</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

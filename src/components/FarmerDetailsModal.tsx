import React, { useState } from 'react';
import {
  X,
  User,
  MapPin,
  Sprout,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Printer,
  Calendar,
  Phone,
  ShieldCheck,
  Save,
  AlertTriangle,
  QrCode,
  FileText,
  Share2,
  PhoneCall,
  Check,
} from 'lucide-react';
import { Farmer, FarmerStatus } from '../types';

interface FarmerDetailsModalProps {
  farmer: Farmer | null;
  onClose: () => void;
  onUpdateFarmer: (updated: Farmer) => Promise<void>;
  onDeleteFarmer: (farmerId: string) => Promise<void>;
}

export const FarmerDetailsModal: React.FC<FarmerDetailsModalProps> = ({
  farmer,
  onClose,
  onUpdateFarmer,
  onDeleteFarmer,
}) => {
  if (!farmer) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  // Edit form state
  const [fullName, setFullName] = useState(farmer.fullName);
  const [mobileNumber, setMobileNumber] = useState(farmer.mobileNumber);
  const [dob, setDob] = useState(farmer.dob);
  const [gender, setGender] = useState(farmer.gender);
  const [fatherOrSpouseName, setFatherOrSpouseName] = useState(farmer.fatherOrSpouseName || '');
  const [village, setVillage] = useState(farmer.village);
  const [taluk, setTaluk] = useState(farmer.taluk || '');
  const [district, setDistrict] = useState(farmer.district);
  const [state, setState] = useState(farmer.state);
  const [pinCode, setPinCode] = useState(farmer.pinCode);
  const [landArea, setLandArea] = useState(String(farmer.landArea));
  const [cropName, setCropName] = useState(farmer.cropName);
  const [secondaryCrops, setSecondaryCrops] = useState(farmer.secondaryCrops || '');
  const [soilType, setSoilType] = useState(farmer.soilType || 'Alluvial');
  const [irrigationSource, setIrrigationSource] = useState(farmer.irrigationSource || 'Canal');
  const [status, setStatus] = useState<FarmerStatus>(farmer.status);

  // Calculate age
  const calculateAge = (birthDate: string): number | null => {
    try {
      const birth = new Date(birthDate);
      const diff = Date.now() - birth.getTime();
      const ageDate = new Date(diff);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    } catch {
      return null;
    }
  };

  const age = calculateAge(farmer.dob);

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!fullName.trim() || !mobileNumber.trim() || !village.trim() || !cropName.trim()) {
        throw new Error('Please fill in all mandatory fields.');
      }
      const updatedFarmer: Farmer = {
        ...farmer,
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        dob,
        gender,
        fatherOrSpouseName: fatherOrSpouseName.trim() || undefined,
        village: village.trim(),
        taluk: taluk.trim() || undefined,
        district: district.trim(),
        state: state.trim(),
        pinCode: pinCode.trim(),
        landArea: parseFloat(landArea) || farmer.landArea,
        cropName: cropName.trim(),
        secondaryCrops: secondaryCrops.trim() || undefined,
        soilType,
        irrigationSource,
        status,
        updatedAt: new Date().toISOString(),
      };

      await onUpdateFarmer(updatedFarmer);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update record.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await onDeleteFarmer(farmer.id || farmer.farmerId);
      setIsDeleting(false);
      onClose();
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete record.');
      setLoading(false);
    }
  };

  // Mobile Native Share via WhatsApp or System sheet
  const handleShare = async () => {
    const text = `🌾 KisanSetu Digital Pass\nFarmer: ${farmer.fullName}\nID: ${farmer.farmerId}\nVillage: ${farmer.village}, ${farmer.state}\nCrop: ${farmer.cropName} (${farmer.landArea} Acres)\nStatus: ${farmer.status}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Kisan Pass - ${farmer.fullName}`,
          text: text,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full shadow-2xl border-t sm:border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Mobile Drag Indicator Bar */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-2.5 mb-1 sm:hidden"></div>

        {/* Header Bar */}
        <div className="bg-emerald-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-emerald-950 font-bold flex items-center justify-center text-lg shadow-inner">
              <User className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase font-extrabold bg-emerald-950/80 text-amber-300 px-2 py-0.5 rounded border border-emerald-700">
                  {farmer.farmerId}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    farmer.status === 'Approved'
                      ? 'bg-emerald-500 text-white'
                      : farmer.status === 'Pending'
                      ? 'bg-amber-400 text-amber-950'
                      : 'bg-blue-400 text-blue-950'
                  }`}
                >
                  {farmer.status}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1 font-['Plus_Jakarta_Sans'] leading-tight">
                {farmer.fullName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              title="Share Pass"
              className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
            >
              {copiedShare ? <Check className="w-4 h-4 text-amber-300" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-emerald-900/70 hover:bg-emerald-900 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          {/* Delete Warning */}
          {isDeleting ? (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-red-700">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Confirm Record Deletion</span>
              </div>
              <p className="text-xs text-red-700">
                Delete <strong>{farmer.fullName}</strong> ({farmer.farmerId}) from Firebase database?
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs"
                >
                  {loading ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleting(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSaveUpdate} className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Personal Details
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-sm font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Village</label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Crop</label>
                      <input
                        type="text"
                        value={cropName}
                        onChange={(e) => setCropName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as FarmerStatus)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold"
                      >
                        <option value="Approved">Approved</option>
                        <option value="Pending">Pending</option>
                        <option value="Active">Active</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{loading ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Digital Card & Details */
            <div className="space-y-4">
              {/* Digital Mobile Pass */}
              <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
                <div className="absolute right-2 top-2 opacity-15">
                  <QrCode className="w-20 h-20 text-white" />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
                      Digital Kisan Pass
                    </span>
                    <h4 className="text-lg font-extrabold text-white font-mono mt-0.5">
                      {farmer.farmerId}
                    </h4>
                    <p className="text-xs text-emerald-100 mt-1">{farmer.fullName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-200 block uppercase">Reg. Date</span>
                    <span className="text-xs font-bold font-mono">
                      {new Date(farmer.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Contact Action Bar for Mobile */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${farmer.mobileNumber}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 active:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200/80 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call Farmer</span>
                </a>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-50 active:bg-blue-100 text-blue-800 font-bold text-xs border border-blue-200/80 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Share Pass</span>
                </button>
              </div>

              {/* 1. Personal Details */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Personal Details</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">DOB & Age</span>
                    <span className="font-semibold text-slate-800">
                      {farmer.dob} {age !== null ? `(${age} yrs)` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Gender / Category</span>
                    <span className="font-semibold text-slate-800">
                      {farmer.gender} • {farmer.category || 'General'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Mobile</span>
                    <span className="font-mono font-bold text-slate-900">+91 {farmer.mobileNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Father/Spouse</span>
                    <span className="font-semibold text-slate-800">{farmer.fatherOrSpouseName || '—'}</span>
                  </div>
                </div>
              </div>

              {/* 2. Address Details */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Address Details</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Village</span>
                    <span className="font-bold text-slate-900">{farmer.village}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">District & State</span>
                    <span className="font-semibold text-slate-800">
                      {farmer.district}, {farmer.state}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">PIN Code</span>
                    <span className="font-mono font-semibold text-slate-800">{farmer.pinCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Taluka / Block</span>
                    <span className="font-semibold text-slate-800">{farmer.taluk || '—'}</span>
                  </div>
                </div>
              </div>

              {/* 3. Agricultural Details */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Agricultural Details</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Land Holding</span>
                    <span className="font-bold text-emerald-800">{farmer.landArea} Acres</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Primary Crop</span>
                    <span className="font-bold text-slate-900">{farmer.cropName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Soil & Irrigation</span>
                    <span className="font-semibold text-slate-800">
                      {farmer.soilType || 'Alluvial'} • {farmer.irrigationSource || 'Canal'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">DBT Bank Linkage</span>
                    <span className="font-mono text-slate-700">
                      {farmer.bankAccountLast4 ? `Linked (•• ${farmer.bankAccountLast4})` : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        {!isEditing && !isDeleting && (
          <div className="bg-slate-50 p-3 sm:p-4 border-t border-slate-200 flex items-center justify-between shrink-0 pb-[env(safe-area-inset-bottom,12px)]">
            <button
              type="button"
              onClick={() => setIsDeleting(true)}
              className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Record</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

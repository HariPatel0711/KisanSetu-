import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Users,
  Eye,
  Wheat,
  MapPin,
  Phone,
  Plus,
  Download,
  RotateCcw,
  Sparkles,
  ChevronRight,
  UserPlus,
  PhoneCall,
} from 'lucide-react';
import { Farmer, FarmerStatus, TabType } from '../types';

interface FarmersListViewProps {
  farmers: Farmer[];
  onViewDetails: (farmer: Farmer) => void;
  onNavigate: (tab: TabType) => void;
  initialSearchQuery?: string;
}

export const FarmersListView: React.FC<FarmersListViewProps> = ({
  farmers,
  onViewDetails,
  onNavigate,
  initialSearchQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [statusFilter, setStatusFilter] = useState<'All' | FarmerStatus>('All');
  const [selectedCrop, setSelectedCrop] = useState<string>('All');

  const uniqueCrops = useMemo(() => {
    const set = new Set<string>();
    farmers.forEach((f) => {
      if (f.cropName) set.add(f.cropName);
    });
    return Array.from(set).sort();
  }, [farmers]);

  const filteredFarmers = useMemo(() => {
    return farmers.filter((farmer) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        farmer.farmerId.toLowerCase().includes(q) ||
        farmer.fullName.toLowerCase().includes(q) ||
        farmer.mobileNumber.toLowerCase().includes(q) ||
        farmer.village.toLowerCase().includes(q) ||
        farmer.cropName.toLowerCase().includes(q) ||
        farmer.district.toLowerCase().includes(q) ||
        farmer.state.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || farmer.status === statusFilter;
      const matchesCrop = selectedCrop === 'All' || farmer.cropName === selectedCrop;

      return matchesSearch && matchesStatus && matchesCrop;
    });
  }, [farmers, searchQuery, statusFilter, selectedCrop]);

  return (
    <div className="space-y-3 pb-24 max-w-lg mx-auto">
      {/* Mobile Search Header */}
      <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
              6. Farmer Directory
            </h1>
            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              {farmers.length}
            </span>
          </div>
          <button
            onClick={() => onNavigate('register')}
            className="px-2.5 py-1 rounded-xl bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Farmer</span>
          </button>
        </div>

        {/* Search Farmer Option */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, Name, Mobile, Village, Crop..."
            className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-slate-400"
            >
              ✕
            </button>
          )}
        </div>

        {/* Scrollable Status Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {(['All', 'Approved', 'Pending', 'Active'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all ${
                statusFilter === st
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 active:bg-slate-200'
              }`}
            >
              {st}
              {st === 'Pending' && farmers.filter((f) => f.status === 'Pending').length > 0 && (
                <span className="ml-1 px-1 rounded-full bg-amber-400 text-slate-950 text-[9px]">
                  {farmers.filter((f) => f.status === 'Pending').length}
                </span>
              )}
            </button>
          ))}

          {uniqueCrops.length > 0 && (
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-slate-100 border border-slate-200 text-[11px] rounded-full px-2 py-1 font-semibold text-slate-700 shrink-0"
            >
              <option value="All">All Crops</option>
              {uniqueCrops.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Mobile Record Cards List (Meets prompt 6: Farmer ID, Farmer Name, Mobile Number, Village, Crop Name, View Details button) */}
      <div className="space-y-2.5">
        {filteredFarmers.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 shadow-sm space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No farmers found</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {searchQuery
                ? `No record matching "${searchQuery}".`
                : 'No farmer records available.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filteredFarmers.map((farmer) => (
            <div
              key={farmer.id || farmer.farmerId}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-2.5 active:scale-[0.99] transition-transform"
            >
              {/* Top Row: Farmer ID & Status Badge */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {farmer.farmerId}
                </span>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    farmer.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : farmer.status === 'Pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {farmer.status}
                </span>
              </div>

              {/* Farmer Name */}
              <div>
                <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                  {farmer.fullName}
                </h3>
                {/* Mobile Number */}
                <p className="text-xs text-slate-600 font-mono mt-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>+91 {farmer.mobileNumber}</span>
                </p>
              </div>

              {/* Village & Crop Name info badges */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2 rounded-xl border border-slate-100">
                {/* Village */}
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                    Village
                  </span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{farmer.village}</span>
                  </span>
                </div>

                {/* Crop Name */}
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                    Crop Name
                  </span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 truncate">
                    <Wheat className="w-3 h-3 text-amber-600 shrink-0" />
                    <span className="truncate">{farmer.cropName}</span>
                  </span>
                </div>
              </div>

              {/* Actions: View Details button & Quick Phone */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  {farmer.landArea} Acres • {farmer.state}
                </span>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${farmer.mobileNumber}`}
                    className="p-1.5 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-700"
                    title="Call"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
                  </a>
                  {/* View Details button */}
                  <button
                    onClick={() => onViewDetails(farmer)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-sm inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

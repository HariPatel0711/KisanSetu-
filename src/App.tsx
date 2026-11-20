import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { Farmer, TabType } from './types';
import { SAMPLE_FARMERS } from './seedData';
import { MobileStatusBar } from './components/MobileStatusBar';
import { MobileHeader } from './components/MobileHeader';
import { BottomNav } from './components/BottomNav';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { RegisterWizard } from './components/RegisterWizard';
import { FarmersListView } from './components/FarmersListView';
import { FarmerDetailsModal } from './components/FarmerDetailsModal';
import { ProfileView } from './components/ProfileView';
import { Smartphone, Maximize2, Minimize2, Sparkles, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState('');
  
  // Mobile View Container Mode for desktop previews: 'device' (framed) or 'full' (stretched mobile)
  const [isDeviceFrame, setIsDeviceFrame] = useState(true);

  // Auto-switch to full width on actual mobile screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsDeviceFrame(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore farmers collection only when user is authenticated
  useEffect(() => {
    if (!currentUser) {
      setFarmers([]);
      return;
    }

    const farmersCol = collection(db, 'farmers');
    const q = query(farmersCol, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: Farmer[] = [];
        snapshot.forEach((docSnap) => {
          fetched.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Farmer, 'id'>),
          });
        });

        if (fetched.length > 0) {
          setFarmers(fetched);
        } else {
          // Fallback to sample data until user registers or seeds
          const mappedSamples: Farmer[] = SAMPLE_FARMERS.map((s, idx) => ({
            ...s,
            id: `sample-${idx}`,
            registeredBy: currentUser.uid,
            registeredByEmail: currentUser.email || 'officer@kisansetu.gov.in',
          }));
          setFarmers(mappedSamples);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'farmers');
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Seed sample farmers into real Firestore if requested
  const handleSeedSampleData = async () => {
    if (!currentUser) return;
    setIsSeeding(true);
    try {
      const batch = writeBatch(db);
      SAMPLE_FARMERS.forEach((sample) => {
        const docRef = doc(collection(db, 'farmers'));
        batch.set(docRef, {
          ...sample,
          registeredBy: currentUser.uid,
          registeredByEmail: currentUser.email || 'officer@kisansetu.gov.in',
        });
      });
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'farmers');
    } finally {
      setIsSeeding(false);
    }
  };

  // Add / Save new farmer
  const handleSaveFarmer = async (newFarmerData: Omit<Farmer, 'id'>): Promise<Farmer> => {
    if (!currentUser) {
      throw new Error('You must be signed in to register a farmer.');
    }

    const docRef = doc(collection(db, 'farmers'));
    const payload = {
      ...newFarmerData,
      registeredBy: currentUser.uid,
      registeredByEmail: currentUser.email || '',
    };

    try {
      await setDoc(docRef, payload);
      const created: Farmer = {
        id: docRef.id,
        ...payload,
      };
      return created;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `farmers/${docRef.id}`);
    }
  };

  // Update farmer
  const handleUpdateFarmer = async (updated: Farmer) => {
    if (!currentUser) return;
    const docId = updated.id.startsWith('sample-') ? null : updated.id;

    if (!docId) {
      setFarmers((prev) => prev.map((f) => (f.farmerId === updated.farmerId ? updated : f)));
      if (selectedFarmer?.farmerId === updated.farmerId) {
        setSelectedFarmer(updated);
      }
      return;
    }

    try {
      const docRef = doc(db, 'farmers', docId);
      const { id, ...dataToSave } = updated;
      await updateDoc(docRef, dataToSave as any);
      if (selectedFarmer?.id === updated.id) {
        setSelectedFarmer(updated);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `farmers/${docId}`);
    }
  };

  // Delete farmer
  const handleDeleteFarmer = async (farmerDocOrUniqueId: string) => {
    if (!currentUser) return;
    if (farmerDocOrUniqueId.startsWith('sample-')) {
      setFarmers((prev) => prev.filter((f) => f.id !== farmerDocOrUniqueId));
      return;
    }

    try {
      const docRef = doc(db, 'farmers', farmerDocOrUniqueId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `farmers/${farmerDocOrUniqueId}`);
    }
  };

  // Sign out
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentTab('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-lg font-bold font-['Plus_Jakarta_Sans']">KisanSetu Mobile</h2>
        <p className="text-xs text-emerald-300 mt-1">Starting Mobile App Engine...</p>
      </div>
    );
  }

  // Not signed in -> Mobile Auth Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center sm:p-4">
        {/* Mobile View Toggle Bar for Desktop Previewers */}
        <div className="hidden sm:flex items-center justify-between w-full max-w-sm mb-3 px-2 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mobile Device Simulation</span>
          </span>
          <button
            onClick={() => setIsDeviceFrame(!isDeviceFrame)}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300"
          >
            {isDeviceFrame ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            <span>{isDeviceFrame ? 'Full Width' : 'Phone Frame'}</span>
          </button>
        </div>

        <div
          className={`w-full transition-all duration-300 ${
            isDeviceFrame
              ? 'max-w-[410px] min-h-[780px] rounded-[48px] ring-[12px] ring-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden border-4 border-slate-700/60 bg-emerald-950 flex flex-col'
              : 'min-h-screen flex flex-col'
          }`}
        >
          <MobileStatusBar />
          <div className="flex-1 overflow-y-auto">
            <AuthView />
          </div>
        </div>
      </div>
    );
  }

  const pendingCount = farmers.filter((f) => f.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center sm:py-6 sm:px-4">
      {/* Top Desktop Helper Bar (Preview mode switcher & info) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-3 px-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="font-bold text-white tracking-wide">KisanSetu Mobile App</span>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-300 border border-slate-700">
            PWA Ready
          </span>
        </div>
        <button
          onClick={() => setIsDeviceFrame(!isDeviceFrame)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-emerald-300 transition-colors"
        >
          {isDeviceFrame ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          <span>{isDeviceFrame ? 'Expand Full Screen' : 'Phone Frame Mode'}</span>
        </button>
      </div>

      {/* Mobile Smartphone Frame Container */}
      <div
        className={`w-full transition-all duration-300 bg-slate-100 flex flex-col relative ${
          isDeviceFrame
            ? 'max-w-[420px] h-[860px] rounded-[52px] ring-[14px] ring-slate-800 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] overflow-hidden border-4 border-slate-700/80'
            : 'min-h-screen'
        }`}
      >
        {/* Native Mobile Status Bar (9:41, 5G, Wi-Fi, 98% Battery, Notch Island) */}
        <MobileStatusBar />

        {/* Mobile Top App Bar */}
        <MobileHeader
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          userEmail={currentUser.email}
          onQuickSearch={() => setCurrentTab('farmers')}
        />

        {/* Scrollable Mobile Screen Body */}
        <main className="flex-1 overflow-y-auto px-3.5 pt-3.5 pb-20 overscroll-contain">
          {currentTab === 'home' && (
            <DashboardView
              userEmail={currentUser.email}
              userName={currentUser.displayName}
              farmers={farmers}
              onNavigate={setCurrentTab}
              onSearchFarmer={() => {
                setInitialSearchQuery('');
                setCurrentTab('farmers');
              }}
              onViewFarmerDetails={(farmer) => setSelectedFarmer(farmer)}
              onLogout={handleLogout}
              onSeedSampleData={handleSeedSampleData}
              isSeeding={isSeeding}
            />
          )}

          {currentTab === 'register' && (
            <RegisterWizard
              userId={currentUser.uid}
              userEmail={currentUser.email || ''}
              onSaveFarmer={handleSaveFarmer}
              onNavigate={setCurrentTab}
              onViewDetails={(farmer) => setSelectedFarmer(farmer)}
            />
          )}

          {currentTab === 'farmers' && (
            <FarmersListView
              farmers={farmers}
              onViewDetails={(farmer) => setSelectedFarmer(farmer)}
              onNavigate={setCurrentTab}
              initialSearchQuery={initialSearchQuery}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              userEmail={currentUser.email}
              userName={currentUser.displayName}
              onLogout={handleLogout}
              registeredCount={farmers.length}
            />
          )}
        </main>

        {/* Farmer Details Slide-Up Sheet Modal (Requirement 7) */}
        {selectedFarmer && (
          <FarmerDetailsModal
            farmer={selectedFarmer}
            onClose={() => setSelectedFarmer(null)}
            onUpdateFarmer={handleUpdateFarmer}
            onDeleteFarmer={handleDeleteFarmer}
          />
        )}

        {/* Mobile Bottom Navigation Bar (Requirement 9: Home, Register, Farmers, Profile) */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          pendingCount={pendingCount}
        />
      </div>
    </div>
  );
}

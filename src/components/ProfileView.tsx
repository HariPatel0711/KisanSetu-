import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Info,
  Shield,
  LogOut,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Server,
  FileCheck,
  Download,
} from 'lucide-react';
import { updateProfile, updatePassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ProfileViewProps {
  userEmail: string | null;
  userName: string | null;
  onLogout: () => void;
  registeredCount: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userEmail,
  userName,
  onLogout,
  registeredCount,
}) => {
  const { isInstallable, install } = usePWAInstall();
  const [name, setName] = useState(userName || (userEmail ? userEmail.split('@')[0] : ''));
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  // Change password modal/form
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // About modal / policy modal
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !name.trim()) return;
    setIsUpdatingName(true);
    setNameSuccess(false);
    try {
      await updateProfile(auth.currentUser, {
        displayName: name.trim(),
      });
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (err: any) {
      console.error('Update name error:', err);
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setPasswordLoading(true);
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setPasswordStatus({ type: 'success', message: 'Password updated successfully!' });
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setShowPasswordModal(false), 2000);
      }
    } catch (err: any) {
      console.error('Password error:', err);
      if (err.code === 'auth/requires-recent-login') {
        if (auth.currentUser?.email) {
          await sendPasswordResetEmail(auth, auth.currentUser.email);
          setPasswordStatus({
            type: 'success',
            message: 'A secure password reset link has been dispatched to your email.',
          });
        }
      } else {
        setPasswordStatus({
          type: 'error',
          message: err.message || 'Failed to update password.',
        });
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!auth.currentUser?.email) return;
    setPasswordLoading(true);
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      setPasswordStatus({
        type: 'success',
        message: `Password reset instructions sent to ${auth.currentUser.email}`,
      });
    } catch (err: any) {
      setPasswordStatus({
        type: 'error',
        message: err.message || 'Could not send reset email.',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-24 max-w-lg mx-auto">
      {/* Officer Profile Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center space-x-3.5 border-b border-slate-100 pb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold flex items-center justify-center text-xl shadow-md">
            {name ? name.charAt(0).toUpperCase() : 'O'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-extrabold text-slate-900">{name || 'Designated Officer'}</h2>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                Registrar
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{userEmail}</p>
            <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
              National Agriculture Portal • Mobile Desk
            </p>
          </div>
        </div>

        {/* User Name edit */}
        <form onSubmit={handleUpdateName} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
              User Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={userEmail || ''}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-400 bg-slate-100 cursor-not-allowed"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            {nameSuccess ? (
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Updated!
              </span>
            ) : <span />}
            <button
              type="submit"
              disabled={isUpdatingName}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs"
            >
              {isUpdatingName ? 'Saving...' : 'Save Name'}
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Settings List (Change Password, About, Privacy, Logout) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
        {isInstallable && (
          <button
            onClick={install}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Download className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Install to Home Screen</h3>
                <p className="text-[10px] text-slate-500">Run as standalone mobile application</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Install
            </span>
          </button>
        )}

        <button
          onClick={() => {
            setShowPasswordModal(true);
            setPasswordStatus(null);
          }}
          className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Lock className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Change Password</h3>
              <p className="text-[10px] text-slate-500">Update login password or reset via email</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setShowAboutModal(true)}
          className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Info className="w-4 h-4 text-blue-700" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">About Application</h3>
              <p className="text-[10px] text-slate-500">KisanSetu Mobile Build v2.4.1</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setShowPrivacyModal(true)}
          className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Shield className="w-4 h-4 text-teal-700" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Privacy Policy</h3>
              <p className="text-[10px] text-slate-500">Farmer PII security & encryption rules</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={onLogout}
          className="w-full p-3.5 flex items-center justify-between hover:bg-red-50/60 active:bg-red-100 transition-colors text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <LogOut className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-red-700">Logout</h3>
              <p className="text-[10px] text-slate-500">End your active mobile session</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-red-600">Sign Out</span>
        </button>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden"></div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Change Password</span>
              </h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 text-sm">
                ✕
              </button>
            </div>

            {passwordStatus && (
              <div
                className={`p-2.5 rounded-xl text-xs flex items-start gap-1.5 ${
                  passwordStatus.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                <span>{passwordStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 chars"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50"
                />
              </div>

              <div className="pt-2 flex flex-col gap-2 pb-[env(safe-area-inset-bottom,8px)]">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow"
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={handleSendResetEmail}
                  className="w-full py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
                >
                  Send Reset Link to Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ABOUT MODAL */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3 pb-[env(safe-area-inset-bottom,16px)]">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden"></div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">About KisanSetu Mobile</h3>
              <button onClick={() => setShowAboutModal(false)} className="text-slate-400">
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official mobile registry application for agricultural profiling, Digital Kisan Pass generation, and Firebase cloud data synchronization.
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 space-y-1">
              <p>• Build: 2.4.1 (Native Mobile PWA)</p>
              <p>• Database: Google Cloud Firestore</p>
              <p>• Auth: Firebase Authentication</p>
              <p>• Offline Caching: Enabled</p>
            </div>
            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* PRIVACY MODAL */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3 pb-[env(safe-area-inset-bottom,16px)]">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden"></div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Privacy & Data Safety</h3>
              <button onClick={() => setShowPrivacyModal(false)} className="text-slate-400">
                ✕
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2 max-h-[50vh] overflow-y-auto">
              <p>
                <strong>PII Isolation:</strong> Sensitive personal identifiers like Aadhaar and Bank account numbers are strictly truncated to the last 4 digits only.
              </p>
              <p>
                <strong>Security Rules:</strong> Firestore security rules enforce attribute-based access control (ABAC). Writes are restricted to authenticated registry officers.
              </p>
            </div>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Loader2, Key } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

const UserProfile: React.FC = () => {
  const { adminUser, updateProfile } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Password change states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync profile details on mount
  useEffect(() => {
    if (adminUser) {
      setName(adminUser.name);
      setEmail(adminUser.email);
    }
  }, [adminUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    // Validate passwords if user attempts password update
    if (password && password !== confirmPassword) {
      setError('New passwords do not match.');
      setIsSaving(false);
      return;
    }

    try {
      const payload: any = { name, email };
      if (password) {
        payload.password = password;
      }

      const res = await api.put('/auth/profile', payload);
      if (res.success) {
        updateProfile(name, email);
        setSaveSuccess(true);
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn pb-10">
      
      {/* Notifications */}
      {error && (
        <div className="p-3 bg-red-950/20 border border-red-500/25 text-red-300 text-xs rounded-lg">{error}</div>
      )}
      
      {saveSuccess && (
        <div className="p-3 bg-green-950/20 border border-green-500/25 text-green-300 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Admin profile credentials updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Profile parameters */}
        <div className="space-y-4 p-5 bg-[#121212] border border-zinc-800 rounded-xl">
          <h3 className="text-xs font-bold text-zinc-400 border-b border-zinc-800 pb-2 uppercase tracking-wider">Account Credentials</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 font-bold uppercase">Display Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-[#161616] border border-zinc-850 rounded-lg text-xs text-zinc-200 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 font-bold uppercase">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#161616] border border-zinc-850 rounded-lg text-xs text-zinc-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Change Password Group */}
        <div className="space-y-4 p-5 bg-[#121212] border border-zinc-800 rounded-xl">
          <h3 className="text-xs font-bold text-zinc-400 border-b border-zinc-800 pb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Key className="w-4 h-4 text-primary" />
            Update Password (Optional)
          </h3>
          
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 font-bold uppercase">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className="w-full px-4 py-2 bg-[#161616] border border-zinc-850 rounded-lg text-xs text-zinc-200 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 font-bold uppercase">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 bg-[#161616] border border-zinc-850 rounded-lg text-xs text-zinc-200 focus:outline-none"
            />
          </div>
        </div>

      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-zinc-800">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-primary hover:bg-[#b59870] disabled:bg-primary/50 text-[#0d0d0d] font-semibold text-sm rounded-lg flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-primary/10"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Updating Profile...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Profile
            </>
          )}
        </button>
      </div>

    </form>
  );
};

export default UserProfile;

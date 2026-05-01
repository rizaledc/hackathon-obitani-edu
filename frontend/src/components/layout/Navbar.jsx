import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserCog, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';

const Navbar = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [orgName, setOrgName] = useState('');
  
  const [editData, setEditData] = useState({ name: '', email: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.organization_id) {
      api.get(`/api/organizations/${user.organization_id}`)
        .then(res => setOrgName(res.data.name || res.data.nama))
        .catch(() => setOrgName('-'));
    }
  }, [user?.organization_id]);

  useEffect(() => {
    if (showEditModal && user) {
      setEditData({ name: user.name || '', email: user.email || '' });
    }
  }, [showEditModal, user]);

  const getPageTitle = (path) => {
    if (path.startsWith('/map')) return 'Eksplorasi Lahan';
    if (path.startsWith('/chat')) return 'Pakar AI';
    if (path.startsWith('/analytics')) return 'Laporan Analisis';
    if (path.startsWith('/history')) return 'Riwayat Data';
    if (path.startsWith('/admin/users')) return 'Kelola Pengguna';
    if (path.startsWith('/admin/organizations')) return 'Daftar Organisasi';
    if (path.startsWith('/admin/mlops')) return 'Dashboard MLOps';
    return 'Beranda';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    const confirm = window.confirm(
      "Apakah Anda yakin ingin keluar dari Orbitani Edu?"
    );
    if (!confirm) return;
    localStorage.removeItem('token');
    localStorage.removeItem('login_time');
    useAuthStore.getState().logout();
    navigate('/login');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSaving(true);
    try {
      await api.put(`/api/users/${user.id}`, { name: editData.name, email: editData.email });
      const res = await api.get('/api/auth/me');
      useAuthStore.getState().setUser(res.data);
      setShowEditModal(false);
      setShowProfile(false);
    } catch (err) {
      alert(err.response?.data?.detail || 'Gagal menyimpan profil');
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = user?.name || user?.username || 'Pengguna Tamu';

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-[50] transition-all duration-300">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-text-primary dark:text-white">
          {getPageTitle(location.pathname)}
        </h1>
        <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-text-secondary rounded-md border border-gray-200 uppercase tracking-wide">
          Orbitani Edu v1.0
        </span>
      </div>
      
      <div className="flex items-center gap-4 relative">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-text-primary dark:text-white">
            {displayName}
          </span>
          <span className="text-xs bg-green-100 text-green-800 font-semibold px-2 py-1 rounded mt-0.5 capitalize">
            {user?.role || 'user'}
          </span>
        </div>
        <div 
          onClick={() => setShowProfile(!showProfile)}
          className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm cursor-pointer hover:bg-primary-dark transition-colors select-none"
        >
          {getInitials(displayName)}
        </div>

        {showProfile && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50">
              <button onClick={() => { setShowEditModal(true); setShowProfile(false); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl transition-colors">
                <UserCog size={15} />
                Edit Profil
              </button>
              <div className="border-t border-gray-100" />
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-b-xl transition-colors">
                <LogOut size={15} />
                Keluar
              </button>
            </div>
          </>
        )}
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <UserCog size={18} className="text-primary" />
                Edit Profil
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 font-bold px-2 py-1 text-lg leading-none">&times;</button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Username (Read Only)</label>
                <input 
                  type="text" 
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-500 cursor-not-allowed" 
                  value={user?.username || ''} 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" 
                  value={editData.name} 
                  onChange={e => setEditData({...editData, name: e.target.value})} 
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" 
                  value={editData.email} 
                  onChange={e => setEditData({...editData, email: e.target.value})} 
                  placeholder="contoh@email.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Role & Organisasi</label>
                <div className="flex gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded-lg text-sm font-semibold capitalize border border-green-200">
                    {user?.role || 'user'}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 flex-1 truncate">
                    {orgName || 'Memuat...'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-gray-100">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Batal</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

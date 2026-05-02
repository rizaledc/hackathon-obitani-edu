import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserCog, LogOut, Copy, ChevronRight } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import useToast from '../../hooks/useToast';
import useConfirm from '../../hooks/useConfirm';

const encodeOrgId = (id) => 'ORB-' + String(id).padStart(5, '0');

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuthStore();
  const isSuperadmin = user?.role === 'superadmin';
  const isAdmin = user?.role === 'admin';

  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();

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

  const displayName = user?.name || user?.username || 'User';

  const initials = (user?.name || user?.username || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    const confirm = await showConfirm(
      "Apakah Anda yakin ingin keluar dari Orbitani Edu?"
    );
    if (!confirm) return;
    localStorage.removeItem('token');
    localStorage.removeItem('login_time');
    useAuthStore.getState().logout();
    navigate('/login');
  };

  // Removed handleSaveProfile since profile is view-only



  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-6 sticky top-0 z-[50] transition-all duration-300">
      <div className="flex items-center gap-2 md:gap-3">
        <button onClick={onMenuClick} className="md:hidden p-1.5 -ml-1 text-gray-600 hover:bg-gray-100 rounded-lg">
          <ChevronRight size={22} />
        </button>
        <h1 className="text-lg md:text-xl font-semibold text-text-primary dark:text-white truncate max-w-[150px] sm:max-w-xs">
          {getPageTitle(location.pathname)}
        </h1>
        <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-text-secondary rounded-md border border-gray-200 uppercase tracking-wide">
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
          {initials}
        </div>

        {showProfile && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50">
              <button onClick={() => { setShowEditModal(true); setShowProfile(false); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl transition-colors">
                <UserCog size={15} />
                Profil Pengguna
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
                Profil Pengguna
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 font-bold px-2 py-1 text-lg leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-4">
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
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-500 cursor-not-allowed" 
                  value={editData.name} 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-500 cursor-not-allowed" 
                  value={editData.email} 
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

              {(isSuperadmin || isAdmin) && user?.organization_id && (
                <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-100">
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Kode Undangan Organisasi
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="font-mono font-bold text-green-700">
                      {encodeOrgId(user.organization_id)}
                    </code>
                    <button type="button" onClick={() => {
                      navigator.clipboard.writeText(encodeOrgId(user.organization_id));
                      showToast('Kode disalin!', 'success');
                    }}>
                      <Copy size={14} className="text-gray-400 hover:text-green-600 transition-colors" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Bagikan kode ini ke pengguna untuk bergabung
                  </p>
                </div>
              )}
              <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-gray-100">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2 text-sm font-bold text-white bg-gray-600 hover:bg-gray-700 rounded-xl transition-colors">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

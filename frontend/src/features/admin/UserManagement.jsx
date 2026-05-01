import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Shield, ShieldCheck, User, Trash2, 
  Plus, Search, ChevronUp, ChevronDown, 
  UserCog, Building2, X, MapPin, FileText
} from 'lucide-react';
import api from '../../services/api';
import useToast from '../../hooks/useToast';
import useConfirm from '../../hooks/useConfirm';
import useAuthStore from '../../store/authStore';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [totalLahan, setTotalLahan] = useState(0);
  const [totalAnalisis, setTotalAnalisis] = useState(0);
  const [orgName, setOrgName] = useState('-');

  const { user: currentUser } = useAuthStore();
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
    role: 'user',
    organization_id: ''
  });

  const { showToast } = useToast();
  const { showConfirm } = useConfirm();

  const fetchData = async () => {
    setLoading(true);
    try {
      let uData = [];
      try {
        const userRes = await api.get('/api/users/');
        uData = userRes.data || [];
      } catch (err) {
        if (err.response?.status === 403) {
          showToast('Akses terbatas untuk role admin', 'warning');
        } else {
          console.error('Failed to fetch users', err);
        }
      }
      if (!Array.isArray(uData) && uData.data) uData = uData.data;
      const filteredUsers = uData.filter(u => u.id !== currentUser?.id);
      setUsers(filteredUsers);

      const orgRes = await api.get('/api/organizations/').catch((err) => {
        if (err.response?.status === 403) {
          setOrgName(`Org #${currentUser?.organization_id || '-'}`);
        }
        return { data: [] };
      });
      let oData = orgRes.data || [];
      if (!Array.isArray(oData) && oData.data) oData = oData.data;
      setOrgs(oData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Fetch lahan count
    api.get('/api/lahan/')
      .then(res => setTotalLahan(res.data?.length || 0))
      .catch(() => setTotalLahan(0));
    
    // Fetch history count  
    api.get('/api/history/')
      .then(res => setTotalAnalisis(res.data?.length || 0))
      .catch(() => setTotalAnalisis(0));
  }, []);

  useEffect(() => {
    if (orgs.length > 0 && currentUser?.organization_id) {
      const org = orgs.find(o => o.id === currentUser.organization_id);
      if (org) setOrgName(org.name || org.nama || `Org #${currentUser.organization_id}`);
    } else if (orgName === '-') {
      setOrgName(currentUser?.organization_id ? `Org #${currentUser.organization_id}` : '-');
    }
  }, [orgs, currentUser, orgName]);

  const stats = useMemo(() => {
    const total = users.length;
    let sa = 0, adm = 0, usr = 0;
    users.forEach(u => {
      if (u.role === 'superadmin') sa++;
      else if (u.role === 'admin') adm++;
      else usr++;
    });
    return { total, sa, adm, usr };
  }, [users]);

  const orgMap = useMemo(() => {
    const map = {};
    orgs.forEach(o => map[o.id] = o.name);
    return map;
  }, [orgs]);

  const filteredUsers = users.filter(u => 
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.username || '').toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name, username) => {
    const str = name || username || 'U';
    return str.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleRoleChange = async (user, newRole) => {
    const confirmed = await showConfirm(`Ubah role pengguna ${user.full_name || user.username} menjadi ${newRole}?`);
    if (!confirmed) return;
    try {
      await api.put(`/api/users/${user.id}`, { role: newRole });
      fetchData();
      showToast('Role berhasil diperbarui', 'success');
    } catch (e) {
      showToast('Gagal mengubah role. Pastikan Anda memiliki akses yang cukup.', 'error');
    }
  };

  const handleDelete = async (user) => {
    const confirmed = await showConfirm(`Hapus pengguna ${user.full_name || user.username}? Tindakan ini tidak dapat dibatalkan.`);
    if (!confirmed) return;
    try {
      await api.delete(`/api/users/${user.id}`);
      fetchData();
      showToast('Pengguna berhasil dihapus', 'success');
    } catch (e) {
      showToast('Gagal menghapus pengguna.', 'error');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/register', {
        ...formData,
        organization_id: formData.organization_id ? parseInt(formData.organization_id) : null
      });
      setShowModal(false);
      setFormData({ username: '', full_name: '', email: '', password: '', role: 'user', organization_id: '' });
      fetchData();
      showToast('Pengguna berhasil ditambahkan', 'success');
    } catch (e) {
      showToast(e.response?.data?.detail || 'Gagal menambahkan pengguna', 'error');
    }
  };

  return (
    <div className="flex-1 p-6 lg:px-8 bg-[#FAFAFA] font-sans h-[calc(100vh-64px)] overflow-y-auto">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-green-600" size={24} />
            Kelola Pengguna
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manajemen akun, hak akses, dan statistik pengguna platform.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={16} />
          Tambah Pengguna
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100 text-gray-600"><Users size={20}/></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Pengguna</p>
            <p className="text-2xl font-bold text-gray-800">{users.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-blue-900"><MapPin size={20}/></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Lahan</p>
            <p className="text-2xl font-bold text-gray-800">{totalLahan}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-yellow-100 text-yellow-700"><FileText size={20}/></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Analisis</p>
            <p className="text-2xl font-bold text-gray-800">{totalAnalisis}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100 text-green-700"><Building2 size={20}/></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Organisasi Saya</p>
            <p className="text-lg font-bold text-gray-800 truncate max-w-[120px]">{orgName}</p>
          </div>
        </div>
      </div>

      {/* MAIN TABLE */}
      <div className="max-w-7xl mx-auto bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Search */}
        <div className="p-4 border-b border-gray-100 flex items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari nama..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        
        {/* Table View */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-4 font-semibold">Nama</th>
                <th className="px-4 py-4 font-semibold">Email</th>
                <th className="px-4 py-4 font-semibold">Role</th>
                <th className="px-4 py-4 font-semibold">Organisasi</th>
                <th className="px-4 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-16 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" style={{animationDelay: '0ms', animationDuration: '900ms'}} />
                      <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" style={{animationDelay: '300ms', animationDuration: '900ms'}} />
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{animationDelay: '600ms', animationDuration: '900ms'}} />
                    </div>
                    <p className="text-sm text-gray-400 mt-3 font-medium">Memuat data pengguna...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-16 text-center text-gray-400 font-medium">
                    Tidak ada pengguna yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors bg-white">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {getInitials(u.full_name, u.username)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">{u.full_name || u.username}</div>
                          <div className="text-xs text-gray-400">@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={u.email ? "text-gray-500" : "text-gray-400"}>{u.email || '-'}</span>
                    </td>
                    <td className="px-4 py-3">
                      {u.role === 'superadmin' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-900 text-white text-xs font-bold">
                          <Shield size={12} /> Superadmin
                        </span>
                      )}
                      {u.role === 'admin' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                          <ShieldCheck size={12} /> Admin
                        </span>
                      )}
                      {u.role === 'user' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                          <User size={12} /> User
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {u.organization_id ? orgMap[u.organization_id] || `Org #${u.organization_id}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.role === 'user' && (
                          <button onClick={() => handleRoleChange(u, 'admin')} className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors">
                            <ChevronUp size={12} /> Admin
                          </button>
                        )}
                        {u.role === 'admin' && (
                          <button onClick={() => handleRoleChange(u, 'user')} className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                            <ChevronDown size={12} /> User
                          </button>
                        )}
                        {u.role !== 'superadmin' && (
                          <button onClick={() => handleDelete(u)} className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors" title="Hapus">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH PENGGUNA */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Tambah Pengguna Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={18}/></button>
            </div>
            <form onSubmit={handleAddUser} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Username <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="johndoe" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                <input required type="password" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Organisasi</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500" value={formData.organization_id} onChange={e => setFormData({...formData, organization_id: e.target.value})}>
                    <option value="">- Pilih Org -</option>
                    {orgs.map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Batal</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors">Simpan Pengguna</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

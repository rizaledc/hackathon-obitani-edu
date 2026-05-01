import React, { useState, useEffect, useMemo } from 'react';
import { Building2, Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../../services/api';

const AdminOrganizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOrgId, setCurrentOrgId] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [orgRes, userRes] = await Promise.all([
        api.get('/api/organizations/'),
        api.get('/api/users/').catch(() => ({ data: [] }))
      ]);
      
      let oData = orgRes.data || [];
      if (!Array.isArray(oData) && oData.data) oData = oData.data;
      setOrganizations(oData);

      let uData = userRes.data || [];
      if (!Array.isArray(uData) && uData.data) uData = uData.data;
      setUsers(uData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const userCounts = useMemo(() => {
    const counts = {};
    users.forEach(u => {
      if (u.organization_id) {
        counts[u.organization_id] = (counts[u.organization_id] || 0) + 1;
      }
    });
    return counts;
  }, [users]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({ name: '' });
    setCurrentOrgId(null);
    setShowModal(true);
  };

  const handleOpenEdit = (org) => {
    setIsEditing(true);
    setFormData({ name: org.name || '' });
    setCurrentOrgId(org.id);
    setShowModal(true);
  };

  const handleDelete = async (org) => {
    if (!window.confirm("Hapus organisasi ini? Semua user terkait akan kehilangan organisasi.")) return;
    try {
      await api.delete(`/api/organizations/${org.id}`);
      fetchData();
    } catch (e) {
      alert('Gagal menghapus organisasi.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    try {
      if (isEditing) {
        await api.put(`/api/organizations/${currentOrgId}`, { name: formData.name });
      } else {
        await api.post('/api/organizations/', { name: formData.name });
      }
      setShowModal(false);
      fetchData();
    } catch (e) {
      alert(e.response?.data?.detail || 'Gagal menyimpan organisasi');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="flex-1 p-6 lg:px-8 bg-[#FAFAFA] font-sans h-[calc(100vh-64px)] overflow-y-auto">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="text-green-600" size={24} />
            Manajemen Organisasi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola daftar tenant dan pelanggan platform secara global.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={16} />
          Tambah Organisasi
        </button>
      </div>

      {/* MAIN TABLE */}
      <div className="max-w-5xl mx-auto bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-4 font-semibold">ID Organisasi</th>
                <th className="px-4 py-4 font-semibold">Nama Organisasi</th>
                <th className="px-4 py-4 font-semibold">Tanggal Dibuat</th>
                <th className="px-4 py-4 font-semibold text-center">Jumlah User</th>
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
                    <p className="text-sm text-gray-400 mt-3 font-medium">Memuat data organisasi...</p>
                  </td>
                </tr>
              ) : organizations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-16 text-center text-gray-400 font-medium">
                    Belum ada organisasi.
                  </td>
                </tr>
              ) : (
                organizations.map((org, idx) => (
                  <tr key={org.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-4 py-3 font-mono text-gray-400 text-xs">
                      #{org.id}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-800">
                      {org.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(org.created_at)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                        {org.user_count !== undefined ? org.user_count : (userCounts[org.id] || 0)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(org)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors" title="Edit">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(org)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">
                {isEditing ? 'Edit Organisasi' : 'Tambah Organisasi'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={18}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nama Organisasi <span className="text-red-500">*</span></label>
                <input 
                  required 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="PT. Orbitani Makmur" 
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Batal</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrganizations;

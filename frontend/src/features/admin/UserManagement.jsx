import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import OrbitaniLoader from '../../components/OrbitaniLoader';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/api/admin/users');
        setUsers(res.data.data || res.data || []);
      } catch (err) {
        setError('Gagal memuat daftar pengguna.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="p-10 flex justify-center"><OrbitaniLoader status="processing" /></div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Kelola Pengguna</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-sm text-gray-600">ID</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Username</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Email</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">Tidak ada data pengguna.</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-800">{user.id}</td>
                  <td className="p-4 text-sm text-gray-800">{user.username}</td>
                  <td className="p-4 text-sm text-gray-800">{user.email || '-'}</td>
                  <td className="p-4 text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;

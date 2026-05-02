import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatCard from '../../components/ui/StatCard';
import { Users, MapTrifold, ChartLineUp, Buildings } from '@phosphor-icons/react';
import OrbitaniLoader from '../../components/OrbitaniLoader';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/api/admin/dashboard');
        setData(res.data.data || res.data);
      } catch (err) {
        setError('Gagal memuat data dashboard admin.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-10 flex justify-center"><OrbitaniLoader status="processing" /></div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Admin</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Pengguna" 
          value={data?.total_user || 0} 
          icon={<Users size={24} />} 
        />
        <StatCard 
          title="Total Lahan" 
          value={data?.total_lahan || 0} 
          icon={<MapTrifold size={24} />} 
        />
        <StatCard 
          title="Total Analisis" 
          value={data?.total_analisis || 0} 
          icon={<ChartLineUp size={24} />} 
        />
        <StatCard 
          title="Total Organisasi" 
          value={data?.total_organisasi || 0} 
          icon={<Buildings size={24} />} 
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

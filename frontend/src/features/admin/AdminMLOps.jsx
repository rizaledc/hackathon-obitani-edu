import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import OrbitaniLoader from '../../components/OrbitaniLoader';

const AdminMLOps = () => {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retrainLoading, setRetrainLoading] = useState(false);
  const [retrainMsg, setRetrainMsg] = useState('');

  useEffect(() => {
    const fetchMLOps = async () => {
      try {
        const res = await api.get('/api/admin/mlops');
        setModelInfo(res.data.data || res.data);
      } catch (err) {
        setError('Gagal memuat info MLOps.');
      } finally {
        setLoading(false);
      }
    };
    fetchMLOps();
  }, []);

  const handleRetrain = async () => {
    setRetrainLoading(true);
    setRetrainMsg('');
    setError('');
    try {
      const res = await api.post('/api/admin/mlops/retrain');
      setRetrainMsg(res.data.message || 'Model berhasil di-retrain.');
    } catch (err) {
      setError('Gagal retrain model.');
    } finally {
      setRetrainLoading(false);
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><OrbitaniLoader status="processing" /></div>;

  return (
    <div className="p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard MLOps</h2>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm font-medium">{error}</div>}
      {retrainMsg && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-sm font-medium">{retrainMsg}</div>}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Model</h3>
        <div className="space-y-3 mb-6 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Nama File:</span>
            <span className="font-medium text-gray-800">{modelInfo?.nama_file || 'model_klasifikasi_tanaman.h5'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Ukuran:</span>
            <span className="font-medium text-gray-800">{modelInfo?.ukuran || '120 MB'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Tanggal Modified:</span>
            <span className="font-medium text-gray-800">{modelInfo?.tanggal_modified || new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Total Prediksi:</span>
            <span className="font-medium text-gray-800">{modelInfo?.total_prediksi || 0}</span>
          </div>
        </div>

        <button 
          onClick={handleRetrain}
          disabled={retrainLoading}
          className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50"
        >
          {retrainLoading ? 'Memproses Retrain...' : 'Retrain Model'}
        </button>
      </div>
    </div>
  );
};

export default AdminMLOps;

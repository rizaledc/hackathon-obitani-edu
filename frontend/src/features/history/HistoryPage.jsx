import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import OrbitaniLoader from '../../components/OrbitaniLoader';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/api/history/');
        setHistory(res.data.data || res.data || []);
      } catch (err) {
        setError('Gagal memuat riwayat analisis.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-10 flex justify-center"><OrbitaniLoader status="processing" /></div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Riwayat Analisis</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-sm text-gray-600">ID</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Tanaman</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Confidence</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">Tidak ada riwayat analisis.</td>
              </tr>
            ) : (
              history.map(item => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-800">{item.id}</td>
                  <td className="p-4 text-sm text-gray-800 capitalize">{item.plant || item.hasil_analisis?.plant}</td>
                  <td className="p-4 text-sm text-gray-800">
                    {item.confidence || item.hasil_analisis?.confidence ? 
                      ((item.confidence || item.hasil_analisis?.confidence) * 100).toFixed(0) + '%' : '-'}
                  </td>
                  <td className="p-4 text-sm text-gray-800">
                    {new Date(item.created_at || item.tanggal || Date.now()).toLocaleDateString()}
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

export default HistoryPage;

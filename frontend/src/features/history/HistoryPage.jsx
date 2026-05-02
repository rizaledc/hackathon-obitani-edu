import React, { useState, useEffect } from 'react';
import { Download, ChevronLeft, ChevronRight, FileSpreadsheet, MapPin } from 'lucide-react';
import api from '../../services/api';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [lahanMap, setLahanMap] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [histRes, lahanRes] = await Promise.all([
        api.get('/api/history/'),
        api.get('/api/lahan/')
      ]);

      const lahanData = lahanRes.data || [];
      const map = {};
      lahanData.forEach(l => {
        map[l.id] = l.nama || 'Lahan Tanpa Nama';
      });
      setLahanMap(map);

      let histData = histRes.data || [];
      // Jika format { data: [...] }
      if (!Array.isArray(histData) && histData.data) {
        histData = histData.data;
      }
      
      histData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setHistory(histData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;

    const headers = ['Tanggal', 'Jam (WIB)', 'Nama Lahan', 'Longitude', 'Latitude', 'N (mg/kg)', 'P (mg/kg)', 'K (mg/kg)', 'pH', 'Suhu (°C)', 'Kelembaban (%)', 'Curah Hujan (mm)', 'Rekomendasi Tanaman'];
    
    const rows = history.map(item => {
      const date = new Date(item.created_at);
      const tanggal = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      const jam = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
      const namaLahan = lahanMap[item.lahan_id] || 'Lahan Tidak Diketahui';
      
      return [
        tanggal,
        jam,
        `"${namaLahan}"`,
        (item.longitude || 0).toFixed(4),
        (item.latitude || 0).toFixed(4),
        Math.round(item.n || 0),
        Math.round(item.p || 0),
        Math.round(item.k || 0),
        (item.ph || 0).toFixed(2),
        (item.temperature || 0).toFixed(2),
        Math.round(item.humidity || 0),
        Math.round(item.rainfall || 0),
        item.hasil_rekomendasi || '-'
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `laporan-orbitani-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination Logic
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = history.slice(startIndex, startIndex + itemsPerPage);

  const getPaginationGroup = () => {
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, '...', totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }
    return pages;
  };

  const getBadgeColor = (crop) => {
    if (!crop) return 'bg-gray-100 text-gray-600';
    const colors = ['bg-green-100 text-green-700', 'bg-blue-100 text-blue-700', 'bg-amber-100 text-amber-700', 'bg-purple-100 text-purple-700', 'bg-rose-100 text-rose-700'];
    let hash = 0;
    for (let i = 0; i < crop.length; i++) {
      hash = crop.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % colors.length;
    return colors[idx];
  };

  return (
    <div className="flex-1 p-6 lg:px-8 bg-[#FAFAFA] font-sans h-[calc(100vh-64px)] overflow-y-auto">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileSpreadsheet className="text-green-600" size={24} />
            Laporan Historis
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Data rekam jejak kondisi biofisik lahan dan hasil rekomendasi tanaman.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={loading || history.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-green-700 bg-white border border-green-600 rounded-lg hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <Download size={16} />
          Export ke Excel
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-4 font-semibold">Tanggal & Waktu</th>
                  <th className="px-4 py-4 font-semibold">Lokasi Lahan</th>
                  <th className="px-4 py-4 font-semibold text-center">N</th>
                  <th className="px-4 py-4 font-semibold text-center">P</th>
                  <th className="px-4 py-4 font-semibold text-center">K</th>
                  <th className="px-4 py-4 font-semibold text-center">pH</th>
                  <th className="px-4 py-4 font-semibold text-center">Suhu</th>
                  <th className="px-4 py-4 font-semibold text-center">Humid</th>
                  <th className="px-4 py-4 font-semibold text-center">Rainfall</th>
                  <th className="px-4 py-4 font-semibold text-center">Rekomendasi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-16 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" style={{animationDelay: '0ms', animationDuration: '900ms'}} />
                        <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" style={{animationDelay: '300ms', animationDuration: '900ms'}} />
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{animationDelay: '600ms', animationDuration: '900ms'}} />
                      </div>
                      <p className="text-sm text-gray-400 mt-3 font-medium">Memuat data historis...</p>
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-16 text-center text-gray-400 font-medium">
                      Belum ada data historis.
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, idx) => {
                    const d = new Date(item.created_at);
                    return (
                      <tr key={item.id || idx} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-700">{d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                          <div className="text-xs text-gray-400">{d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                            <MapPin size={14} className="text-gray-400" />
                            {lahanMap[item.lahan_id] || 'Lahan Tidak Diketahui'}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5 ml-5">
                            {(item.longitude||0).toFixed(4)}, {(item.latitude||0).toFixed(4)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600 font-medium">{Math.round(item.n||0)}</td>
                        <td className="px-4 py-3 text-center text-gray-600 font-medium">{Math.round(item.p||0)}</td>
                        <td className="px-4 py-3 text-center text-gray-600 font-medium">{Math.round(item.k||0)}</td>
                        <td className="px-4 py-3 text-center text-orange-500 font-semibold">{(item.ph||0).toFixed(2)}</td>
                        <td className="px-4 py-3 text-center text-red-500 font-semibold">{(item.temperature||0).toFixed(2)}°C</td>
                        <td className="px-4 py-3 text-center text-blue-500 font-semibold">{Math.round(item.humidity||0)}%</td>
                        <td className="px-4 py-3 text-center text-blue-500 font-semibold">{Math.round(item.rainfall||0)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getBadgeColor(item.hasil_rekomendasi)}`}>
                            {item.hasil_rekomendasi ? item.hasil_rekomendasi.toUpperCase() : '-'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {!loading && history.length > 0 && (
            <div className="border-t border-gray-100 p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Menampilkan <span className="font-bold text-gray-700">{startIndex + 1}</span> - <span className="font-bold text-gray-700">{Math.min(startIndex + itemsPerPage, history.length)}</span> dari <span className="font-bold text-gray-700">{history.length}</span> data
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {getPaginationGroup().map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={page === '...'}
                    className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors
                      ${page === currentPage 
                        ? 'bg-green-600 text-white shadow-sm' 
                        : page === '...' 
                          ? 'text-gray-400 cursor-default' 
                          : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;

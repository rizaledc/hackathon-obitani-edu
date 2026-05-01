import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Activity, Users, Building2, BarChart2 } from 'lucide-react';
import {
  BarChart, Bar, Cell, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];

const StatCard = ({ title, value, icon, bg }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-full">
    <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [historyData, setHistoryData] = useState([]);
  const [lahanMap, setLahanMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [histRes, lahanRes, dashRes] = await Promise.all([
          api.get('/api/history/'),
          api.get('/api/lahan/'),
          api.get('/api/admin/dashboard').catch(() => ({ data: {} })) // fallback jika endpoint admin diakses user biasa
        ]);

        setStats(dashRes.data || {});

        const lahanObj = {};
        (lahanRes.data || []).forEach(l => {
          lahanObj[l.id] = l.nama || 'Lahan Tanpa Nama';
        });
        setLahanMap(lahanObj);

        let hData = histRes.data || [];
        if (!Array.isArray(hData) && hData.data) {
          hData = hData.data;
        }
        setHistoryData(hData);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Section 2: Top 3 Rekomendasi Tanaman
  const cropFreq = useMemo(() => {
    const counts = {};
    historyData.forEach(h => {
      const rec = h.hasil_rekomendasi || 'Tidak Diketahui';
      counts[rec] = (counts[rec] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
  }, [historyData]);

  // Section 3 & 5: Average N, P, K, pH per Lahan
  const lahanAverages = useMemo(() => {
    const groups = {};
    historyData.forEach(h => {
      const id = h.lahan_id;
      if (!groups[id]) {
        groups[id] = { n: 0, p: 0, k: 0, ph: 0, count: 0, id };
      }
      groups[id].n += (h.n || 0);
      groups[id].p += (h.p || 0);
      groups[id].k += (h.k || 0);
      groups[id].ph += (h.ph || 0);
      groups[id].count += 1;
    });
    return Object.values(groups).map(g => ({
      name: lahanMap[g.id] || 'Tidak Diketahui',
      N: Math.round(g.n / g.count),
      P: Math.round(g.p / g.count),
      K: Math.round(g.k / g.count),
      pH: parseFloat((g.ph / g.count).toFixed(2))
    }));
  }, [historyData, lahanMap]);



  // Section 6: Scatter Plot
  const scatterData = useMemo(() => {
    const crops = {};
    historyData.forEach(h => {
      const c = h.hasil_rekomendasi || 'Unknown';
      if (!crops[c]) crops[c] = [];
      crops[c].push({ x: h.rainfall || 0, y: h.n || 0, z: c });
    });
    return crops;
  }, [historyData]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-[calc(100vh-64px)] bg-[#FAFAFA]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" style={{animationDelay: '0ms', animationDuration: '900ms'}} />
          <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" style={{animationDelay: '300ms', animationDuration: '900ms'}} />
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{animationDelay: '600ms', animationDuration: '900ms'}} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:px-8 bg-[#FAFAFA] font-sans h-[calc(100vh-64px)] overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
        <BarChart2 className="text-green-600" size={24} />
        Laporan Analitik
      </h1>

      {/* SECTION 1 — Kartu Statistik Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Lahan" 
          value={stats.total_lahan ?? lahanMap ? Object.keys(lahanMap).length : 0} 
          icon={<MapPin className="text-blue-600" size={20} />} 
          bg="bg-blue-50" 
        />
        <StatCard 
          title="Total Analisis" 
          value={stats.total_analisis ?? historyData.length} 
          icon={<Activity className="text-green-600" size={20} />} 
          bg="bg-green-50" 
        />
        <StatCard 
          title="Total User" 
          value={stats.total_user ?? stats.total_users ?? 0} 
          icon={<Users className="text-amber-600" size={20} />} 
          bg="bg-amber-50" 
        />
        <StatCard 
          title="Total Organisasi" 
          value={stats.total_organisasi ?? stats.total_organizations ?? 0} 
          icon={<Building2 className="text-purple-600" size={20} />} 
          bg="bg-purple-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        {/* SECTION 2 — Top 3 Rekomendasi Tanaman (BarChart) */}
        <ChartCard title="TOP 3 Rekomendasi Tanaman">
          {cropFreq.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={cropFreq}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="value" name="Jumlah" radius={[0, 4, 4, 0]}>
                  {cropFreq.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">Belum ada data</div>
          )}
        </ChartCard>

        {/* SECTION 3 — Perbandingan Rata-rata N, P, K Per Lahan (BarChart) */}
        <ChartCard title="Perbandingan NPK Per Lahan">
          {lahanAverages.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lahanAverages}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Legend />
                <Bar dataKey="N" fill="#22c55e" name="Nitrogen (N)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="P" fill="#3b82f6" name="Fosfor (P)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="K" fill="#a855f7" name="Kalium (K)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">Belum ada data</div>
          )}
        </ChartCard>



        {/* SECTION 5 — Distribusi pH Per Lahan (BarChart horizontal) */}
        <ChartCard title="Profil pH Tanah Per Lahan">
          {lahanAverages.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={lahanAverages}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 14]} tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="pH" name="Nilai pH" radius={[0, 4, 4, 0]}>
                  {lahanAverages.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.pH < 5.5 ? '#ef4444' : entry.pH <= 7 ? '#eab308' : '#22c55e'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">Belum ada data</div>
          )}
        </ChartCard>

        {/* SECTION 6 — Scatter Plot Rainfall vs N (ScatterChart) */}
        <ChartCard title="Korelasi Curah Hujan vs Nitrogen">
          {Object.keys(scatterData).length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" name="Curah Hujan" unit="mm" tick={{ fontSize: 12 }} />
                <YAxis type="number" dataKey="y" name="Nitrogen" unit="mg/kg" tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                {Object.entries(scatterData).map(([crop, data], idx) => (
                  <Scatter 
                    key={crop} 
                    name={crop} 
                    data={data} 
                    fill={COLORS[idx % COLORS.length]} 
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">Belum ada data</div>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default AnalyticsPage;

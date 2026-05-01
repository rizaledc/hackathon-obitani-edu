import React, { useState, useEffect } from 'react';
import { 
  Activity, Brain, Server, Database, Globe, Zap, 
  CheckCircle2, BarChart2, MapPin, Users, Building2, Cpu, Key, FileText, CheckCircle
} from 'lucide-react';
import api from '../../services/api';

const InfoCard = ({ title, value, icon, valueColor = "text-gray-800" }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-4">
    {icon && (
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 text-gray-500 shrink-0">
        {icon}
      </div>
    )}
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500 mb-1">{title}</p>
      <div className={`text-sm font-semibold truncate ${valueColor}`}>{value}</div>
    </div>
  </div>
);

const SectionHeader = ({ title, icon }) => (
  <div className="flex items-center gap-2 mb-4 mt-8 first:mt-0">
    <div className="w-1 h-4 bg-green-600 rounded-full" />
    {icon && <span className="text-gray-700">{icon}</span>}
    <h2 className="text-base font-bold text-gray-800">{title}</h2>
  </div>
);

const AdminMLOps = () => {
  const [loading, setLoading] = useState(true);
  const [mlopsData, setMlopsData] = useState({});
  const [dashData, setDashData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mlRes, dashRes] = await Promise.all([
          api.get('/api/admin/mlops'),
          api.get('/api/admin/dashboard')
        ]);
        setMlopsData(mlRes.data || {});
        setDashData(dashRes.data || {});
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const fileName = mlopsData.model_info?.file_name || '-';
  const sizeKb = mlopsData.model_info?.size_bytes 
    ? (mlopsData.model_info.size_bytes / 1024).toFixed(1) 
    : '0';
  const modifiedAt = mlopsData.model_info?.modified_at
    ? new Date(mlopsData.model_info.modified_at)
      .toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : '-';
  const totalPredictions = mlopsData.total_predictions || 0;

  return (
    <div className="flex-1 p-6 lg:px-8 bg-[#FAFAFA] font-sans h-[calc(100vh-64px)] overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
          <Cpu className="text-green-600" size={24} />
          Dashboard MLOps
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Monitoring model Machine Learning dan status infrastruktur layanan AI.
        </p>

        {/* SECTION 1 — Status Engine AI */}
        <SectionHeader title="Status Engine AI" icon={<Activity size={18} />} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard 
            title="Status" 
            value={
              <span className="flex items-center gap-1.5 text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Online
              </span>
            } 
            icon={<CheckCircle2 size={18} className="text-green-600" />} 
          />
          <InfoCard title="Active Index" value="0" icon={<Activity size={18} />} />
          <InfoCard title="Total Keys In Pool" value="5" icon={<Database size={18} />} />
          <InfoCard title="Pool Keys" value="Key 1 (Active), Key 2, Key 3, Key 4, Key 5" icon={<Server size={18} />} valueColor="text-gray-600 text-[11px]" />
          <InfoCard title="Current Active Key" value="Key 1 (Rotating)" icon={<Key size={18} />} />
          <InfoCard title="Model Gemini" value="gemini-2.5-flash (Primary)" icon={<Brain size={18} />} />
        </div>

        {/* SECTION 2 — Info Model ML */}
        <SectionHeader title="Info Model ML" icon={<Brain size={18} />} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard title="Nama Model" value={fileName} icon={<FileText size={18} />} />
          <InfoCard title="Ukuran File" value={`${sizeKb} KB`} icon={<Database size={18} />} />
          <InfoCard title="Total Prediksi" value={totalPredictions} icon={<BarChart2 size={18} />} />
          <InfoCard title="Tanggal Modified" value={modifiedAt} icon={<CheckCircle size={18} />} />
          <InfoCard title="Algoritma" value="Random Forest Classifier" icon={<Cpu size={18} />} />
          <InfoCard title="Dataset" value="Crop Recommendation - 22 Label Tanaman" icon={<Database size={18} />} />
          <InfoCard title="Akurasi Training" value=">99%" icon={<Zap size={18} className="text-amber-500" />} valueColor="text-green-600" />
          <InfoCard title="Fitur Input" value="N, P, K, Temperature, Humidity, pH, Rainfall" icon={<Activity size={18} />} valueColor="text-xs" />
        </div>

        {/* SECTION 3 — Status Infrastruktur */}
        <SectionHeader title="Status Infrastruktur" icon={<Server size={18} />} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Backend Azure", icon: <Server size={18} /> },
            { name: "Database Supabase", icon: <Database size={18} /> },
            { name: "Google Earth Engine", icon: <Globe size={18} /> },
            { name: "Gemini AI", icon: <Brain size={18} /> }
          ].map((infra, idx) => (
            <InfoCard 
              key={idx}
              title={infra.name} 
              value={
                <span className="flex items-center gap-1.5 text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500" /> Online
                </span>
              }
              icon={infra.icon} 
            />
          ))}
        </div>

        {/* SECTION 4 — Statistik Platform */}
        <SectionHeader title="Statistik Platform" icon={<BarChart2 size={18} />} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
          <InfoCard title="Total Lahan Terdaftar" value={dashData.total_lahan || 0} icon={<MapPin size={18} className="text-blue-500" />} />
          <InfoCard title="Total Analisis Dilakukan" value={dashData.total_analisis || 0} icon={<Activity size={18} className="text-green-500" />} />
          <InfoCard title="Total Pengguna Aktif" value={dashData.total_user || dashData.total_users || 0} icon={<Users size={18} className="text-amber-500" />} />
          <InfoCard title="Total Organisasi" value={dashData.total_organisasi || dashData.total_organizations || 0} icon={<Building2 size={18} className="text-purple-500" />} />
        </div>
      </div>
    </div>
  );
};

export default AdminMLOps;

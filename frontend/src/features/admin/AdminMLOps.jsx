import React, { useState, useEffect } from 'react';
import { 
  Activity, Brain, Server, Database, Globe, Zap, 
  CheckCircle2, BarChart2, MapPin, Users, Building2, Cpu, Key, FileText, CheckCircle,
  GitBranch, Layers, Target, Settings2
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

  const modifiedAt = mlopsData.model_info?.modified_at
    ? new Date(mlopsData.model_info.modified_at)
      .toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : '-';
  const totalPredictions = mlopsData.total_predictions || 0;

  const modelFiles = [
    { 
      name: "random_forest_model.pkl", 
      size: "2,299 KB",
      role: "Model Utama (Classifier)",
      color: "text-green-700 bg-green-100"
    },
    { 
      name: "minmax_scaler.pkl", 
      size: "2 KB",
      role: "Feature Scaler",
      color: "text-blue-700 bg-blue-100"
    },
    { 
      name: "label_encoder.pkl", 
      size: "1 KB",
      role: "Label Encoder",
      color: "text-purple-700 bg-purple-100"
    }
  ];

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
        
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nama File</th>
                  <th className="px-4 py-3 font-semibold">Ukuran</th>
                  <th className="px-4 py-3 font-semibold">Fungsi</th>
                  <th className="px-4 py-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {modelFiles.map((file, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="px-4 py-3 font-mono text-gray-800 text-xs">
                      {file.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {file.size}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${file.color}`}>
                        {file.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1.5 text-green-600 text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-green-500" /> Online
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard title="Total Prediksi" value={totalPredictions} icon={<BarChart2 size={18} />} />
          <InfoCard title="Tanggal Modified" value={modifiedAt} icon={<CheckCircle size={18} />} />
          <InfoCard title="Algoritma" value="Random Forest Classifier" icon={<Cpu size={18} />} />
          <InfoCard title="Dataset" value="Crop Recommendation - 22 Label Tanaman" icon={<Database size={18} />} />
          <InfoCard title="Akurasi Training" value=">99%" icon={<Zap size={18} className="text-amber-500" />} valueColor="text-green-600" />
          <InfoCard title="Fitur Input" value="N, P, K, Temperature, Humidity, pH, Rainfall" icon={<Activity size={18} />} valueColor="text-xs" />
        </div>

        {/* SECTION 3 — Model Pipeline Info */}
        <SectionHeader title="Model Pipeline Info" icon={<GitBranch size={18} />} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1 */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Layers className="text-blue-500" size={18} />
              Input Features (7 Variabel)
            </h3>
            <ul className="space-y-2">
              {[
                { n: "N (Nitrogen)", s: "Landsat-8 regression" },
                { n: "P (Phosphor)", s: "Landsat-8 regression" },
                { n: "K (Kalium)", s: "Landsat-8 regression" },
                { n: "Temperature", s: "Landsat-8 Thermal + MODIS fallback" },
                { n: "Humidity", s: "ERA5 Magnus Formula + Sentinel-2 fallback" },
                { n: "pH Tanah", s: "Landsat-8 regression" },
                { n: "Rainfall", s: "CHIRPS 30 hari + GPM fallback" }
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  <span className="font-medium text-gray-700">{item.n}</span>
                  <span className="text-gray-400 text-xs"> — dari {item.s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Target className="text-green-500" size={18} />
              Output Rekomendasi (22 Tanaman)
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Padi", "Jagung", "Kacang Arab", "Kacang Merah", "Kacang Gude", "Kacang Moth", "Kacang Hijau", "Kacang Hitam", "Lentil", "Delima", "Pisang", "Mangga", "Anggur", "Semangka", "Melon", "Apel", "Jeruk", "Pepaya", "Kelapa", "Kapas", "Rami", "Kopi"].map(tanaman => (
                <span key={tanaman} className="bg-green-50 text-green-700 rounded-full px-2 py-0.5 text-xs font-medium border border-green-100">
                  {tanaman}
                </span>
              ))}
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <MapPin className="text-red-500" size={18} />
              Strategi Sampling
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><span className="text-gray-400 mt-0.5">•</span> <div><b>Titik Sampel:</b> 10 titik per analisis lahan</div></li>
              <li className="flex items-start gap-2"><span className="text-gray-400 mt-0.5">•</span> <div><b>Metode:</b> 1 Centroid + 9 Random dalam Polygon</div></li>
              <li className="flex items-start gap-2"><span className="text-gray-400 mt-0.5">•</span> <div><b>Resolusi Satelit:</b> 30 meter (Landsat) / 10 meter (Sentinel-2)</div></li>
              <li className="flex items-start gap-2"><span className="text-gray-400 mt-0.5">•</span> <div><b>Periode Rainfall:</b> 30 hari terakhir</div></li>
              <li className="flex items-start gap-2"><span className="text-gray-400 mt-0.5">•</span> <div><b>Cloud Cover Threshold:</b> {'<'} 50% (fallback MODIS jika lebih)</div></li>
            </ul>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Settings2 className="text-purple-500" size={18} />
              Arsitektur Model
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><span className="text-gray-400 mt-0.5">•</span> <div><b>Algoritma:</b> Random Forest Classifier</div></li>
              <li className="flex items-start gap-2"><span className="text-gray-400 mt-0.5">•</span> <div><b>Jumlah Trees:</b> 100 estimators</div></li>
              <li className="flex items-start gap-2"><span className="text-gray-400 mt-0.5">•</span> <div><b>Train/Test Split:</b> 80/20 Stratified</div></li>
              <li className="flex items-start gap-2"><span className="text-gray-400 mt-0.5">•</span> <div><b>Dataset Size:</b> 2.200 sampel</div></li>
              <li className="flex items-start gap-2"><span className="text-gray-400 mt-0.5">•</span> <div><b>Validation:</b> Cross-validation</div></li>
              <li className="flex items-start gap-2"><span className="text-gray-400 mt-0.5">•</span> <div><b>Top Feature:</b> Humidity (SHAP: 0.0317)</div></li>
            </ul>
          </div>
          
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

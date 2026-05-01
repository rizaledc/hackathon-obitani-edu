import React, { useState, useMemo, useEffect } from 'react';
import { 
  Leaf, BarChart2, Droplets, Thermometer, 
  CloudRain, FlaskConical, Sprout, Brain,
  RefreshCw, ChevronRight, Award, TrendingUp,
  Activity, MessageSquare, Send, Info
} from 'lucide-react';
import api from '../../../services/api';
import OrbitaniLoader from '../../../components/OrbitaniLoader';
import { toIndonesian } from '../../../utils/plantNames';
import { Sparkle } from '@phosphor-icons/react';

const pearson = (arr1, arr2) => {
  const n = arr1.length;
  if (n === 0) return 0;
  const avg1 = arr1.reduce((a,b) => a+b, 0) / n;
  const avg2 = arr2.reduce((a,b) => a+b, 0) / n;
  const num = arr1.reduce((s,v,i) => s + (v-avg1)*(arr2[i]-avg2), 0);
  const den = Math.sqrt(
    arr1.reduce((s,v) => s + Math.pow(v-avg1, 2), 0) *
    arr2.reduce((s,v) => s + Math.pow(v-avg2, 2), 0)
  );
  return den === 0 ? 0 : parseFloat((num/den).toFixed(2));
};

const CORR_VARIABLES = [
  { key: 'n', label: 'N' },
  { key: 'p', label: 'P' },
  { key: 'k', label: 'K' },
  { key: 'ph', label: 'pH' },
  { key: 'temperature', label: 'Suhu' },
  { key: 'humidity', label: 'Hum' },
];

const SHAP_VALUES = [
  { feature: 'Humidity', value: 0.0317 },
  { feature: 'N', value: 0.0267 },
  { feature: 'K', value: 0.0252 },
  { feature: 'Rainfall', value: 0.0251 },
  { feature: 'P', value: 0.0229 },
  { feature: 'Temperature', value: 0.0098 },
  { feature: 'pH', value: 0.0046 }
];

const stripMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')  // bold
    .replace(/\*(.*?)\*/g, '$1')       // italic
    .replace(/#{1,6}\s/g, '')          // headers
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // code
    .replace(/^\s*[-*+]\s/gm, '• ')   // bullets
    .replace(/\[KONTEKS LAHAN\][\s\S]*?\[\/KONTEKS LAHAN\]/g, '') // hapus konteks
    .trim();
};

const RecommendationPanel = ({ 
  location, 
  status, 
  result, 
  onAnalyze,
  onClose,
  selectedLahan
}) => {
  const isLoading = status === 'processing';
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    setAiResponse('');
    setAiInput('');
  }, [location?.id]);

  const resultsData = Array.isArray(result) ? result : (result?.results || []);
  const hasData = resultsData.length > 0;

  const handleAskAI = async () => {
    if (!aiInput.trim() || aiLoading) return;
    setAiLoading(true);
    
    try {
      const avg = (key) => {
        if (!resultsData || resultsData.length === 0) return 0;
        const vals = resultsData.map(r => r[key]).filter(v => v != null);
        if (vals.length === 0) return 0;
        return (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(1);
      };

      const cropCount = {};
      resultsData.forEach(r => {
        const crop = r.hasil_rekomendasi;
        if (crop && crop !== 'Unknown') {
          cropCount[crop] = (cropCount[crop] || 0) + 1;
        }
      });
      const getTopCrops = () => Object.entries(cropCount)
        .sort((a,b) => b[1]-a[1])
        .map(([crop, count]) => `${crop} (${Math.round(count/resultsData.length*100)}%)`)
        .join(', ');
      
      const contextMessage = resultsData.length > 0
        ? `Konteks Lahan "${selectedLahan?.nama || location?.id}":
- N: ${avg('n')} mg/kg, P: ${avg('p')} mg/kg, K: ${avg('k')} mg/kg
- pH: ${avg('ph')}, Suhu: ${avg('temperature')}°C
- Kelembaban: ${avg('humidity')}%, Curah Hujan: ${avg('rainfall')}mm
- Rekomendasi dari ${resultsData.length} titik: ${getTopCrops()}
Pertanyaan: ${aiInput}`
        : aiInput;
      
      const res = await api.post('/api/chat/', {
        message: contextMessage,
        lahan_id: location?.id || null,
        session_id: location?.id ? `lahan_${location.id}` : null,
        session_name: location?.id ? `Chat ${selectedLahan?.nama || location.id}` : null,
        user_api_key: null
      });

      const responseText = res.data?.response || res.data?.message || res.data?.data?.reply || res.data?.reply || res.data;
      const textResponse = typeof responseText === 'string' ? responseText : JSON.stringify(responseText);
      setAiResponse(stripMarkdown(textResponse));
      
    } catch (err) {
      console.error(err);
      setAiResponse('Gagal menghubungi Pakar AI. Coba lagi.');
    } finally {
      setAiLoading(false);
    }
  };

  const calculateStats = (key) => {
    if (!hasData) return { min: 0, avg: 0, max: 0, std: 0 };
    const values = resultsData.map(r => r[key]).filter(v => v != null);
    if (values.length === 0) return { min: 0, avg: 0, max: 0, std: 0 };
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a,b) => a+b, 0) / values.length;
    const std = Math.sqrt(values.reduce((s,v) => s + Math.pow(v - avg, 2), 0) / values.length);
    return { 
      min: min.toFixed(1), 
      avg: avg.toFixed(1), 
      max: max.toFixed(1), 
      std: std.toFixed(1) 
    };
  };

  const getAverages = () => ({
    n: calculateStats('n').avg,
    p: calculateStats('p').avg,
    k: calculateStats('k').avg,
    ph: calculateStats('ph').avg,
    temperature: calculateStats('temperature').avg,
    humidity: calculateStats('humidity').avg,
    rainfall: calculateStats('rainfall').avg,
  });

  const getRankings = () => {
    if (!hasData) return [];
    const count = {};
    resultsData.forEach(r => {
      const c = r.hasil_rekomendasi;
      if (c && c !== 'Unknown') count[c] = (count[c] || 0) + 1;
    });
    return Object.entries(count)
      .sort((a,b) => b[1] - a[1])
      .map(([crop, c]) => ({ crop, count: c, percentage: Math.round((c/resultsData.length)*100) }));
  };

  const correlationMatrix = useMemo(() => {
    if (!resultsData || resultsData.length < 2) return null;
    const getColumn = (key) => resultsData.map(r => r[key] || 0);
    return CORR_VARIABLES.map(v1 => 
      CORR_VARIABLES.map(v2 => {
        if (v1.key === v2.key) return 1.00;
        return pearson(getColumn(v1.key), getColumn(v2.key));
      })
    );
  }, [resultsData]);

  const getCellColor = (val) => {
    const abs = Math.abs(val);
    if (abs >= 0.7) return val > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    if (abs >= 0.4) return 'bg-yellow-50 text-yellow-700';
    return 'bg-gray-50 text-gray-400';
  };

  const getNormalization = (key, val) => {
    const ranges = {
      n: [0, 140], p: [5, 145], k: [5, 205], ph: [0, 14], temperature: [0, 50], humidity: [0, 100]
    };
    const [min, max] = ranges[key] || [0, 100];
    const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
    return pct;
  };



  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace('.', ':');
  };

  if (!location) {
    return (
      <div className="flex flex-col min-h-full w-full bg-white text-gray-800 font-sans p-6 items-center justify-center text-center">
        <span className="text-4xl mb-4">🌍</span>
        <p className="text-gray-500">Pilih lahan dari daftar atau peta untuk melihat analisis</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full w-full bg-white text-gray-800 font-sans border-l border-gray-100 shadow-sm overflow-y-auto custom-scrollbar" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      
      {/* HEADER (SECTION 1) */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-20 p-5 border-b border-gray-100 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedLahan?.nama || 'Lahan Tanpa Nama'}</h2>
            {hasData && (
              <p className="text-xs text-gray-500">Analisis: {formatDate(resultsData[0]?.created_at) || 'Baru Saja'}</p>
            )}
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md transition-colors bg-gray-50 hover:bg-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
        <button 
          onClick={onAnalyze}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isLoading ? <OrbitaniLoader status="processing" size="sm" /> : (
            <>
              <RefreshCw size={14} />
              {hasData ? "Perbarui Analisis" : "Analisis Lahan Sekarang"}
            </>
          )}
        </button>
      </div>

      <div className="p-5 flex flex-col gap-8 pb-10">
        
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <OrbitaniLoader status="processing" size="sm" 
              text="Menjalankan 10 titik sampel & MLOps..." />
          </div>
        )}

        {!isLoading && (
          <>
            {!hasData ? (
              <>
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-green-600 rounded-full" />
                    <h4 className="text-sm font-semibold text-gray-700">
                      Top Rekomendasi
                    </h4>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                    <p className="text-gray-400 font-medium">— Belum ada data —</p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-green-600 rounded-full" />
                    <h4 className="text-sm font-semibold text-gray-700">
                      Kondisi Biofisik
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['Nitrogen', 'Phosphor', 'Kalium', 'pH Tanah', 'Suhu', 'Curah Hujan'].map((label) => (
                      <div key={label} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">{label}</span>
                        <span className="text-lg font-bold text-gray-300">—</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-green-600 rounded-full" />
                    <h4 className="text-sm font-semibold text-gray-700">
                      Data Titik Sampel
                    </h4>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex items-center justify-center">
                    <p className="text-gray-400 text-sm font-medium text-center">
                      Analisis lahan untuk melihat data titik sampel
                    </p>
                  </div>
                </section>
              </>
            ) : (
              <>
                {/* SECTION 3 - REKOMENDASI */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-green-600 rounded-full" />
                <h4 className="text-sm font-semibold text-gray-700">
                  Top Rekomendasi
                </h4>
              </div>
              <div className="space-y-3">
                {getRankings().slice(0, 3).map((r, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-gray-800 text-sm flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500">{i + 1}.</span> {toIndonesian(r.crop)}
                      </span>
                      <span className="text-xs font-bold text-[#16a34a] bg-green-100 px-2 py-0.5 rounded">{r.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-[#16a34a] h-1.5 rounded-full" style={{ width: `${r.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 2 - RATA RATA BIOFISIK */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-green-600 rounded-full" />
                <h4 className="text-sm font-semibold text-gray-700">
                  Kondisi Biofisik (Avg)
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Nitrogen', val: getAverages().n, unit: 'mg/kg', icon: <Droplets size={12} className="text-blue-500" /> },
                  { label: 'Phosphor', val: getAverages().p, unit: 'mg/kg', icon: <FlaskConical size={12} className="text-orange-500" /> },
                  { label: 'Kalium', val: getAverages().k, unit: 'mg/kg', icon: <Activity size={12} className="text-yellow-500" /> },
                  { label: 'pH Tanah', val: getAverages().ph, unit: '', icon: <Thermometer size={12} className="text-pink-500" /> },
                  { label: 'Suhu', val: getAverages().temperature, unit: '°C', icon: <Thermometer size={12} className="text-red-500" /> },
                  { label: 'Curah Hujan', val: getAverages().rainfall, unit: 'mm', icon: <CloudRain size={12} className="text-cyan-500" /> },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-1.5 mb-1">
                      {item.icon}
                      <span className="text-xs text-gray-500 font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <p className="text-base font-bold text-gray-800">{item.val}</p>
                      {item.unit && <p className="text-xs text-gray-400">{item.unit}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 6 - PROFIL BAR CHART */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-green-600 rounded-full" />
                <h4 className="text-sm font-semibold text-gray-700">
                  Profil Lahan
                </h4>
              </div>
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                {['n', 'p', 'k', 'ph', 'temperature', 'humidity'].map((key) => {
                  const val = getAverages()[key];
                  const pct = getNormalization(key, val);
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500 uppercase font-semibold">{key}</span>
                        <span className="text-gray-800 font-bold">{val}</span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-green-400 to-[#16a34a] h-1.5" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECTION 5 - STATISTIK */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-green-600 rounded-full" />
                <h4 className="text-sm font-semibold text-gray-700">
                  Statistik N, P, K
                </h4>
              </div>
              <div className="overflow-hidden border border-gray-100 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase">
                    <tr>
                      <th className="px-3 py-2 font-bold">Var</th>
                      <th className="px-3 py-2 font-bold">Min</th>
                      <th className="px-3 py-2 font-bold">Avg</th>
                      <th className="px-3 py-2 font-bold">Max</th>
                      <th className="px-3 py-2 font-bold">Std</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {['n', 'p', 'k'].map(v => {
                      const st = calculateStats(v);
                      return (
                        <tr key={v} className="bg-white">
                          <td className="px-3 py-2 font-bold uppercase text-gray-800">{v}</td>
                          <td className="px-3 py-2 text-gray-600">{st.min}</td>
                          <td className="px-3 py-2 text-[#16a34a] font-bold">{st.avg}</td>
                          <td className="px-3 py-2 text-gray-600">{st.max}</td>
                          <td className="px-3 py-2 text-gray-500">{st.std}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECTION 7 - KORELASI */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Activity size={14} className="text-green-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Korelasi Variabel
                </span>
              </div>
              <div className="overflow-x-auto border border-gray-100 rounded-xl custom-scrollbar pb-1">
                {correlationMatrix ? (
                  <table className="w-full text-xs text-center border-collapse bg-white">
                    <thead>
                      <tr>
                        <th className="p-1 bg-gray-50 border-b border-r border-gray-100"></th>
                        {CORR_VARIABLES.map(v => (
                          <th key={v.key} className="p-2 bg-gray-50 border-b border-gray-100 text-gray-500 font-bold">{v.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {CORR_VARIABLES.map((v1, i) => (
                        <tr key={v1.key}>
                          <th className="p-2 bg-gray-50 border-r border-gray-100 text-gray-600 font-semibold">{v1.label}</th>
                          {correlationMatrix[i].map((val, j) => (
                            <td key={j} className={`p-2 font-mono rounded-sm border border-white ${getCellColor(val)}`}>
                              {val === 1 ? '—' : val.toFixed(2)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-xs">Data tidak cukup untuk menghitung korelasi</div>
                )}
              </div>
            </section>

            {/* SECTION 4 - TABEL TITIK */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-green-600 rounded-full" />
                <h4 className="text-sm font-semibold text-gray-700">
                  Data Titik Sampel (Max 10)
                </h4>
              </div>
              <div className="overflow-x-auto border border-gray-100 rounded-xl custom-scrollbar pb-2">
                <table className="w-full text-[10px] text-left whitespace-nowrap bg-white">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="p-2 font-bold">No</th>
                      <th className="p-2 font-bold">Lat</th>
                      <th className="p-2 font-bold">Lng</th>
                      <th className="p-2 font-bold text-center">N</th>
                      <th className="p-2 font-bold text-center">P</th>
                      <th className="p-2 font-bold text-center">K</th>
                      <th className="p-2 font-bold text-center">pH</th>
                      <th className="p-2 font-bold text-center">Suhu</th>
                      <th className="p-2 font-bold text-center">Hujan</th>
                      <th className="p-2 font-bold">Rekomendasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {resultsData.slice(0, 10).map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50/80">
                        <td className="p-2 font-medium text-gray-600">{i+1}</td>
                        <td className="p-2 font-mono text-gray-600">{r.latitude?.toFixed(4) || '-'}</td>
                        <td className="p-2 font-mono text-gray-600">{r.longitude?.toFixed(4) || '-'}</td>
                        <td className="p-2 text-center text-blue-600 font-medium">{r.n?.toFixed(1) || '-'}</td>
                        <td className="p-2 text-center text-orange-500 font-medium">{r.p?.toFixed(1) || '-'}</td>
                        <td className="p-2 text-center text-yellow-600 font-medium">{r.k?.toFixed(1) || '-'}</td>
                        <td className="p-2 text-center text-pink-600 font-medium">{r.ph?.toFixed(1) || '-'}</td>
                        <td className="p-2 text-center text-gray-600 font-medium">{r.temperature?.toFixed(1) || '-'}</td>
                        <td className="p-2 text-center text-gray-600 font-medium">{r.rainfall?.toFixed(1) || '-'}</td>
                        <td className="p-2 font-bold text-[#16a34a]">{toIndonesian(r.hasil_rekomendasi)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

              </>
            )}

            {/* SECTION 8 - SHAP */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-green-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Feature Importance
                </span>
              </div>
              <div className="space-y-2.5 bg-gray-50 p-4 rounded-xl border border-gray-100">
                {SHAP_VALUES.map((shap, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase text-gray-500 w-16 truncate">{shap.feature}</span>
                    <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(shap.value / SHAP_VALUES[0].value) * 100}%` }}></div>
                    </div>
                    <span className="text-[10px] font-mono font-medium text-gray-600 w-10 text-right">{shap.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 9 - KONSULTASI AI */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={14} className="text-green-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Konsultasi Pakar AI
                </span>
              </div>
              
              <textarea
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                placeholder="Tanyakan analisis mendalam tentang lahan ini..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
                rows={3}
              />
              
              <button
                onClick={handleAskAI}
                disabled={aiLoading || !aiInput.trim()}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white ${aiLoading || !aiInput.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 transition-colors'}`}
              >
                {aiLoading ? (
                  <OrbitaniLoader status="processing" size="sm" />
                ) : (
                  <>
                    <Send size={14} />
                    Kirim Pertanyaan
                  </>
                )}
              </button>

              {aiResponse && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Brain size={12} className="text-green-600" />
                    <span className="text-xs font-semibold text-green-700">
                      Jawaban Pakar AI
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {aiResponse}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendationPanel;

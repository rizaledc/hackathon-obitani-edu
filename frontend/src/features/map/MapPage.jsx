import React, { useState, useEffect, useRef } from 'react';
import MapViewer from './components/MapViewer';
import RecommendationPanel from './components/RecommendationPanel';
import api from '../../services/api';
import { getAIExplanation } from '../../services/aiService';

const MapPage = () => {
  const [lahans, setLahans] = useState([]);
  const [lahansLoading, setLahansLoading] = useState(false);
  const mapRef = useRef(null);

  const getCentroid = (lahan) => {
    try {
      const coords = lahan?.koordinat?.coordinates?.[0];
      if (!coords || coords.length === 0) return null;
      const lat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
      const lng = coords.reduce((s, c) => s + c[0], 0) / coords.length;
      if (isNaN(lat) || isNaN(lng)) return null;
      return [lat, lng];
    } catch {
      return null;
    }
  };
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newPolygonGeom, setNewPolygonGeom] = useState(null);
  const [newLahanName, setNewLahanName] = useState('');
  const [newLahanDesc, setNewLahanDesc] = useState('');

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, processing, done, error
  const [analysisError, setAnalysisError] = useState('');
  
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    const fetchLahans = async () => {
      try {
        setLahansLoading(true);
        const res = await api.get('/api/lahan/');
        setLahans(res.data.data || res.data || []);
      } catch (err) {
        console.error('Gagal memuat lahan', err);
      } finally {
        setLahansLoading(false);
      }
    };
    fetchLahans();
  }, []);

  const handleSelectLocation = (lat, lng, id) => {
    if (status === 'processing') return;
    setSelectedLocation({ lat, lng, id });
    setStatus('idle');
    setRecommendationResult(null);
    setAiResult(null);
    setAiError(null);
    setAnalysisError('');

    if (id) {
      const selectedLahan = lahans.find(l => l.id === id);
      const centroid = getCentroid(selectedLahan);
      if (centroid && mapRef.current) {
        mapRef.current.flyTo(centroid, 14);
      }
    } else if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 14);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedLocation || !selectedLocation.id) {
       setAnalysisError('Pilih lahan terlebih dahulu');
       return;
    }
    
    setStatus('processing');
    setAnalysisError('');
    try {
      const resAnalyze = await api.post(`/api/lahan/${selectedLocation.id}/analyze`);
      setRecommendationResult(resAnalyze.data.data || resAnalyze.data);
      setStatus('done');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setAnalysisError('Gagal melakukan analisis lahan');
    }
  };

  const handlePolygonDrawn = (geometry) => {
    setNewPolygonGeom(geometry);
    setNewLahanName('');
    setNewLahanDesc('');
    setShowSaveModal(true);
  };

  const handleSaveLahan = async () => {
    try {
      const payload = {
        nama: newLahanName || 'Lahan Baru',
        deskripsi: newLahanDesc || 'Deskripsi otomatis',
        koordinat: newPolygonGeom
      };
      const resCreate = await api.post('/api/lahan/', payload);
      const newId = resCreate.data.data?.id || resCreate.data.id;
      
      // Refresh daftar lahan
      const resLahans = await api.get('/api/lahan/');
      setLahans(resLahans.data.data || resLahans.data || []);
      
      setShowSaveModal(false);
      
      // Select the new lahan
      const centroid = getCentroid({ koordinat: newPolygonGeom });
      if (centroid) {
         handleSelectLocation(centroid[0], centroid[1], newId);
      }
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan lahan');
    }
  };

  const handleDemoMode = () => {
    handleSelectLocation(-6.2, 106.8, null);
  };

  const handleAnalyzeAI = async (contextMsg) => {
    if (!recommendationResult || !selectedLocation) return;
    
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);

    try {
      const data = await getAIExplanation({
        plant: recommendationResult.plant,
        confidence: recommendationResult.confidence,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        context: contextMsg
      });
      setAiResult(data);
    } catch (err) {
      console.error(err);
      setAiError("AI sedang sibuk, coba lagi.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6 w-full relative animate-fadeIn">
      <div className="flex-1 rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative group cursor-crosshair">
        <MapViewer onSelectLocation={handleSelectLocation} lahans={lahans} selectedLocation={selectedLocation} mapRef={mapRef} onPolygonDrawn={handlePolygonDrawn} />
        {lahansLoading && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-xs font-semibold text-text-secondary z-[400]">
            Memuat data lahan...
          </div>
        )}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-xs font-semibold text-text-secondary flex items-center gap-2 z-[400] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
          Klik pada area peta atau marker untuk memilih lokasi
        </div>
      </div>
      
      {selectedLocation && (
        <div className="w-[400px] flex-shrink-0 overflow-y-auto pr-2 pb-6 custom-scrollbar animate-slideLeft" style={{ scrollbarWidth: 'none' }}>
          {analysisError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm font-medium">
              {analysisError}
            </div>
          )}
          <RecommendationPanel 
            location={selectedLocation} 
            status={status} 
            result={recommendationResult} 
            aiResult={aiResult}
            aiLoading={aiLoading}
            aiError={aiError}
            onAnalyze={handleAnalyze}
            onAnalyzeAI={handleAnalyzeAI}
            onDemoMode={handleDemoMode}
          />
        </div>
      )}

      {showSaveModal && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-lg animate-fadeIn">
            <h3 className="text-xl font-bold mb-4">Simpan Lahan Baru</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nama Lahan</label>
                <input 
                  type="text" 
                  value={newLahanName}
                  onChange={e => setNewLahanName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Misal: Lahan Tomat A"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Deskripsi</label>
                <textarea 
                  value={newLahanDesc}
                  onChange={e => setNewLahanDesc(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Deskripsi singkat..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button 
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveLahan}
                  className="px-4 py-2 font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Simpan Lahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;

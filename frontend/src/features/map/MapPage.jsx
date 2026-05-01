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

  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [draftPoints, setDraftPoints] = useState([]);
  const [showLahanList, setShowLahanList] = useState(false);

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
    if (isDrawingMode) {
      setDraftPoints(prev => [...prev, [lat, lng]]);
      return;
    }

    if (!id) return; // Abaikan klik di peta kosong jika tidak sedang menggambar

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
    }
  };

  const startDrawing = () => {
    setIsDrawingMode(true);
    setDraftPoints([]);
    setSelectedLocation(null);
  };

  const cancelDrawing = () => {
    setIsDrawingMode(false);
    setDraftPoints([]);
  };

  const finishDrawing = () => {
    if (draftPoints.length < 3) {
      alert("Polygon harus memiliki minimal 3 titik");
      return;
    }
    const closedRing = [...draftPoints.map(p => [p[1], p[0]]), [draftPoints[0][1], draftPoints[0][0]]];
    const geometry = {
      type: "Polygon",
      coordinates: [closedRing]
    };
    setIsDrawingMode(false);
    setDraftPoints([]);
    handlePolygonDrawn(geometry);
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
      
      {/* Panel Daftar Lahan Kiri */}
      {showLahanList && (
        <div className="w-[300px] flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden h-full animate-slideRight">
           <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-800 text-sm">Daftar Lahan</h2>
              <div className="flex items-center gap-2">
                 <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">{lahans.length}</span>
                 <button onClick={() => setShowLahanList(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
           </div>
           <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 custom-scrollbar" style={{ scrollbarWidth: 'thin' }}>
              {lahansLoading ? (
                 <div className="text-center text-sm text-gray-500 py-6">Memuat data...</div>
              ) : lahans.length === 0 ? (
                 <div className="text-center text-sm text-gray-500 py-6 px-2">
                   Belum ada lahan.<br/>Silakan buat polygon baru.
                 </div>
              ) : (
                 lahans.map(lahan => (
                    <button 
                       key={lahan.id}
                       onClick={() => {
                          const centroid = getCentroid(lahan);
                          if (centroid) handleSelectLocation(centroid[0], centroid[1], lahan.id);
                          setShowLahanList(false); // Opsional: tutup daftar setelah dipilih agar map jelas
                       }}
                       className={`text-left p-3 rounded-xl border transition-all ${selectedLocation?.id === lahan.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 hover:border-primary/40 hover:bg-gray-50'}`}
                    >
                       <div className="font-bold text-gray-800 text-sm truncate">{lahan.nama || 'Lahan Tanpa Nama'}</div>
                       <div className="text-xs text-gray-500 mt-1 line-clamp-2">{lahan.deskripsi || 'Tidak ada deskripsi'}</div>
                    </button>
                 ))
              )}
           </div>
        </div>
      )}

      <div className="flex-1 rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative group cursor-crosshair">
        <MapViewer 
          onSelectLocation={handleSelectLocation} 
          lahans={lahans} 
          selectedLocation={selectedLocation} 
          mapRef={mapRef} 
          draftPoints={draftPoints} 
          isDrawingMode={isDrawingMode} 
        />
        
        {/* Navigation & Toolbar (Top Right) */}
        <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-2">
           
           {!isDrawingMode && (
             <div className="bg-white/90 backdrop-blur-sm shadow-md rounded-xl p-1.5 flex flex-col gap-1.5 border border-gray-100">
                {/* Tombol Daftar Lahan */}
                <button 
                  onClick={() => setShowLahanList(!showLahanList)}
                  title="Daftar Lahan Tersimpan"
                  className={`p-2.5 rounded-lg transition-colors flex items-center justify-center ${showLahanList ? 'bg-primary text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100 hover:text-primary'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                
                {/* Tombol Pemetaan Lahan (Buat Polygon) */}
                <button 
                  onClick={startDrawing}
                  title="Mulai Pemetaan Lahan (Polygon)"
                  className="p-2.5 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 hover:text-primary flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
             </div>
           )}

           {/* Custom Zoom Controls */}
           {!isDrawingMode && (
             <div className="bg-white/90 backdrop-blur-sm shadow-md rounded-xl flex flex-col border border-gray-100 overflow-hidden mt-1">
                <button 
                  onClick={() => mapRef.current?.zoomIn()}
                  title="Zoom In"
                  className="p-2.5 bg-white transition-colors text-gray-700 hover:bg-gray-100 hover:text-primary flex items-center justify-center border-b border-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </button>
                <button 
                  onClick={() => mapRef.current?.zoomOut()}
                  title="Zoom Out"
                  className="p-2.5 bg-white transition-colors text-gray-700 hover:bg-gray-100 hover:text-primary flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>
                </button>
             </div>
           )}

           {/* Drawing Mode Actions */}
           {isDrawingMode && (
             <div className="bg-white/95 backdrop-blur-sm shadow-md rounded-xl p-3 flex flex-col gap-2 border border-primary/30 w-48 animate-fadeIn">
                <div className="text-xs font-bold text-gray-700 text-center border-b pb-2">
                   Pemetaan Aktif
                </div>
                <div className="text-[11px] text-gray-500 text-center leading-tight mb-1">
                   Klik di atas peta untuk membuat batas polygon lahan.
                </div>
                <div className="flex flex-col gap-2 mt-1">
                  <button 
                    onClick={finishDrawing}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Selesai
                  </button>
                  <button 
                    onClick={cancelDrawing}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    Batal
                  </button>
                </div>
             </div>
           )}
        </div>

        {lahansLoading && (
          <div className="absolute top-16 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-xs font-semibold text-text-secondary z-[400]">
            Memuat data lahan...
          </div>
        )}
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
            onClose={() => setSelectedLocation(null)}
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

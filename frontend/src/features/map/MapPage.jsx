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

  const getBounds = (lahan) => {
    try {
      const coords = lahan?.koordinat?.coordinates?.[0];
      if (!coords || coords.length === 0) return null;
      
      let minLat = Infinity, maxLat = -Infinity;
      let minLng = Infinity, maxLng = -Infinity;
      
      coords.forEach(c => {
        const lat = c[1];
        const lng = c[0];
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
      });
      
      if (minLat === Infinity) return null;
      return [[minLat, minLng], [maxLat, maxLng]];
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

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({ nama: '', deskripsi: '' });
  const [editingId, setEditingId] = useState(null);

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
      const bounds = getBounds(selectedLahan);
      if (bounds && mapRef.current) {
        // Hitung offset panel UI agar poligon berada tepat di tengah area yang kosong
        const leftPadding = showLahanList ? 320 : 50;
        const rightPadding = 340; // Panel analisis akan terbuka, jadi selalu beri padding kanan
        
        mapRef.current.flyToBounds(bounds, { 
          paddingTopLeft: [leftPadding, 50], 
          paddingBottomRight: [rightPadding, 50],
          maxZoom: 18,
          duration: 1.5 // Animasi lebih halus
        });
      } else {
        const centroid = getCentroid(selectedLahan);
        if (centroid && mapRef.current) {
          mapRef.current.flyTo(centroid, 16);
        }
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
      setNewLahanName('');
      setNewLahanDesc('');
      setNewPolygonGeom(null);
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan lahan');
    }
  };

  const handleDeleteLahan = async (lahanId, e) => {
    e.stopPropagation();
    if (!window.confirm('Yakin ingin menghapus lahan ini?')) return;
    try {
      await api.delete(`/api/lahan/${lahanId}`);
      setLahans(prev => prev.filter(l => l.id !== lahanId));
      if (selectedLocation?.id === lahanId) setSelectedLocation(null);
    } catch {
      alert('Gagal menghapus lahan');
    }
  };

  const handleEditLahan = (lahan, e) => {
    e.stopPropagation();
    setEditingId(lahan.id);
    setEditData({ nama: lahan.nama, deskripsi: lahan.deskripsi || '' });
    setEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/api/lahan/${editingId}`, editData);
      setLahans(prev => prev.map(l => 
        l.id === editingId ? { ...l, ...editData } : l
      ));
      setEditModal(false);
    } catch {
      alert('Gagal mengupdate lahan');
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
    <div className="flex h-[calc(100vh-64px)] w-full relative animate-fadeIn bg-white">
      
      {/* Panel Daftar Lahan Kiri */}
      {showLahanList && (
        <div className="w-[300px] flex-shrink-0 bg-white shadow-[2px_0_10px_rgba(0,0,0,0.05)] border-r border-gray-200 flex flex-col h-full animate-slideRight z-20">
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
                       }}
                       className={`text-left p-3 rounded-xl border transition-all relative group ${selectedLocation?.id === lahan.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 hover:border-primary/40 hover:bg-gray-50'}`}
                    >
                       <div className="font-bold text-gray-800 text-sm truncate pr-14">{lahan.nama || 'Lahan Tanpa Nama'}</div>
                       <div className="text-xs text-gray-500 mt-1 line-clamp-2">{lahan.deskripsi || 'Tidak ada deskripsi'}</div>
                       
                       {/* Tombol Aksi */}
                       <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => handleEditLahan(lahan, e)}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-md"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={(e) => handleDeleteLahan(lahan.id, e)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                            title="Hapus"
                          >
                            🗑️
                          </button>
                       </div>
                    </button>
                 ))
              )}
           </div>
        </div>
      )}

      {/* Map Wrapper */}
      <div className="flex-1 relative group cursor-crosshair z-0 overflow-hidden">
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
        <div className="w-[320px] flex-shrink-0 bg-white shadow-[-2px_0_10px_rgba(0,0,0,0.05)] border-l border-gray-200 overflow-y-auto animate-slideLeft custom-scrollbar flex flex-col h-full z-20" style={{ scrollbarWidth: 'none' }}>
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

      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Lahan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nama Lahan</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 border-gray-200"
                  placeholder="Nama Lahan"
                  value={editData.nama}
                  onChange={e => setEditData(p => ({...p, nama: e.target.value}))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Deskripsi (Opsional)</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 border-gray-200"
                  placeholder="Deskripsi Lahan"
                  rows={3}
                  value={editData.deskripsi}
                  onChange={e => setEditData(p => ({...p, deskripsi: e.target.value}))}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button 
                onClick={() => setEditModal(false)}
                className="px-4 py-2 text-sm font-bold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-4 py-2 text-sm font-bold rounded-lg bg-primary text-white hover:bg-primary-dark shadow-sm transition-colors"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;

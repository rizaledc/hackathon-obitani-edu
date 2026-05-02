import React, { useState, useEffect, useRef } from 'react';
import MapViewer from './components/MapViewer';
import RecommendationPanel from './components/RecommendationPanel';
import api from '../../services/api';
import { getAIExplanation } from '../../services/aiService';
import { Pencil, Trash2, Menu, Compass, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import useToast from '../../hooks/useToast';
import useConfirm from '../../hooks/useConfirm';

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
  const [saving, setSaving] = useState(false);
  const [newPolygonGeom, setNewPolygonGeom] = useState(null);
  const [newLahanName, setNewLahanName] = useState('');
  const [newLahanDesc, setNewLahanDesc] = useState('');

  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [draftPoints, setDraftPoints] = useState([]);
  const [showLahanList, setShowLahanList] = useState(false);
  const [showNavPad, setShowNavPad] = useState(false);

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({ nama: '', deskripsi: '' });
  const [editingId, setEditingId] = useState(null);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [samplePoints, setSamplePoints] = useState([]);
  const [status, setStatus] = useState('idle'); // idle, processing, done, error
  const [analysisError, setAnalysisError] = useState('');
  
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const { showToast } = useToast();
  const { showConfirm } = useConfirm();

  useEffect(() => {
    const fetchLahans = async () => {
      try {
        setLahansLoading(true);
        const res = await api.get('/api/lahan/');
        const data = res.data.data || res.data || [];
        const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setLahans(sorted);
      } catch (err) {
        console.error('Gagal memuat lahan', err);
      } finally {
        setLahansLoading(false);
      }
    };
    fetchLahans();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }, [showLahanList, selectedLocation]);

  const loadLastAnalysis = async (lahanId) => {
    try {
      const res = await api.get(`/api/history/${lahanId}`);
      if (res.data && res.data.length > 0) {
        const latest = res.data.slice(0, 10);
        setRecommendationResult(latest);
        setSamplePoints(latest);
        setStatus('done');
      } else {
        setRecommendationResult(null);
        setSamplePoints([]);
      }
    } catch {
      setRecommendationResult(null);
      setSamplePoints([]);
    }
  };

  const handleSelectLocation = (lat, lng, id) => {
    if (isDrawingMode) {
      setDraftPoints(prev => [...prev, [lat, lng]]);
      return;
    }

    if (!id) return; // Abaikan klik di peta kosong jika tidak sedang menggambar

    if (status === 'processing') return;
    setSelectedLocation({ lat, lng, id });
    setSamplePoints([]); // reset titik sampel lama
    setStatus('idle');
    setRecommendationResult(null);
    setAiResult(null);
    setAiError(null);
    setAnalysisError('');

    if (id) {
      loadLastAnalysis(id);
      const selectedLahan = lahans.find(l => l.id === id);
      const bounds = getBounds(selectedLahan);
      
      // Delay sedikit agar React selesai merender panel kanan dan ukuran container map (flex-1) berubah
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize(); // Beritahu leaflet bahwa ukuran layarnya berubah
          
          if (bounds) {
            mapRef.current.flyToBounds(bounds, { 
              padding: [50, 50], // Padding standar, karena map sudah ada di tengah area flex
              maxZoom: 18,
              duration: 1.5 
            });
          } else {
            const centroid = getCentroid(selectedLahan);
            if (centroid) {
              mapRef.current.flyTo(centroid, 16, { duration: 1.5 });
            }
          }
        }
      }, 100);
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
      showToast("Polygon harus memiliki minimal 3 titik", "warning");
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
      const response = await api.post(`/api/lahan/${selectedLocation.id}/analyze`);
      const resData = response.data.data || response.data;
      setRecommendationResult(resData);
      // Simpan 10 titik sampel
      if (resData.results) {
         setSamplePoints(resData.results);
      } else if (response.data.results) {
         setSamplePoints(response.data.results);
      }
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
    if (saving) return;
    setSaving(true);
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
      const data = resLahans.data.data || resLahans.data || [];
      const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setLahans(sorted);
      
      setShowSaveModal(false);
      setNewLahanName('');
      setNewLahanDesc('');
      setNewPolygonGeom(null);
      showToast('Lahan berhasil disimpan', 'success');
    } catch (error) {
      console.error(error);
      showToast('Gagal menyimpan lahan', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLahan = async (lahanId, e) => {
    e.stopPropagation();
    const confirm = await showConfirm('Yakin ingin menghapus lahan ini?');
    if (!confirm) return;
    try {
      await api.delete(`/api/lahan/${lahanId}`);
      setLahans(prev => prev.filter(l => l.id !== lahanId));
      if (selectedLocation?.id === lahanId) setSelectedLocation(null);
      showToast('Lahan berhasil dihapus', 'success');
    } catch {
      showToast('Gagal menghapus lahan', 'error');
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
      showToast('Lahan berhasil diperbarui', 'success');
    } catch {
      showToast('Gagal mengupdate lahan', 'error');
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
        <div className="w-[20%] min-w-[250px] flex-shrink-0 bg-white shadow-[2px_0_10px_rgba(0,0,0,0.05)] border-r border-gray-200 flex flex-col h-full animate-slideRight z-20">
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
                    <div 
                       key={lahan.id}
                       onClick={() => {
                          const centroid = getCentroid(lahan);
                          if (centroid) handleSelectLocation(centroid[0], centroid[1], lahan.id);
                       }}
                       className={`cursor-pointer text-left p-3 rounded-xl border transition-all relative group ${selectedLocation?.id === lahan.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 hover:border-primary/40 hover:bg-gray-50'}`}
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
                            <Pencil size={14} />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteLahan(lahan.id, e)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                       </div>
                    </div >
                 ))
              )}
           </div>
        </div>
      )}

      {/* Map Wrapper */}
      <div className="flex-1 h-full flex flex-col relative group z-0 overflow-hidden" style={{ height: '100%' }}>
        
        {/* Horizontal Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-white z-[400] relative shadow-sm">
          <button onClick={() => setShowLahanList(!showLahanList)}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${showLahanList ? 'text-primary bg-primary/10' : 'text-gray-600'}`}
            title="Toggle Daftar Lahan">
            <Menu size={18} />
          </button>
          <button onClick={isDrawingMode ? cancelDrawing : startDrawing}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${isDrawingMode ? 'text-primary bg-primary/10' : 'text-gray-600'}`}
            title="Gambar Lahan Baru">
            <Pencil size={18} />
          </button>
          <button onClick={() => setShowNavPad(!showNavPad)}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${showNavPad ? 'text-primary bg-primary/10' : 'text-gray-600'}`}
            title="Toggle Nav Pad">
            <Compass size={18} />
          </button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <span className="text-xs text-gray-400">
            {isDrawingMode ? 'Klik peta untuk membuat polygon (min 3 titik)' : 'Klik pensil untuk menggambar lahan baru'}
          </span>
        </div>

        <div className="flex-1 relative w-full h-full z-0 overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
          <MapViewer 
            onSelectLocation={handleSelectLocation} 
            lahans={lahans} 
            selectedLocation={selectedLocation} 
            mapRef={mapRef} 
            draftPoints={draftPoints} 
            isDrawingMode={isDrawingMode} 
            samplePoints={samplePoints}
            selectedId={selectedLocation?.id}
          />
          
          {/* Custom Zoom Controls */}
          {!isDrawingMode && (
            <div className="absolute top-[20px] right-4 z-[999] flex flex-col gap-1">
              <button onClick={() => mapRef.current?.zoomIn()}
                className="w-8 h-8 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-600 font-bold text-lg">
                +
              </button>
              <button onClick={() => mapRef.current?.zoomOut()}
                className="w-8 h-8 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-600 font-bold text-lg">
                −
              </button>
            </div>
          )}

          {/* Navigation Pad */}
          {showNavPad && (
            <div className="absolute bottom-8 right-4 z-[999]">
              <div className="grid grid-cols-3 gap-1 w-24">
                <div />
                <button onClick={() => mapRef.current?.panBy([0, -100])}
                  className="w-7 h-7 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-600">
                  <ChevronUp size={14} />
                </button>
                <div />
                <button onClick={() => mapRef.current?.panBy([-100, 0])}
                  className="w-7 h-7 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-600">
                  <ChevronLeft size={14} />
                </button>
                <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Compass size={12} className="text-gray-400" />
                </div>
                <button onClick={() => mapRef.current?.panBy([100, 0])}
                  className="w-7 h-7 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-600">
                  <ChevronRight size={14} />
                </button>
                <div />
                <button onClick={() => mapRef.current?.panBy([0, 100])}
                  className="w-7 h-7 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-600">
                  <ChevronDown size={14} />
                </button>
                <div />
              </div>
            </div>
          )}

          {/* Drawing Mode Actions */}
          {isDrawingMode && (
            <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-2">
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
            </div>
          )}

          {lahansLoading && (
            <div className="absolute top-16 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-xs font-semibold text-text-secondary z-[400]">
              Memuat data lahan...
            </div>
          )}
        </div>
      </div>
      
      {selectedLocation && (
        <div className="w-[20%] min-w-[300px] flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto animate-slideLeft custom-scrollbar flex flex-col h-full z-20 shadow-2xl" style={{ scrollbarWidth: 'none' }}>
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
            onClose={() => {
              setSelectedLocation(null);
              setSamplePoints([]); // reset titik merah
              setRecommendationResult(null);
            }}
            selectedLahan={lahans.find(l => l.id === selectedLocation.id)}
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
                  disabled={saving}
                  className={`px-4 py-2 font-semibold text-white rounded-lg ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
                >
                  {saving ? 'Menyimpan...' : 'Simpan Lahan'}
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

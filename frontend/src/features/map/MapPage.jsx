import React, { useState, useEffect } from 'react';
import MapViewer from './components/MapViewer';
import RecommendationPanel from './components/RecommendationPanel';
import api from '../../services/api';
import { getAIExplanation } from '../../services/aiService';

const MapPage = () => {
  const [lahans, setLahans] = useState([]);
  const [lahansLoading, setLahansLoading] = useState(false);
  
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
  };

  const handleAnalyze = async () => {
    if (!selectedLocation) return;
    
    setStatus('processing');
    setAnalysisError('');
    try {
      let lahanId = selectedLocation.id;
      
      if (!lahanId) {
        // Simulasi user menggambar polygon dengan membuat kotak di sekitar titik yang diklik
        const d = 0.001; 
        const payload = {
          koordinat: {
            type: "Polygon",
            coordinates: [[
              [selectedLocation.lng - d, selectedLocation.lat - d],
              [selectedLocation.lng + d, selectedLocation.lat - d],
              [selectedLocation.lng + d, selectedLocation.lat + d],
              [selectedLocation.lng - d, selectedLocation.lat + d],
              [selectedLocation.lng - d, selectedLocation.lat - d]
            ]]
          }
        };
        const resCreate = await api.post('/api/lahan/', payload);
        lahanId = resCreate.data.data?.id || resCreate.data.id;
        
        // Refresh daftar lahan agar polygon baru muncul di peta
        const resLahans = await api.get('/api/lahan/');
        setLahans(resLahans.data.data || resLahans.data || []);
        setSelectedLocation(prev => ({ ...prev, id: lahanId }));
      }
      
      const resAnalyze = await api.post(`/api/lahan/${lahanId}/analyze`);
      setRecommendationResult(resAnalyze.data.data || resAnalyze.data);
      setStatus('done');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setAnalysisError('Gagal melakukan analisis lahan');
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
        <MapViewer onSelectLocation={handleSelectLocation} lahans={lahans} selectedLocation={selectedLocation} />
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
    </div>
  );
};

export default MapPage;

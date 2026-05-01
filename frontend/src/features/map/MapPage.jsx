import React, { useState } from 'react';
import MapViewer from './components/MapViewer';
import RecommendationPanel from './components/RecommendationPanel';
import { getRecommendation } from '../../services/recommendationService';
import { getAIExplanation } from '../../services/aiService';
import { DEMO_LOCATIONS } from '../../utils/demoData';

const MapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, sending, processing, rendering, done
  
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const handleSelectLocation = async (lat, lng) => {
    // Disable clicks during loading
    if (status !== 'idle' && status !== 'done') return;

    setSelectedLocation({ lat, lng });
    setStatus('sending');
    setRecommendationResult(null);
    setAiResult(null);
    setAiError(null);

    // Simulate sending
    setTimeout(() => {
      setStatus('processing');
      // Simulate processing
      setTimeout(async () => {
        setStatus('rendering');
        try {
          const result = await getRecommendation({ lat, lng });
          setRecommendationResult(result);
          setStatus('done');
        } catch (error) {
          console.error(error);
          setStatus('idle');
        }
      }, 1000);
    }, 1000);
  };

  const handleDemoMode = () => {
    const demo = DEMO_LOCATIONS[0]; // Jakarta
    handleSelectLocation(demo.lat, demo.lng);
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
        <MapViewer onSelectLocation={handleSelectLocation} />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-xs font-semibold text-text-secondary flex items-center gap-2 z-[400] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
          Klik pada area peta untuk memilih lokasi
        </div>
      </div>
      
      <div className="w-[400px] flex-shrink-0 overflow-y-auto pr-2 pb-6 custom-scrollbar" style={{ scrollbarWidth: 'none' }}>
        <RecommendationPanel 
          location={selectedLocation} 
          status={status} 
          result={recommendationResult} 
          aiResult={aiResult}
          aiLoading={aiLoading}
          aiError={aiError}
          onAnalyzeAI={handleAnalyzeAI}
          onDemoMode={handleDemoMode}
        />
      </div>
    </div>
  );
};

export default MapPage;

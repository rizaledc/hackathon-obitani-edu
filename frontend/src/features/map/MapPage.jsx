import React, { useState } from 'react';
import MapViewer from './components/MapViewer';
import RecommendationPanel from './components/RecommendationPanel';
import { getRecommendation } from '../../services/recommendationService';
import { getAIExplanation } from '../../services/aiService';

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
    <div className="flex h-[calc(100vh-100px)] gap-6 w-full relative">
      <div className="flex-1 rounded-2xl overflow-hidden shadow-sm border border-gray-200">
        <MapViewer onSelectLocation={handleSelectLocation} />
      </div>
      
      {/* Make panel wider to fit AI Card nicely, and add internal scroll */}
      <div className="w-96 flex-shrink-0 overflow-y-auto pr-2 pb-6 custom-scrollbar" style={{ scrollbarWidth: 'none' }}>
        <RecommendationPanel 
          location={selectedLocation} 
          status={status} 
          result={recommendationResult} 
          aiResult={aiResult}
          aiLoading={aiLoading}
          aiError={aiError}
          onAnalyzeAI={handleAnalyzeAI}
        />
      </div>
    </div>
  );
};

export default MapPage;

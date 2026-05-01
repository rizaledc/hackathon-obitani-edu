import React, { useState } from 'react';
import MapViewer from './components/MapViewer';
import RecommendationPanel from './components/RecommendationPanel';
import { getRecommendation } from '../../services/recommendationService';

const MapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, sending, processing, rendering, done

  const handleSelectLocation = async (lat, lng) => {
    // Disable clicks during loading
    if (status !== 'idle' && status !== 'done') return;

    setSelectedLocation({ lat, lng });
    setStatus('sending');
    setRecommendationResult(null);

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

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6 w-full relative">
      <div className="flex-1 rounded-2xl overflow-hidden shadow-sm border border-gray-200">
        <MapViewer onSelectLocation={handleSelectLocation} />
      </div>
      
      <div className="w-80 flex-shrink-0">
        <RecommendationPanel 
          location={selectedLocation} 
          status={status} 
          result={recommendationResult} 
        />
      </div>
    </div>
  );
};

export default MapPage;

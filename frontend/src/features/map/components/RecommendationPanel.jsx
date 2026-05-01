import React, { useState } from 'react';
import OrbitaniLoader from '../../../components/OrbitaniLoader';
import { toIndonesian } from '../../../utils/plantNames';
import AIExplanationCard from '../../chat/components/AIExplanationCard';
import { Sparkle } from '@phosphor-icons/react';

const RecommendationPanel = ({ 
  location, 
  status, 
  result, 
  aiResult, 
  aiLoading, 
  aiError, 
  onAnalyzeAI 
}) => {
  const isLoading = status !== 'idle' && status !== 'done';
  const [contextInput, setContextInput] = useState("");

  const handleAIAnalysis = () => {
    if (onAnalyzeAI) onAnalyzeAI(contextInput);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col min-h-full">
      <h2 className="text-lg font-bold text-text-primary mb-4">Hasil Rekomendasi</h2>
      
      {!location && (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-text-secondary opacity-70">
          <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm">Klik pada peta untuk memilih lokasi lahan</p>
        </div>
      )}

      {location && (
        <div className="mb-6 p-4 bg-primary-pale rounded-xl border border-primary/20">
          <p className="text-xs font-semibold text-text-secondary mb-1">Koordinat Lahan</p>
          <div className="flex justify-between items-center text-sm font-medium text-text-primary">
            <span>Lat: {location.lat.toFixed(4)}</span>
            <span>Lng: {location.lng.toFixed(4)}</span>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center py-10">
          <OrbitaniLoader status={status} />
        </div>
      )}

      {status === 'done' && result && (
        <div className="flex-1 flex flex-col animate-fade-in pb-2">
          <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100 mb-4">
            <div className="w-20 h-20 bg-primary-pale rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
              <span className="text-3xl">🌱</span>
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-1">
              {toIndonesian(result.plant)}
            </h3>
            <p className="text-sm text-text-secondary font-medium px-3 py-1 bg-gray-100 rounded-full">
              Confidence: <span className="text-primary font-bold">{(result.confidence * 100).toFixed(0)}%</span>
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <p className="text-xs font-bold text-text-secondary uppercase mb-2">Analisis ML</p>
            <p className="text-sm text-text-primary leading-relaxed">
              {result.reason}
            </p>
          </div>
          
          <div className="mt-auto space-y-4">
            <button 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tanam Sekarang
            </button>

            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs font-bold text-text-secondary uppercase mb-2">
                Tanya Pakar AI (Opsional)
              </label>
              <input 
                type="text" 
                placeholder="Misal: Lahan sering tergenang air saat hujan..."
                value={contextInput}
                onChange={(e) => setContextInput(e.target.value)}
                className="w-full text-sm p-3 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
              />
              <button 
                onClick={handleAIAnalysis}
                disabled={aiLoading}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkle size={18} weight="fill" className={aiLoading ? 'animate-pulse' : ''} />
                <span>{aiLoading ? 'Memproses AI...' : 'Analisis AI'}</span>
              </button>
            </div>
          </div>
          
          {aiLoading && (
            <div className="mt-6 py-4">
              <OrbitaniLoader status="processing" />
            </div>
          )}

          {(aiResult || aiError) && !aiLoading && (
            <AIExplanationCard data={aiResult} error={aiError} />
          )}
          
        </div>
      )}
    </div>
  );
};

export default RecommendationPanel;

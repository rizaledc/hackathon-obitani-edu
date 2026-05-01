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
  onAnalyze,
  onAnalyzeAI,
  onDemoMode,
  onClose
}) => {
  const isLoading = status !== 'idle' && status !== 'done';
  const [contextInput, setContextInput] = useState("");

  const handleAIAnalysis = () => {
    if (onAnalyzeAI) onAnalyzeAI(contextInput);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col min-h-full">
      {/* Sticky Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center sticky top-0 z-10 rounded-t-2xl">
         <div className="flex items-center gap-2">
           <h2 className="text-lg font-bold text-gray-800">Hasil Analisis</h2>
           {status === 'done' && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 uppercase tracking-widest font-bold">Rekomendasi Utama</span>}
         </div>
         {onClose && (
           <button 
             onClick={onClose}
             className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
             title="Tutup Panel"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
         )}
      </div>

      <div className="p-6 pt-4 flex-1">
      {!location && (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-text-secondary opacity-70 animate-fadeIn">
          <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm mb-6">Klik peta untuk memulai analisis lahan</p>
          <button 
            onClick={onDemoMode}
            className="text-xs font-bold text-primary bg-primary-pale hover:bg-primary-light hover:text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            Gunakan Demo Data
          </button>
        </div>
      )}

      {location && status === 'idle' && (
        <div className="mb-6 p-4 bg-primary-pale rounded-xl border border-primary/20 animate-slideUp">
          <p className="text-xs font-semibold text-text-secondary mb-1">Koordinat Lahan</p>
          <div className="flex justify-between items-center text-sm font-medium text-text-primary mb-4">
            <span>Lat: {location.lat.toFixed(4)}</span>
            <span>Lng: {location.lng.toFixed(4)}</span>
          </div>
          <button 
            onClick={onAnalyze}
            className="w-full bg-primary text-white font-bold py-2 rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
          >
            Analisis Lahan
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center py-10 animate-fadeIn">
          <OrbitaniLoader status="processing" />
        </div>
      )}

      {status === 'done' && result && (
        <div className="flex-1 flex flex-col animate-slideUp pb-2">
          <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100 mb-6">
            <div className="w-24 h-24 bg-primary-pale rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
              <span className="text-4xl">🌱</span>
            </div>
            <h3 className="text-3xl font-bold text-text-primary mb-4 capitalize">
              {toIndonesian(result.plant)}
            </h3>
            
            <div className="w-full px-4">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-text-secondary uppercase tracking-wider">Confidence Score</span>
                <span className="text-primary">{(result.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${result.confidence * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-xl mb-6 border border-gray-100">
            <p className="text-xs font-bold text-text-secondary uppercase mb-2">Analisis Sistem</p>
            <p className="text-sm text-text-primary leading-relaxed">
              {result.reason}
            </p>
          </div>
          
          <div className="mt-auto space-y-4">
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs font-bold text-text-secondary uppercase mb-2">
                Tanya Pakar AI (Opsional)
              </label>
              <input 
                type="text" 
                placeholder="Misal: Lahan sering tergenang air..."
                value={contextInput}
                onChange={(e) => setContextInput(e.target.value)}
                className="w-full text-sm p-3 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary bg-gray-50 focus:bg-white transition-colors"
              />
              <button 
                onClick={handleAIAnalysis}
                disabled={aiLoading}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Sparkle size={20} weight="fill" className={aiLoading ? 'animate-pulse text-primary' : 'text-primary group-hover:scale-110 transition-transform'} />
                <span>{aiLoading ? 'Memproses AI...' : 'Dapatkan Insight AI'}</span>
              </button>
            </div>
          </div>
          
          {aiLoading && (
            <div className="mt-6 py-4 animate-fadeIn">
              <OrbitaniLoader status="processing" />
            </div>
          )}

          {(aiResult || aiError) && !aiLoading && (
            <AIExplanationCard data={aiResult} error={aiError} />
          )}
          
        </div>
      )}
      </div>
    </div>
  );
};

export default RecommendationPanel;

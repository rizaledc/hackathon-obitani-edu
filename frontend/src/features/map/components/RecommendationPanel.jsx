import React from 'react';
import OrbitaniLoader from '../../../components/OrbitaniLoader';
import { toIndonesian } from '../../../utils/plantNames';

const RecommendationPanel = ({ location, status, result }) => {
  const isLoading = status !== 'idle' && status !== 'done';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
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
        <div className="flex-1 flex flex-col items-center justify-center">
          <OrbitaniLoader status={status} />
        </div>
      )}

      {status === 'done' && result && (
        <div className="flex-1 flex flex-col animate-fade-in">
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
          
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs font-bold text-text-secondary uppercase mb-2">Analisis AI</p>
            <p className="text-sm text-text-primary leading-relaxed">
              {result.reason}
            </p>
          </div>
          
          <div className="mt-auto pt-6">
            <button 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tanam Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationPanel;

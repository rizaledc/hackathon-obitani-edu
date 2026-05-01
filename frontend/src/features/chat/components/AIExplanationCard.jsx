import React, { useEffect, useRef } from 'react';
import { Sparkle, WarningCircle, Leaf } from '@phosphor-icons/react';

const AIExplanationCard = ({ data, error }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      setTimeout(() => {
        cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [data, error]);

  if (error) {
    return (
      <div ref={cardRef} className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in text-center">
        <p className="text-sm font-medium text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div ref={cardRef} className="mt-6 bg-white border border-gray-200 shadow-sm rounded-xl p-5 animate-fade-in relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-light to-primary"></div>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-primary-pale text-primary rounded-lg">
          <Sparkle size={20} weight="fill" />
        </div>
        <h3 className="font-bold text-text-primary text-md">Pakar AI Insight</h3>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold text-text-secondary uppercase mb-1.5 flex items-center gap-1.5">
            <Sparkle size={14} /> Penjelasan
          </h4>
          <p className="text-sm text-text-primary leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
            {data.explanation}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-orange-600 uppercase mb-1.5 flex items-center gap-1.5">
            <WarningCircle size={14} /> Risiko Lahan
          </h4>
          <p className="text-sm text-text-primary leading-relaxed bg-orange-50 p-3 rounded-lg border border-orange-100">
            {data.risks}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-primary uppercase mb-2 flex items-center gap-1.5">
            <Leaf size={14} /> Alternatif Tanaman
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.alternatives?.map((alt, idx) => (
              <span key={idx} className="px-3 py-1 bg-primary-pale text-primary border border-primary/20 rounded-full text-xs font-bold shadow-sm">
                {alt}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIExplanationCard;

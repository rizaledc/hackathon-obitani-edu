import React from 'react';

const OrbitaniLoader = ({ status = 'sending' }) => {
  // status: "sending" | "processing" | "rendering"
  
  return (
    <div className="flex flex-col items-center justify-center gap-3 my-4">
      <div className="flex gap-2 p-2 bg-gray-100 rounded-full shadow-inner">
        <div 
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            status === 'sending' ? 'bg-red-500 scale-125 shadow-sm' : 'bg-gray-300'
          }`}
        />
        <div 
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            status === 'processing' ? 'bg-yellow-500 scale-125 shadow-sm' : 'bg-gray-300'
          }`}
        />
        <div 
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            status === 'rendering' ? 'bg-green-500 scale-125 shadow-sm' : 'bg-gray-300'
          }`}
        />
      </div>
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
        {status === 'sending' && 'Mengirim Data...'}
        {status === 'processing' && 'Memproses Analisis...'}
        {status === 'rendering' && 'Menyiapkan UI...'}
      </p>
    </div>
  );
};

export default OrbitaniLoader;

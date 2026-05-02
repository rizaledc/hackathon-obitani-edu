import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ message, onConfirm, onCancel, confirmText = 'Konfirmasi', cancelText = 'Batal' }) => {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center text-center animate-scale-up">
        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
          <AlertTriangle className="text-yellow-600" size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Konfirmasi</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 w-full">
          <button 
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

import React from 'react';

export default function PasswordStrength({ password }) {
  if (!password) return null;

  const checks = [
    { label: 'Minimal 8 karakter', valid: password.length >= 8 },
    { label: 'Huruf kapital (A-Z)', valid: /[A-Z]/.test(password) },
    { label: 'Angka (0-9)', valid: /[0-9]/.test(password) },
    { label: 'Huruf kecil (a-z)', valid: /[a-z]/.test(password) },
  ];

  const score = checks.filter(c => c.valid).length;

  const strengthLabel = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'][score];
  const strengthColor = [
    '', 'bg-red-400', 'bg-yellow-400', 
    'bg-blue-400', 'bg-green-500'
  ][score];

  return (
    <div className="mt-2 space-y-2">
      {/* Progress bar */}
      <div className="flex gap-1">
        {[1,2,3,4].map(i => (
          <div key={i} 
            className={`h-1 flex-1 rounded-full transition-all
              ${i <= score ? strengthColor : 'bg-gray-200'}`} 
          />
        ))}
      </div>
      
      {/* Label kekuatan */}
      {score > 0 && (
        <p className={`text-xs font-medium
          ${score <= 1 ? 'text-red-500' : 
            score === 2 ? 'text-yellow-500' :
            score === 3 ? 'text-blue-500' : 'text-green-600'}`}>
          Kekuatan: {strengthLabel}
        </p>
      )}

      {/* Checklist */}
      <div className="space-y-1">
        {checks.map((check, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full flex-shrink-0
              ${check.valid ? 'bg-green-500' : 'bg-red-400'}`} />
            <span className={`text-xs
              ${check.valid ? 'text-green-600' : 'text-red-500'}`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

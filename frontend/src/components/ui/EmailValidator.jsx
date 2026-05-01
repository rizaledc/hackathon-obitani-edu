import React from 'react';

export default function EmailValidator({ email }) {
  if (!email) return null;

  const hasAtSymbol = email.includes('@');
  const hasDomain = hasAtSymbol && email.split('@')[1]?.includes('.');
  const isFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const checks = [
    { label: 'Terdapat simbol "@"', valid: hasAtSymbol },
    { label: 'Terdapat domain (misal: .com, .ac.id)', valid: hasDomain },
    { label: 'Format email lengkap valid', valid: isFormatValid },
  ];

  return (
    <div className="mt-2 space-y-1">
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
  );
}

import React from 'react';

export default function OrbitaniLoader({ status = "processing", size = "md", text = "" }) {
  const dotSize = size === "sm" ? "w-2 h-2" : size === "lg" ? "w-5 h-5" : "w-3 h-3"
  const gap = size === "sm" ? "gap-1.5" : "gap-2"
  
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className={`flex items-center ${gap}`}>
        <div className={`${dotSize} rounded-full animate-pulse bg-red-400`}
          style={{animationDelay: '0ms', animationDuration: '900ms'}} />
        <div className={`${dotSize} rounded-full animate-pulse bg-yellow-400`}
          style={{animationDelay: '300ms', animationDuration: '900ms'}} />
        <div className={`${dotSize} rounded-full animate-pulse bg-green-500`}
          style={{animationDelay: '600ms', animationDuration: '900ms'}} />
      </div>
      {text && (
        <p className="text-xs text-gray-500 font-medium truncate max-w-[200px]">
          {text}
        </p>
      )}
    </div>
  )
}

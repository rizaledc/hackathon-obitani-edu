import React from 'react';

export default function OrbitaniLoader({ status = "processing" }) {
  return (
    <div className="flex items-center justify-center gap-3 p-8">
      <div className={`w-4 h-4 rounded-full animate-pulse
        ${status === "sending" ? "bg-red-500" : "bg-red-200"}`} 
        style={{animationDelay: '0ms'}} />
      <div className={`w-4 h-4 rounded-full animate-pulse
        ${status === "processing" ? "bg-yellow-400" : "bg-yellow-200"}`}
        style={{animationDelay: '300ms'}} />
      <div className={`w-4 h-4 rounded-full animate-pulse
        ${status === "rendering" ? "bg-green-500" : "bg-green-200"}`}
        style={{animationDelay: '600ms'}} />
    </div>
  )
}

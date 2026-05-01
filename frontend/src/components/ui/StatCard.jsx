import React from 'react';

const StatCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-semibold text-text-secondary">{title}</h4>
        {icon && <div className="text-primary bg-primary-pale p-1.5 rounded-lg">{icon}</div>}
      </div>
      <p className={`font-bold text-gray-800 leading-tight
        ${value?.toString().length > 15 
          ? 'text-sm' 
          : value?.toString().length > 10 
            ? 'text-lg' 
            : 'text-2xl'
        }`}>
        {value}
      </p>
      {subtitle && <p className="text-xs text-text-secondary">{subtitle}</p>}
    </div>
  );
};

export default StatCard;

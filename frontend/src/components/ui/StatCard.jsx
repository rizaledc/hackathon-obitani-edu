import React from 'react';

const StatCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-semibold text-text-secondary">{title}</h4>
        {icon && <div className="text-primary bg-primary-pale p-1.5 rounded-lg">{icon}</div>}
      </div>
      <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
      {subtitle && <p className="text-xs text-text-secondary">{subtitle}</p>}
    </div>
  );
};

export default StatCard;

import React from 'react';
import { Brain } from 'lucide-react';

const ConfusionMeter = ({ confusionLevel, onLevelChange }) => {
  const confusionLevels = [
    { level: 0, emoji: '😊', label: 'Clear', color: 'bg-green-100 text-green-700 border-green-300' },
    { level: 1, emoji: '😐', label: 'Slight confusion', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { level: 2, emoji: '😕', label: 'Confused', color: 'bg-orange-100 text-orange-700 border-orange-300' },
    { level: 3, emoji: '😵', label: 'Totally lost', color: 'bg-red-100 text-red-700 border-red-300' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-indigo-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-indigo-600" />
        How are you feeling?
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {confusionLevels.map((item) => (
          <button
            key={item.level}
            onClick={() => onLevelChange(item.level)}
            className={`p-4 rounded-lg border-2 transition-all ${
              confusionLevel === item.level
                ? `border-indigo-500 scale-105 ${item.color}`
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <div className="text-3xl mb-2">{item.emoji}</div>
            <div className="text-xs font-medium text-gray-700">{item.label}</div>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center">
        Your teacher will see class-wide confusion levels anonymously
      </p>
    </div>
  );
};

export default ConfusionMeter;

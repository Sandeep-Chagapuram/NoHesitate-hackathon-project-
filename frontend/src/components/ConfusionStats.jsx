import React from 'react';
import { TrendingUp, AlertTriangle, Pause } from 'lucide-react';

const ConfusionStats = ({ stats, threshold = 60 }) => {
  if (!stats || stats.total === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-indigo-100">
        <p className="text-gray-500 text-center">No confusion data yet</p>
      </div>
    );
  }

  const confusionPercentage = Math.round(
    ((stats.confused + stats.lost) / stats.total) * 100
  );
  const shouldPause = confusionPercentage >= threshold;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-indigo-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Class Confusion Level
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">😐 Slight confusion</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 transition-all duration-300" 
                  style={{ width: `${(stats.slight / stats.total) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium w-8 text-right">{stats.slight}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">😕 Confused</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-400 transition-all duration-300" 
                  style={{ width: `${(stats.confused / stats.total) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium w-8 text-right">{stats.confused}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">😵 Totally lost</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-300" 
                  style={{ width: `${(stats.lost / stats.total) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium w-8 text-right">{stats.lost}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
          <p className="text-sm font-medium text-indigo-900">
            {confusionPercentage}% students need clarification
          </p>
        </div>
      </div>

      {shouldPause && (
        <div className="bg-red-50 rounded-lg shadow-sm p-6 border-2 border-red-300">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-red-900 mb-2">
                🚨 Pause Recommended
              </h2>
              <p className="text-sm text-red-800 mb-4">
                {confusionPercentage}% of students are confused. Consider pausing to address doubts.
              </p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
                <Pause className="w-4 h-4" />
                Take a Pause
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfusionStats;

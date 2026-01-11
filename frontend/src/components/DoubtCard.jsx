import React from 'react';
import { Clock, Users, CheckCircle, ThumbsUp } from 'lucide-react';

const DoubtCard = ({ doubt, onMarkAnswered, onUpvote, currentStudentId, isTeacher }) => {
  const isUpvoted = doubt.upvotedBy?.includes(currentStudentId);

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all ${
        doubt.isAnswered
          ? 'bg-green-50 border-green-200'
          : doubt.mergedCount >= 10
          ? 'bg-red-50 border-red-300'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {doubt.mergedCount >= 10 && (
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1">
                🔥 {doubt.mergedCount} students
              </span>
            )}
            {doubt.mergedCount < 10 && doubt.mergedCount > 1 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {doubt.mergedCount} merged
              </span>
            )}
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              {doubt.topic}
            </span>
          </div>
          
          <p className="text-gray-900 font-medium mb-2">{doubt.question}</p>
          
          {doubt.answer && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700"><strong>Answer:</strong> {doubt.answer}</p>
            </div>
          )}
          
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(doubt.createdAt).toLocaleTimeString()}
            </span>
            {doubt.mergedStudents && doubt.mergedStudents.length > 0 && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {doubt.mergedStudents.slice(0, 2).map(s => s.studentName).join(', ')}
                {doubt.mergedStudents.length > 2 && ` +${doubt.mergedStudents.length - 2} more`}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          {isTeacher && !doubt.isAnswered && (
            <button
              onClick={() => onMarkAnswered(doubt._id)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium whitespace-nowrap"
            >
              Mark Answered
            </button>
          )}
          
          {doubt.isAnswered && (
            <span className="flex items-center gap-1 text-green-700 text-sm">
              <CheckCircle className="w-4 h-4" />
              Answered
            </span>
          )}
          
          {!isTeacher && (
            <button
              onClick={() => onUpvote(doubt._id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-all ${
                isUpvoted
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              {doubt.upvotes || 0}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoubtCard;

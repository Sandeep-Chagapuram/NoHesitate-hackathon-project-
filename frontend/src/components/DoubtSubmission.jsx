import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

const DoubtSubmission = ({ onSubmit, isLoading }) => {
  const [question, setQuestion] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    
    await onSubmit({
      question: question.trim(),
      isAnonymous
    });

    setQuestion('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-indigo-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Ask a Question</h2>
      
      <div className="space-y-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your doubt here... (e.g., Why does useState cause re-renders?)"
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          rows="4"
          disabled={isLoading}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              disabled={isLoading}
            />
            <span className="text-sm text-gray-700">🔒 Submit anonymously</span>
          </label>

          <button
            onClick={handleSubmit}
            disabled={!question.trim() || isLoading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            {submitted ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Submitted!
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {isLoading ? 'Submitting...' : 'Submit'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoubtSubmission;

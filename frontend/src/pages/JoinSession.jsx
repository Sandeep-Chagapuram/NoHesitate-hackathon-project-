import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn } from 'lucide-react';

const JoinSession = () => {
  const navigate = useNavigate();
  const [sessionCode, setSessionCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Normalize session code to uppercase
      const normalizedCode = sessionCode.toUpperCase().trim();
      
      // Store student info in sessionStorage
      sessionStorage.setItem('studentName', studentName);
      sessionStorage.setItem('studentId', `student_${Date.now()}`);
      
      // Navigate to student dashboard with uppercase code
      navigate(`/student/${normalizedCode}`);
    } catch (error) {
      console.error('Error joining session:', error);
      alert('Failed to join session. Please check the session code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Session</h1>
          <p className="text-gray-600 mb-8">Enter the session code provided by your teacher</p>

          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Aradhya"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Code *
              </label>
              <input
                type="text"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl font-mono tracking-wider"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Ask your teacher for the session code
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {loading ? 'Joining...' : 'Join Session'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm text-indigo-800">
              <strong>💡 Tip:</strong> You can ask questions anonymously to maintain privacy and overcome hesitation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinSession;

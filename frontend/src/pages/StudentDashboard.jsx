import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { SessionProvider, useSession } from '../contexts/SessionContext';
import ConfusionMeter from '../components/ConfusionMeter';
import DoubtSubmission from '../components/DoubtSubmission';
import DoubtCard from '../components/DoubtCard';
import apiService from '../services/api.service';

const StudentDashboardContent = () => {
  const navigate = useNavigate();
  const { session, doubts, loading } = useSession();
  const [confusionLevel, setConfusionLevel] = useState(0);
  const [studentName] = useState(sessionStorage.getItem('studentName') || 'Anonymous');
  const [studentId] = useState(sessionStorage.getItem('studentId') || `student_${Date.now()}`);
  const [myDoubts, setMyDoubts] = useState([]);

  const handleConfusionChange = async (level) => {
    setConfusionLevel(level);
    try {
      await apiService.submitConfusion({
        sessionId: session._id,
        studentId,
        studentName,
        level
      });
    } catch (error) {
      console.error('Error submitting confusion:', error);
    }
  };

  const handleSubmitDoubt = async ({ question, isAnonymous }) => {
    try {
      const response = await apiService.submitDoubt({
        sessionId: session._id,
        question,
        studentId,
        studentName: isAnonymous ? 'Anonymous' : studentName,
        isAnonymous,
        confusionLevel
      });

      if (!response.merged) {
        setMyDoubts([response.doubt, ...myDoubts]);
      }
    } catch (error) {
      console.error('Error submitting doubt:', error);
      alert('Failed to submit doubt. Please try again.');
    }
  };

  const handleUpvote = async (doubtId) => {
    try {
      await apiService.upvoteDoubt(doubtId, studentId);
    } catch (error) {
      console.error('Error upvoting doubt:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Session not found</p>
          <button
            onClick={() => navigate('/join')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Another Code
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Leave Session
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-indigo-100">
          <h1 className="text-2xl font-bold text-indigo-900">{session.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>Teacher: {session.teacherName}</span>
            <span>•</span>
            <span>{session.subject}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(session.startTime).toLocaleTimeString()}
            </span>
          </div>
          <div className="mt-3 px-3 py-2 bg-green-50 text-green-700 rounded-lg inline-block text-sm">
            Welcome, {studentName}! 👋
          </div>
        </div>

        {/* Confusion Meter */}
        <ConfusionMeter 
          confusionLevel={confusionLevel}
          onLevelChange={handleConfusionChange}
        />

        {/* Doubt Submission */}
        <DoubtSubmission onSubmit={handleSubmitDoubt} />

        {/* My Questions */}
        {myDoubts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-indigo-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">My Questions</h2>
            <div className="space-y-3">
              {myDoubts.map(doubt => (
                <DoubtCard
                  key={doubt._id}
                  doubt={doubt}
                  currentStudentId={studentId}
                  onUpvote={handleUpvote}
                  isTeacher={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Questions */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-indigo-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Class Questions ({doubts.length})
          </h2>
          {doubts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No questions yet. Be the first to ask!
            </p>
          ) : (
            <div className="space-y-3">
              {doubts.slice(0, 10).map(doubt => (
                <DoubtCard
                  key={doubt._id}
                  doubt={doubt}
                  currentStudentId={studentId}
                  onUpvote={handleUpvote}
                  isTeacher={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const { sessionId } = useParams();

  return (
    <SessionProvider sessionId={sessionId}>
      <StudentDashboardContent />
    </SessionProvider>
  );
};

export default StudentDashboard;

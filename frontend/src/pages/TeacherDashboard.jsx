import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Copy, CheckCircle, BarChart3 } from 'lucide-react';
import { SessionProvider, useSession } from '../contexts/SessionContext';
import ConfusionStats from '../components/ConfusionStats';
import DoubtCard from '../components/DoubtCard';
import apiService from '../services/api.service';

const TeacherDashboardContent = () => {
  const navigate = useNavigate();
  const { session, doubts, confusionStats, loading, error } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTopic, setFilterTopic] = useState('all');
  const [showAnswered, setShowAnswered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleMarkAnswered = async (doubtId) => {
    try {
      await apiService.markAnswered(doubtId);
    } catch (error) {
      console.error('Error marking doubt as answered:', error);
    }
  };

  const copySessionCode = () => {
    if (session) {
      const code = session._id.slice(-6).toUpperCase();
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <p className="text-red-600 mb-4">
            {error || 'Session not found'}
          </p>
          <button
            onClick={() => navigate('/setup')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Create New Session
          </button>
        </div>
      </div>
    );
  }

  const filteredDoubts = doubts.filter(d => {
    const matchesSearch = d.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = filterTopic === 'all' || d.topic === filterTopic;
    const matchesAnswered = showAnswered ? true : !d.isAnswered;
    return matchesSearch && matchesTopic && matchesAnswered;
  });

  const topics = ['all', ...new Set(doubts.map(d => d.topic))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="w-5 h-5" />
            End Session
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-indigo-100">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">{session.title}</h1>
          <p className="text-gray-600 mb-4">{session.subject} • Teacher: {session.teacherName}</p>
          
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-indigo-50 rounded-lg font-mono text-indigo-900">
              Session Code: {session._id.slice(-6).toUpperCase()}
            </div>
            <button
              onClick={copySessionCode}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{doubts.length}</div>
              <div className="text-sm text-blue-700">Total Questions</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">
                {doubts.filter(d => d.isAnswered).length}
              </div>
              <div className="text-sm text-green-700">Answered</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-900">
                {doubts.filter(d => !d.isAnswered).length}
              </div>
              <div className="text-sm text-orange-700">Pending</div>
            </div>
          </div>
        </div>

        {/* Confusion Stats */}
        <ConfusionStats 
          stats={confusionStats} 
          threshold={session.settings?.confusionThreshold || 60} 
        />

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-indigo-100 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {topics.map(topic => (
                <option key={topic} value={topic}>
                  {topic === 'all' ? 'All Topics' : topic}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAnswered}
                onChange={(e) => setShowAnswered(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-sm text-gray-700">Show answered</span>
            </label>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-indigo-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Live Questions ({filteredDoubts.length})
          </h2>

          {filteredDoubts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {doubts.length === 0 ? 'No questions yet. Share the session code with students!' : 'No questions match your filters'}
            </p>
          ) : (
            <div className="space-y-3">
              {filteredDoubts.map(doubt => (
                <DoubtCard
                  key={doubt._id}
                  doubt={doubt}
                  onMarkAnswered={handleMarkAnswered}
                  isTeacher={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
  const { sessionId } = useParams();

  return (
    <SessionProvider sessionId={sessionId}>
      <TeacherDashboardContent />
    </SessionProvider>
  );
};

export default TeacherDashboard;
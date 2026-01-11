import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import apiService from '../services/api.service';

const SessionSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    teacherName: '',
    subject: '',
    confusionThreshold: 60,
    allowAnonymous: true,
    autoMergeDoubts: true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sessionData = {
        ...formData,
        teacherId: `teacher_${Date.now()}`, // In production, use actual auth
        settings: {
          allowAnonymous: formData.allowAnonymous,
          confusionThreshold: formData.confusionThreshold,
          autoMergeDoubts: formData.autoMergeDoubts
        }
      };

      const response = await apiService.createSession(sessionData);
      navigate(`/teacher/${response.session._id}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Session</h1>
          <p className="text-gray-600 mb-8">Set up your classroom session and start monitoring doubts in real-time</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., React Fundamentals - Day 3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="teacherName"
                  value={formData.teacherName}
                  onChange={handleChange}
                  placeholder="Krishna Kumar"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="React.js"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confusion Threshold: {formData.confusionThreshold}%
              </label>
              <input
                type="range"
                name="confusionThreshold"
                min="30"
                max="90"
                step="10"
                value={formData.confusionThreshold}
                onChange={handleChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                You'll get an alert when this percentage of students are confused
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="allowAnonymous"
                  checked={formData.allowAnonymous}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">
                  Allow anonymous questions (Recommended for higher participation)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="autoMergeDoubts"
                  checked={formData.autoMergeDoubts}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">
                  Auto-merge similar questions (Save time answering duplicates)
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {loading ? 'Creating Session...' : 'Create Session'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SessionSetup;

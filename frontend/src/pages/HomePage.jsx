import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, MessageCircle, Brain, Zap } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center text-white mb-16">
          <h1 className="text-6xl font-bold mb-6 flex items-center justify-center gap-4">
            <MessageCircle className="w-16 h-16" />
            QuestionFlow
          </h1>
          <p className="text-2xl mb-4">Ask Without Hesitation. Learn Without Limits.</p>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            A real-time platform where students ask freely and teachers understand instantly
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Silent Confusion Meter</h3>
            <p className="text-gray-600">
              Tap emoji buttons to signal confusion. No typing needed. Teachers see real-time class understanding.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Auto Question Merging</h3>
            <p className="text-gray-600">
              AI merges similar questions. Teacher answers once, clears 10+ doubts. Save time, help everyone.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Anonymous Mode</h3>
            <p className="text-gray-600">
              Ask anonymously without fear. Build confidence while getting answers to every doubt.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/setup')}
            className="w-full md:w-auto px-12 py-5 bg-white text-indigo-600 rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3"
          >
            <Users className="w-6 h-6" />
            I'm a Teacher
          </button>
          
          <button
            onClick={() => navigate('/join')}
            className="w-full md:w-auto px-12 py-5 bg-indigo-900 text-white rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3"
          >
            <GraduationCap className="w-6 h-6" />
            I'm a Student
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center text-white">
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-lg opacity-90">Higher Participation</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">3x</div>
              <div className="text-lg opacity-90">Faster Doubt Clearing</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-lg opacity-90">Anonymous Safety</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

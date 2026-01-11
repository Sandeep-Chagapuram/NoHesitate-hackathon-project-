import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api.service';
import socketService from '../services/socket.service';

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children, sessionId }) => {
  const [session, setSession] = useState(null);
  const [doubts, setDoubts] = useState([]);
  const [confusionStats, setConfusionStats] = useState({
    clear: 0,
    slight: 0,
    confused: 0,
    lost: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sessionId) {
      initializeSession();
      setupRealtimeListeners();
    }

    return () => {
      socketService.disconnect();
    };
  }, [sessionId]);

  const initializeSession = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load session data
      const sessionData = await apiService.getSession(sessionId);
      setSession(sessionData.session);

      // Load doubts
      try {
        const doubtsData = await apiService.getDoubts(sessionId);
        setDoubts(doubtsData.doubts || []);
      } catch (err) {
        console.error('Error loading doubts:', err);
        setDoubts([]);
      }

      // Load confusion stats
      try {
        const statsData = await apiService.getConfusionStats(sessionId);
        setConfusionStats(statsData.stats || {
          clear: 0,
          slight: 0,
          confused: 0,
          lost: 0,
          total: 0
        });
      } catch (err) {
        console.error('Error loading stats:', err);
        setConfusionStats({
          clear: 0,
          slight: 0,
          confused: 0,
          lost: 0,
          total: 0
        });
      }
      
      // Setup real-time connection
      socketService.connect();
      socketService.joinSession(sessionId);

    } catch (err) {
      console.error('Session initialization error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeListeners = () => {
    socketService.on('new-doubt', (doubt) => {
      setDoubts(prev => [doubt, ...prev]);
    });

    socketService.on('doubt-merged', ({ doubt }) => {
      setDoubts(prev => prev.map(d => 
        d._id === doubt._id ? doubt : d
      ));
    });

    socketService.on('doubt-answered', (doubt) => {
      setDoubts(prev => prev.map(d => 
        d._id === doubt._id ? doubt : d
      ));
    });

    socketService.on('confusion-updated', (stats) => {
      setConfusionStats(stats);
    });
  };

  const value = {
    session,
    doubts,
    confusionStats,
    loading,
    error,
    refreshDoubts: () => initializeSession()
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;


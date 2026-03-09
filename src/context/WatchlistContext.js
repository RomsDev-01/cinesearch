import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WatchlistContext = createContext(null);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('cinesearch_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cinesearch_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = useCallback((movie) => {
    setWatchlist(prev => {
      if (prev.find(m => m.id === movie.id)) return prev;
      return [{ ...movie, addedAt: Date.now() }, ...prev];
    });
  }, []);

  const removeFromWatchlist = useCallback((movieId) => {
    setWatchlist(prev => prev.filter(m => m.id !== movieId));
  }, []);

  const toggleWatchlist = useCallback((movie) => {
    setWatchlist(prev => {
      const exists = prev.find(m => m.id === movie.id);
      if (exists) return prev.filter(m => m.id !== movie.id);
      return [{ ...movie, addedAt: Date.now() }, ...prev];
    });
  }, []);

  const isInWatchlist = useCallback((movieId) => {
    return watchlist.some(m => m.id === movieId);
  }, [watchlist]);

  const clearWatchlist = useCallback(() => setWatchlist([]), []);

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      toggleWatchlist,
      isInWatchlist,
      clearWatchlist,
      count: watchlist.length,
    }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider');
  return ctx;
};

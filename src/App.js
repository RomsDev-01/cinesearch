import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalStyle } from './styles/GlobalStyle';
import { WatchlistProvider } from './context/WatchlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const Search = lazy(() => import('./pages/Search'));
const Browse = lazy(() => import('./pages/Browse'));
const Genres = lazy(() => import('./pages/Genres'));
const TopRated = lazy(() => import('./pages/TopRated'));
const Watchlist = lazy(() => import('./pages/Watchlist'));

const Loader = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexDirection: 'column', gap: '0.75rem'
  }}>
    <div style={{
      fontFamily: 'var(--font-display)', fontSize: '1.5rem',
      letterSpacing: '0.12em', color: 'var(--accent)'
    }}>
      CINESEARCH
    </div>
    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
      LOADING...
    </div>
  </div>
);

function App() {
  return (
    <WatchlistProvider>
      <BrowserRouter>
        <GlobalStyle />
        <Navbar />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/genres/:id" element={<Genres />} />
            <Route path="/top-rated" element={<TopRated />} />
            <Route path="/watchlist" element={<Watchlist />} />
          </Routes>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </WatchlistProvider>
  );
}

export default App;

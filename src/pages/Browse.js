import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { MovieGrid, LoadingGrid } from '../components/MovieGrid';
import { getNowPlaying, getPopular, getUpcoming } from '../utils/tmdb';

const TABS = [
  { id: 'now_playing', label: 'Now Playing', fn: getNowPlaying },
  { id: 'popular', label: 'Popular', fn: getPopular },
  { id: 'upcoming', label: 'Upcoming', fn: getUpcoming },
];

const Page = styled.main`
  padding: calc(64px + 3rem) 2rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: 2rem;
  letter-spacing: 0.06em;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
`;

const TabBar = styled.div`
  display: flex;
  gap: 0.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.25rem;
  width: fit-content;
`;

const Tab = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 3px;
  font-size: 0.8rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${({ $active }) => $active ? 'var(--bg)' : 'var(--text-secondary)'};
  background: ${({ $active }) => $active ? 'var(--accent)' : 'none'};
  font-weight: ${({ $active }) => $active ? '500' : '400'};
  transition: all 0.2s;

  &:hover:not([data-active="true"]) {
    color: var(--text-primary);
  }
`;

const LoadMore = styled.button`
  display: block;
  margin: 2.5rem auto 0;
  padding: 0.75rem 2.5rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-primary);
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: border-color 0.2s, background 0.2s;

  &:hover {
    border-color: var(--accent);
    background: var(--accent-dim);
    color: var(--accent);
  }

  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'now_playing';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const tabConfig = TABS.find(t => t.id === activeTab) || TABS[0];

  const load = useCallback(async (p, reset = false) => {
    setLoading(true);
    try {
      const data = await tabConfig.fn(p);
      setMovies(prev => reset ? data.results : [...prev, ...data.results]);
      setTotalPages(data.total_pages);
      setPage(p);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [tabConfig]);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    load(1, true);
  }, [activeTab, load]);

  const handleTab = (id) => {
    setActiveTab(id);
    setSearchParams({ tab: id });
  };

  return (
    <Page>
      <Header>
        <Title>Browse Films</Title>
        <TabBar>
          {TABS.map(t => (
            <Tab
              key={t.id}
              $active={activeTab === t.id}
              onClick={() => handleTab(t.id)}
            >
              {t.label}
            </Tab>
          ))}
        </TabBar>
      </Header>

      {loading && movies.length === 0 ? (
        <LoadingGrid count={20} />
      ) : (
        <>
          <MovieGrid movies={movies} />
          {page < totalPages && (
            <LoadMore
              onClick={() => load(page + 1)}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </LoadMore>
          )}
        </>
      )}
    </Page>
  );
};

export default Browse;

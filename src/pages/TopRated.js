import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { MovieGrid, LoadingGrid } from '../components/MovieGrid';
import { getTopRated } from '../utils/tmdb';

const Page = styled.main`
  padding: calc(64px + 3rem) 2rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: 2rem;
  letter-spacing: 0.06em;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const Sub = styled.p`
  font-size: 0.82rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 2rem;
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
  &:hover { border-color: var(--accent); background: var(--accent-dim); color: var(--accent); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const TopRated = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (p, reset = false) => {
    setLoading(true);
    try {
      const data = await getTopRated(p);
      setMovies(prev => reset ? data.results : [...prev, ...data.results]);
      setTotalPages(data.total_pages);
      setPage(p);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(1, true); }, [load]);

  return (
    <Page>
      <Title>Top Rated Films</Title>
      <Sub>All-time highest rated · TMDB community scores</Sub>
      {loading && movies.length === 0 ? <LoadingGrid count={20} /> : (
        <>
          <MovieGrid movies={movies} />
          {page < totalPages && (
            <LoadMore onClick={() => load(page + 1)} disabled={loading}>
              {loading ? 'Loading...' : 'Load More'}
            </LoadMore>
          )}
        </>
      )}
    </Page>
  );
};

export default TopRated;

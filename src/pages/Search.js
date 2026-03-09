import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { MovieGrid, LoadingGrid } from '../components/MovieGrid';
import { useDebounce } from '../hooks';
import { searchMovies } from '../utils/tmdb';

const Page = styled.main`
  padding: calc(64px + 3rem) 2rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 2.5rem;
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: 2rem;
  letter-spacing: 0.06em;
  color: var(--text-primary);
  margin-bottom: 1.25rem;
`;

const SearchBarLarge = styled.div`
  display: flex;
  align-items: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 0 1.25rem;
  gap: 0.75rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-dim);
  }

  svg {
    color: var(--text-muted);
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 1.1rem;
  width: 100%;
  padding: 1rem 0;

  &::placeholder {
    color: var(--text-muted);
  }
`;

const ResultsInfo = styled.p`
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  letter-spacing: 0.03em;

  strong { color: var(--text-secondary); }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 5rem 0;
  color: var(--text-muted);

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.3;
  }

  h2 {
    font-family: var(--font-display);
    font-size: 1.5rem;
    letter-spacing: 0.06em;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
  }

  p { font-size: 0.85rem; }
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

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const debouncedQ = useDebounce(query, 450);

  const doSearch = useCallback(async (q, p = 1, append = false) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const data = await searchMovies(q, p);
      setResults(prev => append ? [...prev, ...data.results] : data.results);
      setTotalPages(data.total_pages);
      setTotalResults(data.total_results);
      setPage(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    doSearch(debouncedQ, 1);
    if (debouncedQ) setSearchParams({ q: debouncedQ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  useEffect(() => {
    if (initialQ) doSearch(initialQ, 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page>
      <Header>
        <Title>Search Films</Title>
        <SearchBarLarge>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <SearchInput
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by title, director, actor..."
            autoFocus
          />
        </SearchBarLarge>
      </Header>

      {query && !loading && results.length > 0 && (
        <ResultsInfo>
          Showing <strong>{results.length}</strong> of <strong>{totalResults.toLocaleString()}</strong> results for "<strong>{query}</strong>"
        </ResultsInfo>
      )}

      {loading && results.length === 0 ? (
        <LoadingGrid count={12} />
      ) : results.length > 0 ? (
        <>
          <MovieGrid movies={results} />
          {page < totalPages && (
            <LoadMore
              onClick={() => doSearch(debouncedQ, page + 1, true)}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </LoadMore>
          )}
        </>
      ) : query && !loading ? (
        <EmptyState>
          <div className="icon">🎬</div>
          <h2>No Results Found</h2>
          <p>Try different keywords or check your spelling.</p>
        </EmptyState>
      ) : !query ? (
        <EmptyState>
          <div className="icon">🔍</div>
          <h2>Start Searching</h2>
          <p>Enter a movie title above to find films.</p>
        </EmptyState>
      ) : null}
    </Page>
  );
};

export default Search;

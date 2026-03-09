import { useParams, useNavigate, Link } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { MovieGrid, LoadingGrid } from '../components/MovieGrid';
import { useFetch } from '../hooks';
import { getGenres, discoverByGenre } from '../utils/tmdb';

const GENRE_COLORS = {
  28: '#e85444', 12: '#44c87a', 16: '#4488e8', 35: '#e8c547',
  80: '#9966cc', 18: '#e87844', 14: '#44d4e8', 27: '#cc3344',
  9648: '#7744cc', 10749: '#e85494', 878: '#44aae8', 53: '#e84488',
  10752: '#886644', 37: '#cc7744',
};

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
  margin-bottom: 1.5rem;
`;

const GenreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
`;

const GenreCard = styled(Link)`
  padding: 1rem 1.25rem;
  border-radius: var(--radius);
  border: 1px solid ${({ $active, $color }) => $active ? $color : 'var(--border)'};
  background: ${({ $active, $color }) => $active ? `${$color}20` : 'var(--bg-card)'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    border-color: ${({ $color }) => $color || 'rgba(255,255,255,0.2)'};
    background: ${({ $color }) => $color ? `${$color}15` : 'var(--bg-elevated)'};
    transform: translateY(-2px);
  }
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color || 'var(--text-muted)'};
  flex-shrink: 0;
`;

const GenreName = styled.span`
  font-size: 0.8rem;
  font-weight: ${({ $active }) => $active ? '500' : '400'};
  color: ${({ $active, $color }) => $active ? $color : 'var(--text-secondary)'};
  letter-spacing: 0.03em;
  transition: color 0.2s;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--border);
  margin: 2.5rem 0;
`;

const GenreTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 1.6rem;
  letter-spacing: 0.06em;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::before {
    content: '';
    width: 4px;
    height: 1.2em;
    background: ${({ $color }) => $color || 'var(--accent)'};
    border-radius: 2px;
  }
`;

const SortBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const SortBtn = styled.button`
  padding: 0.4rem 0.9rem;
  border-radius: var(--radius);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ $active }) => $active ? 'var(--accent)' : 'var(--text-muted)'};
  background: ${({ $active }) => $active ? 'var(--accent-dim)' : 'none'};
  border: 1px solid ${({ $active }) => $active ? 'rgba(232,197,71,0.2)' : 'var(--border)'};
  transition: all 0.2s;

  &:hover { color: var(--text-primary); border-color: var(--border); background: var(--bg-elevated); }
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

const SORTS = [
  { id: 'popularity.desc', label: 'Popular' },
  { id: 'vote_average.desc', label: 'Top Rated' },
  { id: 'release_date.desc', label: 'Newest' },
];

const Genres = () => {
  const { id: genreIdParam } = useParams();
  const navigate = useNavigate();
  const { data: genresData } = useFetch(() => getGenres(), []);
  const genres = genresData?.genres || [];

  const [selectedId, setSelectedId] = useState(genreIdParam ? Number(genreIdParam) : null);
  const [sort, setSort] = useState('popularity.desc');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMovies = useCallback(async (gId, sortBy, p, reset = false) => {
    if (!gId) return;
    setLoading(true);
    try {
      const data = await discoverByGenre(gId, p, sortBy);
      setMovies(prev => reset ? data.results : [...prev, ...data.results]);
      setTotalPages(data.total_pages);
      setPage(p);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (genreIdParam) {
      const gId = Number(genreIdParam);
      setSelectedId(gId);
      setMovies([]);
      loadMovies(gId, sort, 1, true);
    }
  }, [genreIdParam, loadMovies, sort]);

  const handleSort = (s) => {
    setSort(s);
    setMovies([]);
    loadMovies(selectedId, s, 1, true);
  };

  const selectedGenre = genres.find(g => g.id === selectedId);
  const color = selectedId ? (GENRE_COLORS[selectedId] || 'var(--accent)') : null;

  return (
    <Page>
      <Header>
        <Title>Browse by Genre</Title>
        <GenreGrid>
          {genres.map(g => {
            const c = GENRE_COLORS[g.id] || 'var(--text-secondary)';
            return (
              <GenreCard
                key={g.id}
                to={`/genres/${g.id}`}
                $active={g.id === selectedId}
                $color={c}
              >
                <Dot $color={c} />
                <GenreName $active={g.id === selectedId} $color={c}>{g.name}</GenreName>
              </GenreCard>
            );
          })}
        </GenreGrid>
      </Header>

      {selectedGenre && (
        <>
          <Divider />
          <GenreTitle $color={color}>{selectedGenre.name}</GenreTitle>
          <SortBar>
            {SORTS.map(s => (
              <SortBtn key={s.id} $active={sort === s.id} onClick={() => handleSort(s.id)}>
                {s.label}
              </SortBtn>
            ))}
          </SortBar>
          {loading && movies.length === 0 ? (
            <LoadingGrid count={20} />
          ) : (
            <>
              <MovieGrid movies={movies} />
              {page < totalPages && (
                <LoadMore onClick={() => loadMovies(selectedId, sort, page + 1)} disabled={loading}>
                  {loading ? 'Loading...' : 'Load More'}
                </LoadMore>
              )}
            </>
          )}
        </>
      )}
    </Page>
  );
};

export default Genres;

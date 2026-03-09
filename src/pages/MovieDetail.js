import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useFetch } from '../hooks';
import { useWatchlist } from '../context/WatchlistContext';
import {
  getMovieDetails, BACKDROP_SIZES, POSTER_SIZES,
  formatRuntime, formatDate, getRatingColor, getCertification
} from '../utils/tmdb';
import MovieCard from '../components/MovieCard';

const fadeIn = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}`;

const Page = styled.main`
  min-height: 100vh;
  padding-bottom: 5rem;
`;

const BackdropWrap = styled.div`
  position: relative;
  height: 55vh;
  min-height: 360px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 20%;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to bottom, transparent 30%, var(--bg) 100%),
      linear-gradient(to right, var(--bg) 0%, transparent 40%);
  }
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  animation: ${fadeIn} 0.5s ease;
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 3rem;
  margin-top: -12rem;
  position: relative;
  z-index: 2;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    margin-top: -6rem;
  }
`;

const Poster = styled.div`
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  flex-shrink: 0;

  img { width: 100%; display: block; }
`;

const Info = styled.div`
  padding-top: 12rem;

  @media (max-width: 768px) {
    padding-top: 1rem;
  }
`;

const Cert = styled.span`
  display: inline-block;
  border: 1px solid var(--border);
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  border-radius: 2px;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  letter-spacing: 0.04em;
  line-height: 1.05;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const Tagline = styled.p`
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--text-muted);
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  margin-bottom: 1.25rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

const RatingCircle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.5rem;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
  color: ${({ $c }) => $c};

  small {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-family: var(--font-body);
    letter-spacing: 0;
  }
`;

const Genres = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.5rem;
`;

const GenreTag = styled(Link)`
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.3rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 2px;
  color: var(--text-secondary);
  transition: border-color 0.2s, color 0.2s;

  &:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
`;

const Overview = styled.p`
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  max-width: 680px;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
`;

const BtnPrimary = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${({ $active }) => $active ? 'var(--accent-dim)' : 'var(--accent)'};
  color: ${({ $active }) => $active ? 'var(--accent)' : 'var(--bg)'};
  border: 1px solid ${({ $active }) => $active ? 'rgba(232,197,71,0.3)' : 'var(--accent)'};
  border-radius: var(--radius);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: all 0.2s;

  &:hover { opacity: 0.85; transform: translateY(-1px); }
  svg { width: 16px; height: 16px; fill: ${({ $active }) => $active ? 'currentColor' : 'none'}; }
`;

const FactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 1rem;
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
`;

const Fact = styled.div``;
const FactLabel = styled.p`
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.3rem;
`;
const FactValue = styled.p`
  font-size: 0.85rem;
  color: var(--text-primary);
  font-weight: 400;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 1.4rem;
  letter-spacing: 0.06em;
  color: var(--text-primary);
  margin-bottom: 1.25rem;
`;

const CastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
`;

const CastCard = styled(Link)`
  text-align: center;

  &:hover .cast-name { color: var(--accent); }
`;

const CastPhoto = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 0.5rem;
  background: var(--bg-elevated);
  border: 2px solid var(--border);

  img { width: 100%; height: 100%; object-fit: cover; }
`;

const CastInitials = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-family: var(--font-display);
  letter-spacing: 0.05em;
  color: var(--text-muted);
`;

const CastName = styled.p`
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--text-primary);
  transition: color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CastChar = styled.p`
  font-size: 0.7rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrailerBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.82rem;
  font-weight: 400;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-secondary);
  transition: all 0.2s;
  margin-bottom: 2.5rem;

  &:hover {
    background: rgba(255,0,0,0.12);
    border-color: rgba(255,80,80,0.3);
    color: #ff6b6b;
  }

  svg { width: 16px; height: 16px; }
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.25rem;
`;

const IMG = 'https://image.tmdb.org/t/p';

const MovieDetail = () => {
  const { id } = useParams();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const { data: movie, loading, error } = useFetch(() => getMovieDetails(id), [id]);

  if (loading) return (
    <Page style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: '0.5rem' }}>LOADING</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Fetching film data...</div>
      </div>
    </Page>
  );

  if (error || !movie) return (
    <Page style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--red)', marginBottom: '0.5rem' }}>NOT FOUND</div>
        <Link to="/" style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>← Back to Home</Link>
      </div>
    </Page>
  );

  const inList = isInWatchlist(movie.id);
  const cert = getCertification(movie.release_dates);
  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const similar = [...(movie.recommendations?.results || []), ...(movie.similar?.results || [])].slice(0, 12);

  return (
    <Page>
      {movie.backdrop_path && (
        <BackdropWrap>
          <img src={`${BACKDROP_SIZES.lg}${movie.backdrop_path}`} alt={movie.title} />
        </BackdropWrap>
      )}

      <Content>
        <MainLayout>
          <div>
            {movie.poster_path ? (
              <Poster>
                <img src={`${POSTER_SIZES.lg}${movie.poster_path}`} alt={movie.title} />
              </Poster>
            ) : null}
          </div>

          <Info>
            {cert && <Cert>{cert}</Cert>}
            <Title>{movie.title}</Title>
            {movie.tagline && <Tagline>"{movie.tagline}"</Tagline>}

            <MetaRow>
              <RatingCircle $c={getRatingColor(movie.vote_average)}>
                ★ {movie.vote_average?.toFixed(1)}
                <small>/ 10 ({movie.vote_count?.toLocaleString()} votes)</small>
              </RatingCircle>
            </MetaRow>

            {movie.genres?.length > 0 && (
              <Genres>
                {movie.genres.map(g => (
                  <GenreTag key={g.id} to={`/genres/${g.id}`}>{g.name}</GenreTag>
                ))}
              </Genres>
            )}

            <Overview>{movie.overview || 'No description available.'}</Overview>

            <Actions>
              <BtnPrimary $active={inList} onClick={() => toggleWatchlist(movie)}>
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                {inList ? 'In Watchlist' : 'Add to Watchlist'}
              </BtnPrimary>
            </Actions>

            <FactGrid>
              <Fact><FactLabel>Release</FactLabel><FactValue>{formatDate(movie.release_date)}</FactValue></Fact>
              <Fact><FactLabel>Runtime</FactLabel><FactValue>{formatRuntime(movie.runtime)}</FactValue></Fact>
              <Fact><FactLabel>Status</FactLabel><FactValue>{movie.status || '—'}</FactValue></Fact>
              {movie.budget > 0 && (
                <Fact><FactLabel>Budget</FactLabel><FactValue>${(movie.budget / 1e6).toFixed(0)}M</FactValue></Fact>
              )}
              {movie.revenue > 0 && (
                <Fact><FactLabel>Revenue</FactLabel><FactValue>${(movie.revenue / 1e6).toFixed(0)}M</FactValue></Fact>
              )}
              {movie.original_language && (
                <Fact><FactLabel>Language</FactLabel><FactValue>{movie.original_language.toUpperCase()}</FactValue></Fact>
              )}
            </FactGrid>

            {trailer && (
              <TrailerBtn href={`https://youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch Trailer
              </TrailerBtn>
            )}

            {cast.length > 0 && (
              <>
                <SectionTitle>Cast</SectionTitle>
                <CastGrid>
                  {cast.map(person => (
                    <CastCard key={person.id} to={`/person/${person.id}`}>
                      <CastPhoto>
                        {person.profile_path
                          ? <img src={`${IMG}/w185${person.profile_path}`} alt={person.name} loading="lazy" />
                          : <CastInitials>{person.name.split(' ').map(n => n[0]).slice(0,2).join('')}</CastInitials>
                        }
                      </CastPhoto>
                      <CastName className="cast-name">{person.name}</CastName>
                      <CastChar>{person.character}</CastChar>
                    </CastCard>
                  ))}
                </CastGrid>
              </>
            )}

            {similar.length > 0 && (
              <>
                <SectionTitle>You Might Also Like</SectionTitle>
                <RelatedGrid>
                  {similar.map(m => <MovieCard key={m.id} movie={m} />)}
                </RelatedGrid>
              </>
            )}
          </Info>
        </MainLayout>
      </Content>
    </Page>
  );
};

export default MovieDetail;

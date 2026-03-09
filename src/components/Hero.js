import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { BACKDROP_SIZES, formatYear, getRatingColor } from '../utils/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;

const HeroWrap = styled.div`
  position: relative;
  height: 90vh;
  min-height: 560px;
  max-height: 800px;
  overflow: hidden;
  background: var(--bg);
`;

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  animation: ${fadeIn} 0.8s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      linear-gradient(to right, rgba(10,10,15,0.95) 40%, rgba(10,10,15,0.3) 100%),
      linear-gradient(to top, rgba(10,10,15,1) 0%, transparent 50%);
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  padding-top: 64px;
`;

const MovieInfo = styled.div`
  max-width: 560px;
  animation: ${slideUp} 0.6s ease 0.2s both;
`;

const Badge = styled.span`
  display: inline-block;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
  background: var(--accent-dim);
  border: 1px solid rgba(232,197,71,0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 2px;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  letter-spacing: 0.04em;
  line-height: 1;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

const RatingBadge = styled.span`
  color: ${({ $c }) => $c};
  font-weight: 500;
  font-size: 1rem;
`;

const Overview = styled.p`
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 1.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Genres = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.75rem;
`;

const GenreTag = styled.span`
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.25rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 2px;
  color: var(--text-secondary);
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const BtnPrimary = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--accent);
  color: var(--bg);
  border-radius: var(--radius);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: opacity 0.2s, transform 0.2s;

  &:hover { opacity: 0.9; transform: translateY(-1px); }

  svg { width: 16px; height: 16px; }
`;

const BtnSecondary = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255,255,255,0.08);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: background 0.2s, transform 0.2s;

  &:hover { background: rgba(255,255,255,0.12); transform: translateY(-1px); }
  &.active {
    background: var(--accent-dim);
    border-color: rgba(232,197,71,0.3);
    color: var(--accent);
  }

  svg { width: 16px; height: 16px; }
`;

const Indicators = styled.div`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  z-index: 3;
  display: flex;
  gap: 0.4rem;
`;

const Dot = styled.button`
  width: ${({ $active }) => $active ? '24px' : '6px'};
  height: 6px;
  border-radius: 3px;
  background: ${({ $active }) => $active ? 'var(--accent)' : 'rgba(255,255,255,0.3)'};
  transition: all 0.3s ease;
`;

const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 18: 'Drama', 14: 'Fantasy', 27: 'Horror',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
};

const Hero = ({ movies = [] }) => {
  const [current, setCurrent] = useState(0);
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    if (!movies.length) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % Math.min(movies.length, 5)), 7000);
    return () => clearInterval(t);
  }, [movies.length]);

  if (!movies.length) return null;
  const movie = movies[current];
  const inList = isInWatchlist(movie.id);
  const genres = movie.genre_ids?.slice(0, 3).map(id => GENRE_MAP[id]).filter(Boolean) || [];

  return (
    <HeroWrap>
      <Backdrop key={current}>
        {movie.backdrop_path && (
          <img
            src={`${BACKDROP_SIZES.lg}${movie.backdrop_path}`}
            alt={movie.title}
          />
        )}
      </Backdrop>

      <Content>
        <MovieInfo>
          <Badge>Featured Film</Badge>
          <Title>{movie.title}</Title>
          <MetaRow>
            <RatingBadge $c={getRatingColor(movie.vote_average)}>
              ★ {movie.vote_average?.toFixed(1)}
            </RatingBadge>
            <span>·</span>
            <span>{formatYear(movie.release_date)}</span>
            {movie.vote_count && (
              <>
                <span>·</span>
                <span>{movie.vote_count.toLocaleString()} votes</span>
              </>
            )}
          </MetaRow>

          {genres.length > 0 && (
            <Genres>
              {genres.map(g => <GenreTag key={g}>{g}</GenreTag>)}
            </Genres>
          )}

          <Overview>{movie.overview}</Overview>

          <Actions>
            <BtnPrimary to={`/movie/${movie.id}`}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              View Details
            </BtnPrimary>
            <BtnSecondary
              className={inList ? 'active' : ''}
              onClick={() => toggleWatchlist(movie)}
            >
              <svg viewBox="0 0 24 24" fill={inList ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              {inList ? 'Saved' : 'Watchlist'}
            </BtnSecondary>
          </Actions>
        </MovieInfo>
      </Content>

      <Indicators>
        {movies.slice(0, 5).map((_, i) => (
          <Dot key={i} $active={i === current} onClick={() => setCurrent(i)} />
        ))}
      </Indicators>
    </HeroWrap>
  );
};

export default Hero;

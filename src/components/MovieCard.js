import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { POSTER_SIZES, formatYear, getRatingColor } from '../utils/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

const Card = styled(Link)`
  display: block;
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  group: true;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255,255,255,0.15);
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  }

  &:hover .overlay {
    opacity: 1;
  }

  &:hover .poster {
    transform: scale(1.04);
  }
`;

const PosterWrap = styled.div`
  aspect-ratio: 2/3;
  overflow: hidden;
  position: relative;
  background: var(--bg-elevated);
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
`;

const NoPoster = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;

  svg {
    opacity: 0.3;
    width: 32px;
    height: 32px;
  }
`;

const Overlay = styled.div`
  className: overlay;
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.3) 50%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
`;

const OverlayTitle = styled.p`
  font-family: var(--font-serif);
  font-size: 0.95rem;
  line-height: 1.3;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const OverlayMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
`;

const Rating = styled.span`
  color: ${({ $color }) => $color};
  font-weight: 500;
  font-size: 0.8rem;
`;

const BookmarkBtn = styled.button`
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  z-index: 2;
  width: 32px;
  height: 32px;
  border-radius: var(--radius);
  background: ${({ $active }) => $active ? 'var(--accent)' : 'rgba(10,10,15,0.8)'};
  backdrop-filter: blur(8px);
  border: 1px solid ${({ $active }) => $active ? 'var(--accent)' : 'var(--border)'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: ${({ $active }) => $active ? 'var(--bg)' : 'var(--text-primary)'};
  opacity: 0;
  transform: scale(0.8);

  ${Card}:hover & {
    opacity: 1;
    transform: scale(1);
  }

  &:hover {
    transform: scale(1.1) !important;
  }

  svg {
    width: 14px;
    height: 14px;
    fill: ${({ $active }) => $active ? 'var(--bg)' : 'none'};
  }
`;

const Info = styled.div`
  padding: 0.75rem;
`;

const Title = styled.p`
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-primary);
  margin-bottom: 0.2rem;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-secondary);
`;

const MovieCard = ({ movie, size = 'md' }) => {
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const [imgError, setImgError] = useState(false);
  const inList = isInWatchlist(movie.id);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(movie);
  };

  const posterUrl = movie.poster_path && !imgError
    ? `${POSTER_SIZES[size]}${movie.poster_path}`
    : null;

  return (
    <Card to={`/movie/${movie.id}`}>
      <PosterWrap>
        {posterUrl ? (
          <Poster
            className="poster"
            src={posterUrl}
            alt={movie.title}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <NoPoster>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
            No Image
          </NoPoster>
        )}

        <Overlay className="overlay">
          <OverlayTitle>{movie.title}</OverlayTitle>
          <OverlayMeta>
            <Rating $color={getRatingColor(movie.vote_average)}>
              ★ {movie.vote_average?.toFixed(1) || 'N/A'}
            </Rating>
            <span>·</span>
            <span>{formatYear(movie.release_date)}</span>
          </OverlayMeta>
        </Overlay>

        <BookmarkBtn
          $active={inList}
          onClick={handleBookmark}
          title={inList ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </BookmarkBtn>
      </PosterWrap>

      <Info>
        <Title>{movie.title}</Title>
        <Meta>
          <span>{formatYear(movie.release_date) || '—'}</span>
          {movie.vote_average > 0 && (
            <Rating $color={getRatingColor(movie.vote_average)}>
              ★ {movie.vote_average?.toFixed(1)}
            </Rating>
          )}
        </Meta>
      </Info>
    </Card>
  );
};

export default MovieCard;

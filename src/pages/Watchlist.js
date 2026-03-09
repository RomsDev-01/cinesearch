import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useWatchlist } from '../context/WatchlistContext';
import { POSTER_SIZES, formatYear, getRatingColor } from '../utils/tmdb';

const Page = styled.main`
  padding: calc(64px + 3rem) 2rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: 2rem;
  letter-spacing: 0.06em;
  color: var(--text-primary);

  span {
    font-size: 1rem;
    color: var(--text-muted);
    font-family: var(--font-body);
    letter-spacing: 0;
    margin-left: 0.75rem;
  }
`;

const ClearBtn = styled.button`
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--red);
  opacity: 0.7;
  transition: opacity 0.2s;
  &:hover { opacity: 1; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 6rem 0;

  .icon { font-size: 3.5rem; margin-bottom: 1.5rem; opacity: 0.3; }

  h2 {
    font-family: var(--font-display);
    font-size: 1.8rem;
    letter-spacing: 0.06em;
    color: var(--text-secondary);
    margin-bottom: 0.75rem;
  }

  p {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
`;

const BrowseBtn = styled(Link)`
  display: inline-flex;
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
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const Item = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 1.25rem;
  align-items: center;
  padding: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: border-color 0.2s;

  &:hover { border-color: rgba(255,255,255,0.15); }
`;

const Thumb = styled(Link)`
  display: block;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--bg-elevated);
  aspect-ratio: 2/3;

  img { width: 100%; height: 100%; object-fit: cover; }
`;

const ItemInfo = styled.div``;

const ItemTitle = styled(Link)`
  display: block;
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--text-primary);
  margin-bottom: 0.3rem;
  transition: color 0.2s;
  &:hover { color: var(--accent); }
`;

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.78rem;
  color: var(--text-muted);
`;

const Rating = styled.span`
  color: ${({ $c }) => $c};
  font-weight: 500;
`;

const Overview = styled.p`
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-top: 0.4rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RemoveBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  color: var(--text-muted);
  border: 1px solid transparent;
  transition: all 0.2s;

  &:hover {
    color: var(--red);
    border-color: rgba(232,84,68,0.3);
    background: rgba(232,84,68,0.1);
  }

  svg { width: 16px; height: 16px; }
`;

const Watchlist = () => {
  const { watchlist, removeFromWatchlist, clearWatchlist } = useWatchlist();
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = () => {
    if (confirmClear) { clearWatchlist(); setConfirmClear(false); }
    else { setConfirmClear(true); setTimeout(() => setConfirmClear(false), 3000); }
  };

  return (
    <Page>
      <Header>
        <Title>
          My Watchlist
          <span>{watchlist.length} {watchlist.length === 1 ? 'film' : 'films'}</span>
        </Title>
        {watchlist.length > 0 && (
          <ClearBtn onClick={handleClear}>
            {confirmClear ? 'Click again to confirm' : 'Clear All'}
          </ClearBtn>
        )}
      </Header>

      {watchlist.length === 0 ? (
        <EmptyState>
          <div className="icon">🎬</div>
          <h2>Your Watchlist is Empty</h2>
          <p>Save films you want to watch later by clicking the bookmark icon.</p>
          <BrowseBtn to="/browse">Discover Films</BrowseBtn>
        </EmptyState>
      ) : (
        <List>
          {watchlist.map(movie => (
            <Item key={movie.id}>
              <Thumb to={`/movie/${movie.id}`}>
                {movie.poster_path && (
                  <img
                    src={`${POSTER_SIZES.sm}${movie.poster_path}`}
                    alt={movie.title}
                    loading="lazy"
                  />
                )}
              </Thumb>

              <ItemInfo>
                <ItemTitle to={`/movie/${movie.id}`}>{movie.title}</ItemTitle>
                <ItemMeta>
                  <span>{formatYear(movie.release_date) || '—'}</span>
                  {movie.vote_average > 0 && (
                    <>
                      <span>·</span>
                      <Rating $c={getRatingColor(movie.vote_average)}>
                        ★ {movie.vote_average?.toFixed(1)}
                      </Rating>
                    </>
                  )}
                </ItemMeta>
                {movie.overview && <Overview>{movie.overview}</Overview>}
              </ItemInfo>

              <RemoveBtn onClick={() => removeFromWatchlist(movie.id)} title="Remove from watchlist">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                </svg>
              </RemoveBtn>
            </Item>
          ))}
        </List>
      )}
    </Page>
  );
};

export default Watchlist;

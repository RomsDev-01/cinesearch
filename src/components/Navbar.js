import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useWatchlist } from '../context/WatchlistContext';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: all 0.3s ease;

  ${({ $scrolled }) => $scrolled ? css`
    background: rgba(10,10,15,0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  ` : css`
    background: linear-gradient(to bottom, rgba(10,10,15,0.8), transparent);
  `}
`;

const NavInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const Logo = styled(Link)`
  font-family: var(--font-display);
  font-size: 1.8rem;
  letter-spacing: 0.08em;
  color: var(--accent);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  span {
    color: var(--text-primary);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;

  @media (max-width: 600px) {
    display: none;
  }
`;

const StyledNavLink = styled(NavLink)`
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
  border-radius: var(--radius);
  transition: color 0.2s, background 0.2s;

  &:hover {
    color: var(--text-primary);
    background: var(--border);
  }

  &.active {
    color: var(--accent);
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0 0.75rem;
  gap: 0.5rem;
  flex: 0 1 280px;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-dim);
  }

  svg {
    color: var(--text-muted);
    flex-shrink: 0;
    width: 14px;
    height: 14px;
  }
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 0.85rem;
  width: 100%;
  padding: 0.55rem 0;

  &::placeholder {
    color: var(--text-muted);
  }
`;

const WatchlistBtn = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.9rem;
  background: var(--accent-dim);
  border: 1px solid rgba(232,197,71,0.2);
  border-radius: var(--radius);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--accent);
  transition: background 0.2s, border-color 0.2s;
  flex-shrink: 0;

  &:hover {
    background: rgba(232,197,71,0.25);
    border-color: rgba(232,197,71,0.4);
  }

  .count {
    background: var(--accent);
    color: var(--bg);
    font-size: 0.65rem;
    font-weight: 700;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const { count } = useWatchlist();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <Nav $scrolled={scrolled}>
      <NavInner>
        <Logo to="/">
          CINE<span>SEARCH</span>
        </Logo>

        <NavLinks>
          <StyledNavLink to="/" end>Home</StyledNavLink>
          <StyledNavLink to="/browse">Browse</StyledNavLink>
          <StyledNavLink to="/genres">Genres</StyledNavLink>
          <StyledNavLink to="/top-rated">Top Rated</StyledNavLink>
        </NavLinks>

        <form onSubmit={handleSearch} style={{ flex: '0 1 280px' }}>
          <SearchBar>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <SearchInput
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search films..."
            />
          </SearchBar>
        </form>

        <WatchlistBtn to="/watchlist">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          List
          {count > 0 && <span className="count">{count}</span>}
        </WatchlistBtn>
      </NavInner>
    </Nav>
  );
};

export default Navbar;

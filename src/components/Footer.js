import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterWrap = styled.footer`
  margin-top: auto;
  border-top: 1px solid var(--border);
  padding: 2.5rem 2rem;
  background: var(--bg-card);
`;

const Inner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const Brand = styled.div``;

const Logo = styled(Link)`
  font-family: var(--font-display);
  font-size: 1.4rem;
  letter-spacing: 0.08em;
  color: var(--accent);
  display: block;
  margin-bottom: 0.4rem;

  span { color: var(--text-secondary); }
`;

const Tagline = styled.p`
  font-size: 0.8rem;
  color: var(--text-muted);
`;

const Links = styled.div`
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const GroupTitle = styled.p`
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
`;

const FooterLink = styled(Link)`
  font-size: 0.82rem;
  color: var(--text-secondary);
  transition: color 0.2s;
  &:hover { color: var(--text-primary); }
`;

const Bottom = styled.div`
  border-top: 1px solid var(--border);
  padding-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Copyright = styled.p`
  font-size: 0.75rem;
  color: var(--text-muted);
`;

const TMDBNotice = styled.a`
  font-size: 0.75rem;
  color: var(--text-muted);
  transition: color 0.2s;
  &:hover { color: var(--text-secondary); }
`;

const Footer = () => (
  <FooterWrap>
    <Inner>
      <Top>
        <Brand>
          <Logo to="/">CINE<span>SEARCH</span></Logo>
          <Tagline>Discover your next favorite film.</Tagline>
        </Brand>
        <Links>
          <LinkGroup>
            <GroupTitle>Browse</GroupTitle>
            <FooterLink to="/browse">Now Playing</FooterLink>
            <FooterLink to="/browse?tab=popular">Popular</FooterLink>
            <FooterLink to="/top-rated">Top Rated</FooterLink>
            <FooterLink to="/browse?tab=upcoming">Upcoming</FooterLink>
          </LinkGroup>
          <LinkGroup>
            <GroupTitle>Explore</GroupTitle>
            <FooterLink to="/genres">Browse by Genre</FooterLink>
            <FooterLink to="/watchlist">My Watchlist</FooterLink>
          </LinkGroup>
        </Links>
      </Top>
      <Bottom>
        <Copyright>© {new Date().getFullYear()} CineSearch. For personal use only.</Copyright>
        <TMDBNotice href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">
          Powered by TMDB API
        </TMDBNotice>
      </Bottom>
    </Inner>
  </FooterWrap>
);

export default Footer;

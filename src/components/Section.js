import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import MovieCard from './MovieCard';

const Wrap = styled.section`
  padding: 2.5rem 0 0;
`;

const Header = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 1rem;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

const TitleGroup = styled.div``;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 1.6rem;
  letter-spacing: 0.06em;
  color: var(--text-primary);
`;

const Subtitle = styled.p`
  font-size: 0.78rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-top: 0.1rem;
`;

const SeeAll = styled(Link)`
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  transition: opacity 0.2s;

  &:hover { opacity: 0.7; }
`;

const ScrollWrap = styled.div`
  position: relative;
  overflow: hidden;
`;

const Track = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.5rem 2rem 1.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  max-width: 1400px;
  margin: 0 auto;

  &::-webkit-scrollbar { display: none; }
`;

const CardWrap = styled.div`
  flex: 0 0 160px;

  @media (min-width: 768px) { flex: 0 0 180px; }
  @media (min-width: 1200px) { flex: 0 0 200px; }
`;

const ScrollBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $dir }) => $dir === 'left' ? 'left: 0.5rem;' : 'right: 0.5rem;'}
  z-index: 5;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(10,10,15,0.9);
  border: 1px solid var(--border);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border-color 0.2s;
  backdrop-filter: blur(8px);

  &:hover {
    background: var(--bg-elevated);
    border-color: rgba(255,255,255,0.2);
  }

  svg { width: 18px; height: 18px; }
`;

const Section = ({ title, subtitle, movies = [], seeAllLink }) => {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    if (!trackRef.current) return;
    const amount = 600;
    trackRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <Wrap>
      <Header>
        <TitleGroup>
          <SectionTitle>{title}</SectionTitle>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </TitleGroup>
        {seeAllLink && <SeeAll to={seeAllLink}>See All →</SeeAll>}
      </Header>

      <ScrollWrap>
        <ScrollBtn $dir="left" onClick={() => scroll('left')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </ScrollBtn>

        <Track ref={trackRef}>
          {movies.map(movie => (
            <CardWrap key={movie.id}>
              <MovieCard movie={movie} />
            </CardWrap>
          ))}
        </Track>

        <ScrollBtn $dir="right" onClick={() => scroll('right')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </ScrollBtn>
      </ScrollWrap>
    </Wrap>
  );
};

export default Section;

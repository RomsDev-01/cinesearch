import React from 'react';
import styled, { keyframes } from 'styled-components';
import MovieCard from './MovieCard';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${({ $minWidth }) => $minWidth || '160px'}, 1fr));
  gap: ${({ $gap }) => $gap || '1.25rem'};
`;

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const SkeletonCard = styled.div`
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border);
`;

const SkeletonPoster = styled.div`
  aspect-ratio: 2/3;
  background: linear-gradient(
    90deg,
    var(--bg-elevated) 25%,
    rgba(255,255,255,0.03) 50%,
    var(--bg-elevated) 75%
  );
  background-size: 400px 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

const SkeletonInfo = styled.div`
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const SkeletonLine = styled.div`
  height: ${({ $h }) => $h || '12px'};
  width: ${({ $w }) => $w || '100%'};
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    var(--bg-elevated) 25%,
    rgba(255,255,255,0.03) 50%,
    var(--bg-elevated) 75%
  );
  background-size: 400px 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

export const LoadingGrid = ({ count = 12, minWidth }) => (
  <Grid $minWidth={minWidth}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i}>
        <SkeletonPoster />
        <SkeletonInfo>
          <SkeletonLine $w="90%" />
          <SkeletonLine $w="50%" $h="10px" />
        </SkeletonInfo>
      </SkeletonCard>
    ))}
  </Grid>
);

export const MovieGrid = ({ movies, minWidth, gap }) => (
  <Grid $minWidth={minWidth} $gap={gap}>
    {movies?.map(movie => (
      <MovieCard key={movie.id} movie={movie} />
    ))}
  </Grid>
);

export default MovieGrid;

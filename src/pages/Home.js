import React from 'react';
import styled from 'styled-components';
import Hero from '../components/Hero';
import Section from '../components/Section';
import { LoadingGrid } from '../components/MovieGrid';
import { useFetch } from '../hooks';
import { getTrending, getNowPlaying, getPopular, getTopRated, getUpcoming } from '../utils/tmdb';

const Page = styled.main`
  padding-bottom: 4rem;
`;

const SectionLoader = styled.div`
  padding: 2.5rem 2rem 0;
  max-width: 1400px;
  margin: 0 auto;
`;

const Home = () => {
  const { data: trending, loading: trendingLoading } = useFetch(() => getTrending('week'), []);
  const { data: nowPlaying } = useFetch(() => getNowPlaying(), []);
  const { data: popular } = useFetch(() => getPopular(), []);
  const { data: topRated } = useFetch(() => getTopRated(), []);
  const { data: upcoming } = useFetch(() => getUpcoming(), []);

  return (
    <Page>
      {trendingLoading ? (
        <div style={{ height: '90vh', background: 'var(--bg-card)' }} />
      ) : (
        <Hero movies={trending?.results || []} />
      )}

      {!nowPlaying ? (
        <SectionLoader><LoadingGrid count={8} /></SectionLoader>
      ) : (
        <Section
          title="Now Playing"
          subtitle="In cinemas now"
          movies={nowPlaying.results}
          seeAllLink="/browse?tab=now_playing"
        />
      )}

      {popular?.results && (
        <Section
          title="Popular"
          subtitle="What everyone's watching"
          movies={popular.results}
          seeAllLink="/browse?tab=popular"
        />
      )}

      {topRated?.results && (
        <Section
          title="Top Rated"
          subtitle="All-time favourites"
          movies={topRated.results}
          seeAllLink="/top-rated"
        />
      )}

      {upcoming?.results && (
        <Section
          title="Coming Soon"
          subtitle="On the horizon"
          movies={upcoming.results}
          seeAllLink="/browse?tab=upcoming"
        />
      )}
    </Page>
  );
};

export default Home;

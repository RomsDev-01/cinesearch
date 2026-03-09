// ─── TMDB API UTILITY ────────────────────────────────────────────────────────
// Get your free API key at https://www.themoviedb.org/settings/api
// Then add it to your .env file: REACT_APP_TMDB_API_KEY=your_key_here

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMG_BASE = 'https://image.tmdb.org/t/p';

export const POSTER_SIZES = {
  sm: `${IMG_BASE}/w185`,
  md: `${IMG_BASE}/w342`,
  lg: `${IMG_BASE}/w500`,
  xl: `${IMG_BASE}/w780`,
  original: `${IMG_BASE}/original`,
};

export const BACKDROP_SIZES = {
  sm: `${IMG_BASE}/w300`,
  md: `${IMG_BASE}/w780`,
  lg: `${IMG_BASE}/w1280`,
  original: `${IMG_BASE}/original`,
};

const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, v);
    }
  });
  return url.toString();
};

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.status_message || `HTTP ${res.status}`);
  }
  return res.json();
};

// ─── DISCOVER / BROWSE ───────────────────────────────────────────────────────

export const getTrending = (timeWindow = 'week') =>
  fetcher(buildUrl(`/trending/movie/${timeWindow}`));

export const getNowPlaying = (page = 1) =>
  fetcher(buildUrl('/movie/now_playing', { page }));

export const getPopular = (page = 1) =>
  fetcher(buildUrl('/movie/popular', { page }));

export const getTopRated = (page = 1) =>
  fetcher(buildUrl('/movie/top_rated', { page }));

export const getUpcoming = (page = 1) =>
  fetcher(buildUrl('/movie/upcoming', { page }));

export const discoverByGenre = (genreId, page = 1, sortBy = 'popularity.desc') =>
  fetcher(buildUrl('/discover/movie', {
    with_genres: genreId,
    page,
    sort_by: sortBy,
    'vote_count.gte': 50,
  }));

// ─── MOVIE DETAILS ───────────────────────────────────────────────────────────

export const getMovieDetails = (movieId) =>
  fetcher(buildUrl(`/movie/${movieId}`, {
    append_to_response: 'credits,videos,similar,recommendations,release_dates',
  }));

// ─── SEARCH ──────────────────────────────────────────────────────────────────

export const searchMovies = (query, page = 1) =>
  fetcher(buildUrl('/search/movie', { query, page, include_adult: false }));

// ─── GENRES ──────────────────────────────────────────────────────────────────

export const getGenres = () =>
  fetcher(buildUrl('/genre/movie/list'));

// ─── PERSON ──────────────────────────────────────────────────────────────────

export const getPersonDetails = (personId) =>
  fetcher(buildUrl(`/person/${personId}`, {
    append_to_response: 'movie_credits',
  }));

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'TBA';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};

export const formatYear = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).getFullYear();
};

export const getRatingColor = (rating) => {
  if (rating >= 7.5) return 'var(--green)';
  if (rating >= 6.0) return 'var(--accent)';
  return 'var(--red)';
};

export const getCertification = (releaseDates) => {
  if (!releaseDates?.results) return null;
  const us = releaseDates.results.find(r => r.iso_3166_1 === 'US');
  if (!us) return null;
  const cert = us.release_dates.find(d => d.certification);
  return cert?.certification || null;
};

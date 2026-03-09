import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── useFetch ─────────────────────────────────────────────────────────────────
export const useFetch = (fetchFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!fetchFn) return;
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    fetchFn()
      .then(d => {
        if (!controller.signal.aborted) {
          setData(d);
          setLoading(false);
        }
      })
      .catch(e => {
        if (!controller.signal.aborted) {
          setError(e.message || 'Something went wrong');
          setLoading(false);
        }
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
};

// ─── useDebounce ─────────────────────────────────────────────────────────────
export const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

// ─── useIntersectionObserver ─────────────────────────────────────────────────
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableOptions = React.useMemo(() => options, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1, ...stableOptions }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [stableOptions]);

  return [ref, isIntersecting];
};

// ─── usePagination ───────────────────────────────────────────────────────────
export const usePagination = (fetchFn, initialPage = 1) => {
  const [page, setPage] = useState(initialPage);
  const [allResults, setAllResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (pageNum, reset = false) => {
    setLoading(true);
    try {
      const data = await fetchFn(pageNum);
      setAllResults(prev => reset ? data.results : [...prev, ...data.results]);
      setTotalPages(data.total_pages);
      setPage(pageNum);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  const loadMore = useCallback(() => {
    if (page < totalPages && !loading) load(page + 1);
  }, [page, totalPages, loading, load]);

  const reset = useCallback(() => {
    setAllResults([]);
    setPage(initialPage);
    load(initialPage, true);
  }, [initialPage, load]);

  return { allResults, loading, error, page, totalPages, load, loadMore, reset, hasMore: page < totalPages };
};

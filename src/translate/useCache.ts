export const useCache = <P, D>(fetcher: (params: P) => Promise<D>) => {
  const cache = new Map<P, Promise<D>>();
  const fetch = (params: P) => {
    if (cache.has(params)) {
      return cache.get(params) as Promise<D>;
    }
    const promise = fetcher(params);
    cache.set(params, promise);
    return promise;
  };
  return {
    cache,
    fetch,
  };
};

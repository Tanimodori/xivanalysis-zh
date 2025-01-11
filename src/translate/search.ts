import { origFetch } from '../hooks';
import { GarlandSearchItem } from '../types';
import { useCache } from './useCache';

export const _fetchSearch = async (text: string): Promise<GarlandSearchItem[]> => {
  const response = await origFetch(
    `https://www.garlandtools.org/api/search.php?text=${encodeURIComponent(text)}&lang=en`,
  );
  const items = (await response.json()) as GarlandSearchItem[];
  return items;
};

export const { fetch: fetchSearch, cache: searchCache } = useCache(_fetchSearch);

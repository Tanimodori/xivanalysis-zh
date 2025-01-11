import { origFetch } from '../hooks';
import { GarlandSearchItem } from '../types';

export const searchCache = new Map<string, GarlandSearchItem[]>();
export const fetchSearch = async (text: string): Promise<GarlandSearchItem[]> => {
  if (searchCache.has(text)) {
    return searchCache.get(text) as GarlandSearchItem[];
  }

  const response = await origFetch(
    `https://www.garlandtools.org/api/search.php?text=${encodeURIComponent(text)}&lang=en`,
  );
  const items = (await response.json()) as GarlandSearchItem[];

  searchCache.set(text, items);
  return items;
};

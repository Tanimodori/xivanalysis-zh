import { origFetch } from '../hooks';
import { GarlandItem, GarlandItemResponse, XIVAPIObject } from '../types';

export const itemCache = new Map<number, GarlandItem>();

export const fetchItem = async (id: number): Promise<GarlandItem> => {
  if (itemCache.has(id)) {
    return itemCache.get(id) as GarlandItem;
  }

  const response = await origFetch(`https://www.garlandtools.cn/db/doc/Item/chs/3/${id}.json`);
  const { item } = (await response.json()) as GarlandItemResponse;

  itemCache.set(id, item);
  return item;
};

export const translateItem = async (obj: XIVAPIObject): Promise<XIVAPIObject> => {
  const id = obj.row_id;
  const item = await fetchItem(id);
  obj.fields.Name = item.name;
  return obj;
};

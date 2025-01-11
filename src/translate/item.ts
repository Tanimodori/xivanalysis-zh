import { origFetch } from '../hooks';
import { GarlandItem, GarlandItemResponse, XIVAPIObject } from '../types';
import { useCache } from './useCache';

export const _fetchItem = async (id: number): Promise<GarlandItem> => {
  const response = await origFetch(`https://www.garlandtools.cn/db/doc/Item/chs/3/${id}.json`);
  const { item } = (await response.json()) as GarlandItemResponse;
  return item;
};

export const { fetch: fetchItem, cache: itemCache } = useCache(_fetchItem);

export const translateItem = async (obj: XIVAPIObject): Promise<XIVAPIObject> => {
  const id = obj.row_id;
  const item = await fetchItem(id);
  obj.fields.Name = item.name;
  obj.fields['Description@as(html)'] = item.description;
  return obj;
};

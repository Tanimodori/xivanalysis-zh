import { origFetch } from '../hooks';
import { GarlandAction, GarlandActionResponse, XIVAPIObject } from '../types';

const actionCache = new Map<number, GarlandAction>();

export const fetchAction = async (id: number): Promise<GarlandAction> => {
  if (actionCache.has(id)) {
    return actionCache.get(id) as GarlandAction;
  }

  const response = await origFetch(`https://www.garlandtools.cn/db/doc/Action/chs/2/${id}.json`);
  const { action } = (await response.json()) as GarlandActionResponse;

  actionCache.set(id, action);
  return action;
};

export const translateAction = async (item: XIVAPIObject): Promise<XIVAPIObject> => {
  const id = item.row_id;
  const action = await fetchAction(id);
  item.fields.Name = action.name;
  return item;
};

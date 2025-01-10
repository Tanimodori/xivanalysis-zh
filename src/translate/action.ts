import { origFetch } from '../hooks';
import { GarlandAction, GarlandActionResponse, XIVAPIActionRich, XIVAPIObject } from '../types';

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

export const translateAction = async (obj: XIVAPIObject): Promise<XIVAPIObject> => {
  const id = obj.row_id;
  const action = await fetchAction(id);
  obj.fields.Name = action.name;
  return obj;
};

export const translateActionRich = async (obj: XIVAPIActionRich): Promise<XIVAPIActionRich> => {
  const id = obj.row_id;
  const action = await fetchAction(id);
  obj.fields.Name = action.name;
  obj.transient['Description@as(html)'] = action.description;
  return obj;
};

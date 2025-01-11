import { origFetch } from '../hooks';
import type { GarlandAction, GarlandActionResponse, XIVAPIActionRich, XIVAPIObject } from '../types';
import { actionCatagoryPolyfill, classJobCategoryPolyfill, classJobPolyfill } from './constants';
import { useCache } from './useCache';

const _fetchAction = async (id: number): Promise<GarlandAction> => {
  const response = await origFetch(`https://www.garlandtools.cn/db/doc/Action/chs/2/${id}.json`);
  const { action } = (await response.json()) as GarlandActionResponse;
  return action;
};

export const { fetch: fetchAction, cache: actionCache } = useCache(_fetchAction);

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
  if (obj.fields.ClassJob.value !== -1) {
    obj.fields.ClassJob.fields.Abbreviation = classJobPolyfill[obj.fields.ClassJob.row_id][0];
  } else {
    if (obj.fields.ClassJob.fields === undefined) {
      obj.fields.ClassJob.fields = {};
    }
    obj.fields.ClassJob.fields.Abbreviation = '';
  }
  obj.fields.ClassJobCategory.fields.Name = classJobCategoryPolyfill[obj.fields.ClassJobCategory.row_id];
  obj.fields.ActionCategory.fields.Name = actionCatagoryPolyfill[obj.fields.ActionCategory.row_id];
  obj.transient['Description@as(html)'] = action.description;
  return obj;
};

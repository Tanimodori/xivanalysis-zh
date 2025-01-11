import { origFetch } from '../hooks';
import { GarlandStatus, GarlandStatusResponse, XIVAPIObject } from '../types';
import { useCache } from './useCache';

export const _fetchStatus = async (id: number): Promise<GarlandStatus> => {
  const response = await origFetch(`https://www.garlandtools.cn/db/doc/Status/chs/2/${id}.json`);
  const { status } = (await response.json()) as GarlandStatusResponse;
  return status;
};

export const { fetch: fetchStatus, cache: statusCache } = useCache(_fetchStatus);

export const translateStatus = async (obj: XIVAPIObject): Promise<XIVAPIObject> => {
  const id = obj.row_id;
  const status = await fetchStatus(id);
  obj.fields.Name = status.name;
  obj.fields['Description@as(html)'] = status.description;
  return obj;
};

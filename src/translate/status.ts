import { origFetch } from '../hooks';
import { GarlandStatus, GarlandStatusResponse, XIVAPIObject } from '../types';

const statusCache = new Map<number, GarlandStatus>();

export const fetchStatus = async (id: number): Promise<GarlandStatus> => {
  if (statusCache.has(id)) {
    return statusCache.get(id) as GarlandStatus;
  }

  const response = await origFetch(`https://www.garlandtools.cn/db/doc/Status/chs/2/${id}.json`);
  const { status } = (await response.json()) as GarlandStatusResponse;

  statusCache.set(id, status);
  return status;
};

export const translateStatus = async (obj: XIVAPIObject): Promise<XIVAPIObject> => {
  const id = obj.row_id;
  const status = await fetchStatus(id);
  obj.fields.Name = status.name;
  return obj;
};

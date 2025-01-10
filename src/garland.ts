import { origFetch } from './hooks';
import type { GarlandActionResponse, GarlandItemResponse, GarlandStatusResponse } from './types';

// Garland CN API Schema
export const garlandSchema = {
  action: (id: string) => `https://www.garlandtools.cn/db/doc/Status/chs/2/${id}.json`,
  item: (id: string) => `https://www.garlandtools.cn/db/doc/Status/chs/3/${id}.json`,
  status: (id: string) => `https://www.garlandtools.cn/db/doc/Status/chs/2/${id}.json`,
};

// Fetch Garland CN API
export const fetchAction = async (id: string) => {
  const response = await origFetch(garlandSchema.action(id));
  return response.json() as Promise<GarlandActionResponse>;
};

export const fetchItem = async (id: string) => {
  const response = await origFetch(garlandSchema.item(id));
  return response.json() as Promise<GarlandItemResponse>;
};

export const fetchStatus = async (id: string) => {
  const response = await origFetch(garlandSchema.status(id));
  return response.json() as Promise<GarlandStatusResponse>;
};

export const addonTextPolyfill = {
  699: '即时',
  701: '咏唱时间',
  702: '复唱时间',
  705: '魔力消耗',
  708: '技力消耗',
  709: '范围',
  710: '半径',
  711: '习得条件',
  712: '相关',
};

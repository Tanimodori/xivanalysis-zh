import type { XIVAPIAddon } from '../types';

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
} as Record<number, string>;

export const translateAddon = async (obj: XIVAPIAddon): Promise<XIVAPIAddon> => {
  const id = obj.row_id;
  obj.fields.Text = addonTextPolyfill[id];
  return obj;
};

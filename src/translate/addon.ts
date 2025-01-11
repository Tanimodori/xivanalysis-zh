import type { XIVAPIAddon } from '../types';
import { addonTextPolyfill } from './constants';

export const translateAddon = async (obj: XIVAPIAddon): Promise<XIVAPIAddon> => {
  const id = obj.row_id;
  obj.fields.Text = addonTextPolyfill[id];
  return obj;
};

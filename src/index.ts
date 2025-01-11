import { injectFetch } from './hooks';
import { injectStyle } from './style';
import {
  injectTimeline,
  translateAction,
  translateActionRich,
  translateAddon,
  translateItem,
  translateStatus,
} from './translate';
import { Package } from './types';
import { isXIVPackage } from './xivapi';

const processPackage = async (pkg: Package): Promise<Response> => {
  const identifier = isXIVPackage(pkg);

  if (!identifier) {
    return pkg.response;
  }
  const { type, rows } = identifier;
  if (type === 'Action') {
    for (let i = 0; i < rows.length; i++) {
      rows[i] = await translateAction(rows[i]);
    }
  } else if (type === 'ActionRich') {
    for (let i = 0; i < rows.length; i++) {
      rows[i] = await translateActionRich(rows[i]);
    }
  } else if (type === 'Addon') {
    for (let i = 0; i < rows.length; i++) {
      rows[i] = await translateAddon(rows[i]);
    }
  } else if (type === 'Item') {
    for (let i = 0; i < rows.length; i++) {
      rows[i] = await translateItem(rows[i]);
    }
  } else if (type === 'Status') {
    for (let i = 0; i < rows.length; i++) {
      rows[i] = await translateStatus(rows[i]);
    }
  }
  const result = {
    ...pkg.json,
    rows: rows,
  };
  return new Response(JSON.stringify(result));
};

injectFetch(processPackage);
injectStyle();
injectTimeline();

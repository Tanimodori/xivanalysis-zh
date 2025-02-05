import { injectFetch } from './hooks';
import { injectStyle } from './style';
import {
  injectIcon,
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

  const safeMap = <T>(source: T[], fn: (obj: T) => Promise<T>): Promise<T[]> => {
    const safeFn = (obj: T): Promise<T> => {
      try {
        return fn(obj);
      } catch (e) {
        console.error(e);
        return Promise.resolve(obj);
      }
    };
    return Promise.all(source.map(safeFn));
  };

  let newRows;
  if (type === 'Action') {
    newRows = await safeMap(rows, translateAction);
  } else if (type === 'ActionRich') {
    newRows = await safeMap(rows, translateActionRich);
  } else if (type === 'Addon') {
    newRows = await safeMap(rows, translateAddon);
  } else if (type === 'Item') {
    newRows = await safeMap(rows, translateItem);
  } else if (type === 'Status') {
    newRows = await safeMap(rows, translateStatus);
  }
  const result = {
    ...pkg.json,
    rows: newRows,
  };
  return new Response(JSON.stringify(result));
};

injectFetch(processPackage);
injectStyle();
injectTimeline();

injectIcon();


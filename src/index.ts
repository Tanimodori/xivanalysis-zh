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

  const saveMap = <T>(source: T[], fn: (obj: T) => Promise<T>): Promise<T[]> => {
    const saveFn = (obj: T): Promise<T> => {
      try {
        return fn(obj);
      } catch (e) {
        console.error(e);
        return Promise.resolve(obj);
      }
    };
    return Promise.all(source.map(saveFn));
  };

  let newRows;
  if (type === 'Action') {
    newRows = await saveMap(rows, translateAction);
  } else if (type === 'ActionRich') {
    newRows = await saveMap(rows, translateActionRich);
  } else if (type === 'Addon') {
    newRows = await saveMap(rows, translateAddon);
  } else if (type === 'Item') {
    newRows = await saveMap(rows, translateItem);
  } else if (type === 'Status') {
    newRows = await saveMap(rows, translateStatus);
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

import { injectFetch } from './hooks';
import { translateAction } from './translate/action';
import { Package } from './types';
import { isXIVPackage } from './xivapi';

const processPackage = async (pkg: Package): Promise<Response> => {
  const identifier = isXIVPackage(pkg);

  if (!identifier) {
    return pkg.response;
  } else if (identifier.type === 'Action') {
    for (let i = 0; i < identifier.rows.length; i++) {
      identifier.rows[i] = await translateAction(identifier.rows[i]);
    }
    const result = {
      ...pkg.json,
      rows: identifier.rows,
    };
    return new Response(JSON.stringify(result));
  }

  // fallback
  return pkg.response;
};

injectFetch(processPackage);


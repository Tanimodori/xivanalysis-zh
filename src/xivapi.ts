import type { Package, XIVAPIActionRich, XIVAPIAddon, XIVAPIObject, XIVAPIResponse } from './types';

export const isXIVPackage = (pkg: Package) => {
  const url = new URL(pkg.url);
  const params = new URLSearchParams(url.search);
  const language = params.get('language');
  if (url.hostname.endsWith('xivapi.com')) {
    if (!url.pathname.startsWith('/api/')) {
      return null;
    }
    if (url.pathname.endsWith('/sheet/Action')) {
      if (params.get('transient') === 'Description@as(html)') {
        const data = pkg.json as XIVAPIResponse<XIVAPIActionRich>;
        return {
          type: 'ActionRich' as const,
          rows: data.rows,
          language,
        };
      } else {
        const data = pkg.json as XIVAPIResponse<XIVAPIObject>;
        return {
          type: 'Action' as const,
          rows: data.rows,
          language,
        };
      }
    } else if (url.pathname.endsWith('/sheet/Item')) {
      const data = pkg.json as XIVAPIResponse<XIVAPIObject>;
      return {
        type: 'Item' as const,
        rows: data.rows,
        language,
      };
    } else if (url.pathname.endsWith('/sheet/Status')) {
      const data = pkg.json as XIVAPIResponse<XIVAPIObject>;
      return {
        type: 'Status' as const,
        rows: data.rows,
        language,
      };
    } else if (url.pathname.endsWith('/sheet/Addon')) {
      const data = pkg.json as XIVAPIResponse<XIVAPIAddon>;
      return {
        type: 'Addon' as const,
        rows: data.rows,
        language,
      };
    }
  }
  return null;
};

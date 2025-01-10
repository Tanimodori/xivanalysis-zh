import { PackageInjector } from './types';

// Hooks
export const origFetch = window.fetch;
export const injectFetch = (injector: PackageInjector) => {
  window.fetch = async (...args) => {
    let response = await origFetch(...args);
    try {
      const pkg = {
        url: args[0].toString(),
        response,
        json: await response.clone().json(),
      };

      // process the package
      response = await injector(pkg);
    } catch (err) {
      console.error(err);
    }
    return response;
  };
};

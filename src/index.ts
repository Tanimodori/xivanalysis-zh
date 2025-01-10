import { Package } from './types';
import { isXIVPackage } from './xivapi';

// Hooks
const { fetch: origFetch } = window;

const processPackage = async (pkg: Package): Promise<Response> => {
  console.log(isXIVPackage(pkg));
  return pkg.response;
};

window.fetch = async (...args) => {
  let response = await origFetch(...args);

  try {
    const pkg = {
      url: args[0].toString(),
      response,
      json: await response.clone().json(),
    };

    // process the package
    response = await processPackage(pkg);
  } catch (err) {
    console.error(err);
  }

  return response;
};

const { fetch: origFetch } = window;
window.fetch = async (...args) => {
  console.log('fetch called with args:', args);
  const response = await origFetch(...args);

  /* work with the cloned response in a separate promise
     chain -- could use the same chain with `await`. */
  response
    .clone()
    .json()
    .then((data) => console.log('intercepted response data:', data))
    .catch((err) => console.error(err));

  /* the original response can be resolved unmodified: */
  return response;
};


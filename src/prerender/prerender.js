const fileStorage = require('./file-storage');
const headlessChrome = require('./headless-chrome');

const prerender = async (url, rerender=false) => {
  if (!rerender) {
    let {html, meta} = await getPrerenderedFiles(url);
    if (html) {
      let ttRenderMs = 0;
      return {html, meta, ttRenderMs};
    }
  }

  // Files are not in the cache or need to be rerendered.
  const {html, meta, ttRenderMs} = await headlessChrome.ssr(url);

  // Cache the rendered HTML and Meta data in GCS.
  await fileStorage.save(
    fileStorage.pathFromUrl(url, 'html'),
    html, {'Content-Type': 'text/html'});

  await fileStorage.save(
    fileStorage.pathFromUrl(url, 'json'),
    JSON.stringify(meta, null, 2), {'Content-Type': 'application/json'});

  return {html, meta, ttRenderMs};
};


const getPrerenderedFiles = async (url) => {
  const html = await fileStorage.read(fileStorage.pathFromUrl(url, 'html'));

  if (!html) {
    return {
      html: null,
      meta: null
    };
  }

  const metaString = await fileStorage.read(fileStorage.pathFromUrl(url, 'json'));
  const meta = JSON.parse(metaString);

  return {html, meta}
};


exports.prerender = prerender;

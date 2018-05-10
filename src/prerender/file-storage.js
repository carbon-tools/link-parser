const Storage = require('@google-cloud/storage');
const { URL } = require('url');
const storage = Storage({
  projectId: process.env.GCLOUD_PROJECT,
  credentials: require('../../keyfile.json'),
});

const BUCKET_NAME = process.env.GCLOUD_STORAGE_BUCKET;
const bucket = storage.bucket(BUCKET_NAME);

const save = async (path, content) => {
  return new Promise((resolve, reject) => {
    var file = bucket.file(path);
    return file.save(content, err => {
      if (!err) {
        resolve(path);
      } else {
        console.log(path, err);
        reject(err);
      }
    });
  });
};

const get = async (path) => {
  var file = bucket.file(path);
  return file.get().catch(() => null);
};

const read = async (path) => {
  const remoteFile = bucket.file(path);
  return new Promise((resolve, reject) => {
    let fileContents = new Buffer('');
    remoteFile.createReadStream()
        .on('error', function(err) {
          console.log('Reading file error, ', path);
          console.log(err);
          resolve(null);
        })
        .on('end', function() {
          resolve(fileContents.toString());
        })
        .on('data', (chunk) => {
          fileContents = Buffer.concat([fileContents, chunk]);
        });
  });

};

const getByUrl = (url, extension='html') => get(pathFromUrl(url, extension));

const pathFromUrl = (url, extension='html') => {
  const urlObj = new URL(url);


  const searchHash = `${urlObj.search}${urlObj.hash}`
  const pathSuffix = searchHash.length > 0 ?
      `${searchHash}/index.${extension}` :
      `index.${extension}`;

  const path = urlObj.pathname.endsWith('/') ?
    `${urlObj.pathname}${pathSuffix}`   :
    `${urlObj.pathname}/${pathSuffix}`;

  return `${urlObj.hostname}${path}`;
};


exports.save = save;
exports.get = get;
exports.read = read;
exports.getByUrl = getByUrl;
exports.pathFromUrl = pathFromUrl;

const remoteRegex = /(https?:\/\/[^\s]+)/g

function fetchLocal(path) {

}

function fetchRemote(uri) {

}

module.exports = function fetchBase64(uri) {
  return uri.match(remoteRegex) ? fetchRemote(uri) : fetchLocal(uri);
};

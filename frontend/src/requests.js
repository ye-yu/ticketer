const SERVER_URI = "http://127.0.0.1:3001";
const GET = "GET";
const POST = "POST";
const EXPECTED_TYPE = "application/json";

class ServerJsonRequest {

  constructor(uri) {
    this.uri = uri;
  }

  sendGetRequest(paths, params, onSuccess, onError) {
    let fullUri = constructGetUri(this.uri, paths, params);
    let xhttp = new XMLHttpRequest();
    xhttp.open(GET, fullUri);
    xhttp.onreadystatechange = function() {
      if (this.readyState === this.HEADERS_RECEIVED) {
        if (xhttp.getResponseHeader("Content-Type") !== EXPECTED_TYPE) {
          onError(this);
          xhttp.abort();
        }
      } else if (this.readyState === 4) {
        isValidStatusCode(this.status) ? onSuccess(this) : onError(this);
      }
    };
    xhttp.send();
  }

  sendPostRequest(paths, params, onSuccess, onError) {
    let fullUri = constructUri(this.uri, paths);
    let xhttp = new XMLHttpRequest();
    xhttp.open(POST, fullUri);
    xhttp.setRequestHeader("Content-Type", EXPECTED_TYPE);
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4) {
        isValidStatusCode(this.status) ? onSuccess(xhttp) : onError(xhttp);
      }
    };
    xhttp.send(JSON.stringify(params));
  }
}

function isValidStatusCode(code) {
  return code >= 200 && code < 300;
}

function formPath(...paths) {
  return paths.join("/")
}

function formGetParam(params) {
  return Object.entries(params).map(e => e[0] + "=" + e[1]).join("&");
}

function constructGetUri(uri, paths, params) {
    return encodeURI(`${uri}/${paths}?${formGetParam(params)}`);
}

function constructUri(host, path) {
  return `${host}/${path}`;
}

module.exports = {
  Server: new ServerJsonRequest(SERVER_URI),
  register: "register",
  login: "login",
  session: "session"
};

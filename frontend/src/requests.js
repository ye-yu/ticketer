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
    xhttp.withCredentials = true;
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4) {
        let json = {
          status: xhttp.status,
          content: toJson(xhttp.response)
        };
        isValidStatusCode(this.status) ? onSuccess(json) : onError(json);
      }
    };
    xhttp.send();
  }

  sendPostRequest(paths, params, onSuccess, onError) {
    let fullUri = constructUri(this.uri, paths);
    let xhttp = new XMLHttpRequest();
    xhttp.open(POST, fullUri);
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Content-Type", EXPECTED_TYPE);
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4) {
        let json = {
          status: xhttp.status,
          content: toJson(xhttp.response)
        };
        isValidStatusCode(this.status) ? onSuccess(json) : onError(json);
      }
    };
    xhttp.send(JSON.stringify(params));
  }
}

function toJson(str) {
  if (str.length < 2) return {};
  return JSON.parse(str);
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

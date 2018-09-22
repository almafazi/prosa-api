"use strict";
/**
 * Module ini merupakan package Unofficial prosa.ai
 * https://newsapi.org/
 */

const fetch = require("node-fetch"),
  qs = require("querystring"),
  host = "https://api.prosa.ai/v1/";

let X_API_KEY;

class ProsaAPI {
  constructor(apiKey) {
    if (!apiKey) throw new Error("Tidak ada API KEY");
    X_API_KEY = apiKey;
  }

  syntacticAnalyzer(...args) {
    const { params, options, callBack } = splitArgtoFuncAndCB(args);
    const url = createURI("/v1/syntax", params);
    return getResultFromURI(url, options, null, callBack);
  }
}

class ProsaAPIError extends Error {
  constructor(err) {
    super();
    this.name = `ProsaAPIError: ${err.code}`;
    this.message = err.message;
  }
}

/**
 * Convert argument to params, option, and callback
 * @param {Array}   args The arguments to the function
 * @return {Object}
 */
function splitArgtoFuncAndCB(args) {
  let params;
  let options;
  let callBack;
  if (args.length > 1) {
    const possibleCb = args[args.length - 1];
    if ("function" === typeof possibleCb) {
      callBack = possibleCb;
      options = args.length === 3 ? args[1] : undefined;
    } else {
      options = args[1];
    }
    params = args[0];
  } else if ("object" === typeof args[0]) {
    params = args[0];
  } else if ("function" === typeof args[0]) {
    callBack = args[0];
  }
  return {
    params,
    options,
    callBack
  };
}

/**
 * Create URL with endpoint and option
 * @param {String} endpoint
 * @param {Object} [options]
 * @return {String}
 */
function createURI(endpoint, options) {
  const query = qs.stringify(options);
  const baseURL = `${host}${endpoint}`;
  return query ? `${baseURL}?${query}` : baseURL;
}

/**
 * Takes a URL string and returns a Promise
 * @param  {String} url      A URL String
 * @param  {String} apiKey   (Optional) A key to be used for authentication
 * @return {Promise<Buffer>} A Promise containing a Buffer
 */
function getResultFromURI(url, options, apiKey, callBack) {
  let useCallback = "function" === typeof callBack;
  const reqOptions = { headers: {} };
  if (apiKey) {
    reqOptions.headers["X-Api-Key"] = apiKey;
  }
  if (options && options.noCache === true) {
    reqOptions.headers["X-No-Cache"] = "true";
  }
  return fetch(url, reqOptions)
    .then(res => Promise.all([res, res.json()]))
    .then(([res, body]) => {
      if (body.status === "error") throw new ProsaAPIError(body);
      
      if (options && options.showHeaders) {
        if (useCallback) return callBack(null, { headers: res.headers, body });
        return { headers: res.headers, body };
      }
      if (useCallback) return callBack(null, body);
      return body;
    })
    .catch(err => {
      if (useCallback) return callBack(err);
      throw err;
    });
}

module.exports = NewsAPI;

'use strict';

/**
 * Created by wujingtao on 2016/8/24 0024.
 */

var _require = require('./DispatchCenter');

var receive = _require.receive;
var receiveOnce = _require.receiveOnce;
var cancel = _require.cancel;
var send = _require.send;
var dispatchList = _require.dispatchList;

var _require2 = require('./Cache');

var cacheData = _require2.cacheData;
var cache = _require2.cache;
var requestCache = _require2.requestCache;
var getCache = _require2.getCache;
var setCache = _require2.setCache;


module.exports = {
  receive: receive, receiveOnce: receiveOnce, cancel: cancel, send: send, cache: cache, requestCache: requestCache, getCache: getCache, setCache: setCache,
  innerData: { cacheData: cacheData, dispatchList: dispatchList }
};
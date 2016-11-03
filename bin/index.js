'use strict';

/**
 * Created by wujingtao on 2016/8/24 0024.
 */

var _require = require('./DispatchCenter');

var receive = _require.receive;
var receiveOnce = _require.receiveOnce;
var cancel = _require.cancel;
var send = _require.send;


module.exports = {
  receive: receive, receiveOnce: receiveOnce, cancel: cancel, send: send
};
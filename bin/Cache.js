'use strict';

/**
 * Created by wujingtao on 2016/8/24 0024.
 */

var DispatchCenter = require('./DispatchCenter');

/*数据缓存模块*/

/**
 * 保存缓存到的数据,onReceive和onRequest回调方法
 */
var cacheData = {};

/**
 * 缓存指定路径上的数据
 * @param {string} path 缓存哪一条路径上的数据
 * @param  defaultValue 可选参数，默认值
 * @param {function} onReceive 可选参数，当更新缓存数据的时候触发。该回调函数接受两个参数（newValue:新值，oldValue：旧值） 执行完后需要返回一个值来替换要缓存的值
 * @param {function} onRequest 可选参数，当获取缓存数据的时候触发。该回调函数接受一个参数（Value:缓存的值） 执行完后需要返回一个值给调用者
 * @return {undefined}
 */
function cache(path, defaultValue, onReceive, onRequest) {
    if (!(path in cacheData)) {
        //确保不会重复注册
        cacheData[path] = { data: defaultValue, onRequest: onRequest, onReceive: onReceive };
        DispatchCenter.receive('__cache__receive.' + path, function (data) {
            if (onReceive) data = onReceive(data, cacheData[path].data);

            cacheData[path].data = data;
        });
    }
}

/**
 * 请求cache中的数据
 * @param {string} path 请求哪一条路径在缓冲中的值
 * @param {string} callback_path 要把数据发到哪一条路径上
 */
function requestCache(path) {
    var callback_path = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

    var result = void 0;

    if (path in cacheData) {
        result = cacheData[path].data;
        if (cacheData[path].onRequest) result = cacheData[path].onRequest(result);
    }

    DispatchCenter.send(callback_path, result, false);
}

/**
 * 直接获取path所对应cache中的数据
 * @param {string} path 数据传输的路径
 * @return 保存在cache中的数据
 */
function getCache(path) {
    var result = void 0;

    if (path in cacheData) {
        result = cacheData[path].data;
        if (cacheData[path].onRequest) result = cacheData[path].onRequest(result);
    }

    return result;
}

/**
 * 设置path所对应cache中的数据
 * @param {string} path 路径
 * @param data 要设置的数据
 * @return {undefined}
 */
function setCache(path, data) {
    if (path in cacheData) {

        if (cacheData[path].onReceive) data = cacheData[path].onReceive(data, cacheData[path].data);

        cacheData[path].data = data;
    }
}

module.exports = {
    cacheData: cacheData,
    cache: cache,
    requestCache: requestCache,
    getCache: getCache,
    setCache: setCache
};
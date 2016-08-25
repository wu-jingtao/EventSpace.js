/**
 * Created by wujingtao on 2016/8/24 0024.
 */

const DispatchCenter = require('./DispatchCenter');

/*数据缓存模块*/

/**
 * 保存缓存到的数据,和两个回调方法
 */
const cacheData = {};


/**
 * 缓存指定路径上的数据
 * @param {string} address 数据传输的路径
 * @param {function} onReceive 可选参数，当缓存器接收到新的缓存数据的时候触发。该回调函数接受两个参数（newValue:新值，oldValue：旧值） 执行完后需要返回一个值来替换缓存器中的值
 * @param {function} onRequest 可选参数，当缓存器接收到获取缓存器数据请求时触发。该回调函数接受一个参数（Value:缓存的值） 执行完后需要返回一个值来返回给请求者
 * @return {undefined}
 */
function cache(address, onReceive, onRequest) {
    if (!address in cacheData) {  //确保不会重复注册
        cacheData[address] = {data: undefined, onReceive, onRequest};
    }
}


/**
 * 请求cache中的数据
 * @param {string} address 数据传输的路径
 * @param {string} callback_address 回传数据的传输路径
 */
function requestCache(address, callback_address = '') {
    let result;

    if (address in cacheData) {
        result = cacheData[address].data;
        if (cacheData[address].onRequest)
            result = cacheData[address].onRequest(result);
    }

    DispatchCenter.send(callback_address, result);
}

/**
 * 设置缓存中的数据，这个只对内部使用
 * @param {string} address 数据传输的路径
 * @param data 要保存的数据
 */
function receiveCache(address, data) {
    if (address in cacheData) {
        if (cacheData[address].onReceive)
            data = cacheData[address].onReceive(data, cacheData[address].data);

        cacheData[address].data = data;
    }
}

module.exports = {
    cacheData,
    cache,
    requestCache,
    receiveCache
};
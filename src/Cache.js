/**
 * Created by wujingtao on 2016/8/24 0024.
 */

const DispatchCenter = require('./DispatchCenter');

/*数据缓存模块*/

/**
 * 数据缓存类
 */
const cacheData = {};

/**
 * 缓存指定路径上的数据
 * @param {string} address 数据传输的路径
 * @param {function} onReceive 当缓存器接收到新的缓存数据的时候触发。该回调函数接受两个参数（newValue:新值，oldValue：旧值） 执行完后需要返回一个值来替换缓存器中的值
 * @param {function} onRequest 当缓存器接收到获取缓存器数据请求时触发。该回调函数接受一个参数（Value:缓存的值） 执行完后需要返回一个值来返回给请求者
 * @return {undefined}
 */
function cache(address, onReceive, onRequest) {
    DispatchCenter.on('__cache__receive.' + address,data => {     //注册数据接收器
        if(onReceive)
            data = onReceive(data,cacheData[address]);
        cacheData[address] = data;
    });

    DispatchCenter.on('__cache__request.'+ address,callback_address => {     //注册请求接受器

        let data = cacheData[address];

        if(onRequest)
            data = onRequest(data);

        DispatchCenter.send(callback_address,data);
    });
}

/**
 * 请求cache中的数据
 * @param {string} address 数据传输的路径
 * @param {string} callback_address 回传数据的传输路径
 */
function requestCache(address,callback_address) {
    DispatchCenter.send('__cache__request.' + address,callback_address);
}

module.exports = {
    cacheData,
    cache,
    requestCache
};
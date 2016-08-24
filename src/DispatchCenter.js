/**
 * Created by wujingtao on 2016/8/24 0024.
 */

/*数据分发中心*/

/**
 * 代表地址命名空间所对应的每一个分发层级
 */
class DispatchLevel {
    levelName = '';         //当前层级的名字
    receiver = new Set();  //当前层级的接收器
    children = new Map();  //子层级

    /**
     * @param {string} levelName 当前层级的名字
     */
    constructor(levelName = '') {
        this.levelName = levelName;
    }
}

const dispatchList = new DispatchLevel('root');

/**
 * 注册数据接收器
 * @param {string} address 接收地址(通过‘.’来分割层级)
 * @param {function} receiver 接收到数据后执行的回调函数 ,回调函数接受两个参数（data:数据，address:发送者指定的路径）
 * @return {function} 返回 receiver
 */
function on(address, receiver) {

    if (typeof receiver !== 'function')  /*验证数据类型*/
        throw new Error('receiver is not a function');

    const address_level = address.split('.');    //分割地址的命名空间

    let level = dispatchList.children;

    address_level.forEach((item, index) => {  //循环每一级命名空间

        if (!level.has(item)) {
            level.set(item, new DispatchLevel(item));
        }

        const currentLevel = level.get(item);

        if (index === address_level.length - 1)
            currentLevel.receiver.add(receiver);

        level = currentLevel.children;
    });

    return receiver;
}

/**
 * 注销数据接收器
 * @param {string} address 接收地址(通过‘.’来分割层级)
 * @return {undefined}
 */
function off(address) {
    const address_level = address.split('.');    //分割地址的命名空间

    let level = dispatchList.children;

    address_level.some((item, index) => {
        const currentLevel = level.get(item);

        if (currentLevel == null) return true;  //跳出循环

        if (index === address_level.length - 1) {
            currentLevel.receiver.clear();
            currentLevel.children.clear();
            return true;  //跳出循环
        }

        level = currentLevel;
    });
}

/**
 * 向指定地址发送消息
 * @param {string} address 接收地址(通过‘.’来分割层级)
 * @param data 要发送的数据
 * @return {undefined}
 */
function send(address, data) {
    const address_level = address.split('.');    //分割地址的命名空间

    let level = dispatchList.children;

    const receiver = [];

    address_level.some((item, index) => { //循环每一个层级

        const currentLevel = level.get(item);   //获取当前层级

        if (currentLevel == null) return true;  //跳出循环

        receiver.push(...currentLevel.receiver);

        level = currentLevel.children;
    });

    receiver.forEach(item => item(data, address));
}

export default {
    on,
    off,
    send: function (address, data) {
        send(address, data);
        send('__cache__receive.' + address, data);  //給缓存再发一份
    },
    dispatchList
}
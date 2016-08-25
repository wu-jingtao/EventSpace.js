/**
 * Created by wujingtao on 2016/8/24 0024.
 */

/*数据分发中心*/

/**
 * 代表地址命名空间所对应的每一个分发层级
 */
class DispatchLevel {
    /**
     * @param {string} levelName 当前层级的名字
     */
    constructor(levelName = '') {
        this.levelName = levelName; //当前层级的名字
        this.receiver = new Set();  //当前层级的接收器
        this.children = new Map();  //子层级
    }
}

const dispatchList = new DispatchLevel('root');

/**
 * 注册数据接收器
 * @param {string} address 接收地址.(字符串通过‘.’来分割层级)
 * @param {function} receiver 接收到数据后执行的回调函数 ,回调函数接受两个参数（data:数据，address:接收到的地址字符串）
 * @return {function} 返回 receiver
 */
function receive(address='', receiver) {

    if (typeof receiver !== 'function')  /*验证数据类型*/
        throw new Error('receiver is not a function');

    address = address.split('.');   //分割地址的命名空间

    let level = dispatchList.children;

    address.forEach((item, index) => {  //循环每一级命名空间,找到对应的层级

        if (!level.has(item)) {
            level.set(item, new DispatchLevel(item));
        }

        const currentLevel = level.get(item);

        if (index === address.length - 1)
            currentLevel.receiver.add(receiver);

        level = currentLevel.children;
    });

    return receiver;
}

/**
 * 注销数据接收器
 * @param {string} address 接收地址.(字符串通过‘.’来分割层级)
 * @return {undefined}
 */
function cancel(address='') {

    let level = dispatchList.children;

    address = address.split('.');   //分割地址的命名空间

    address.some((item, index) => {
        const currentLevel = level.get(item);

        if (currentLevel == null) return true;  //跳出循环

        if (index === address.length - 1) {
            currentLevel.receiver.clear();
            currentLevel.children.clear();
        }

        level = currentLevel.children;
    });
}

//辅助方法，用于获取子级所有的接收器方法
function getAllChildrenReceiver(targetLevel) {
    const receiver = [...targetLevel.receiver];

    for(let item of targetLevel.children.values()){
        receiver.push(...getAllChildrenReceiver(item));
    }

    return receiver;
}

/**
 * 向指定地址发送消息
 * @param {string} address 接收地址(通过‘.’来分割层级)
 * @param data 要发送的数据
 * @return {undefined}
 */
function send(address,data) {

    let level = dispatchList.children;

    const addressLevel = address.split('.');   //分割地址的命名空间

    let targetLevel = null;

    addressLevel.some((item, index) => { //循环每一个层级

        const currentLevel = level.get(item);   //获取当前层级

        if (currentLevel == null) return true;  //跳出循环

        if (index === addressLevel.length - 1)
            targetLevel = currentLevel; //获取目标层级

        level = currentLevel.children;
    });

    if(targetLevel){
        const receiver = getAllChildrenReceiver(targetLevel);
        receiver.forEach(item => item(data, address));
    }
}

module.exports = {receive,cancel,dispatchList,
    send(address,data){
        send(address, data);
        send('__cache__receive.' + address, data);  //給缓存再发一份
    }
};


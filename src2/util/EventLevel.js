/**
 * Created by wujingtao on 2016/12/17 0017.
 */

export default class EventLevel{
    receiver = [];  //当前层级的接收器
    children = {};  //子层级

    addReceiver(receiver){  //添加新的监听器
        if (typeof receiver !== 'function')  /*验证数据类型*/
            throw new Error('receiver is not a function');
        this.receiver.push(receiver);
    }
}
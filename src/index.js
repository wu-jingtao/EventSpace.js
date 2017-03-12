/**
 * Created by 吴劲韬 on 2017/3/12.
 */

var EventSpace = require('./EventSpace');

//导出一个全局事件空间和一个事件空间类
module.exports = new EventSpace();
module.exports.EventSpace = EventSpace;

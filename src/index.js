/**
 * Created by wujingtao on 2016/8/24 0024.
 */


const {receive,cancel,send,dispatchList}  = require('./DispatchCenter');
const {cacheData,cache,requestCache,getCache}  = require('./Cache');

module.exports = {
    receive,cancel,send,cache,requestCache,getCache,
    innerData:{cacheData,dispatchList}
};

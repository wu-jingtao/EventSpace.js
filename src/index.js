/**
 * Created by wujingtao on 2016/8/24 0024.
 */


const {on,off,send,dispatchList}  = require('./DispatchCenter');
const {cacheData,cache,requestCache}  = require('./Cache');

module.exports = {
    on,off,send,cache,requestCache,
    innerData:{cacheData,dispatchList}
};

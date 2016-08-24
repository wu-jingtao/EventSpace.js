/**
 * Created by wujingtao on 2016/8/24 0024.
 */

/*on方法的装饰器函数形式*/

export default function receive(target, name, descriptor) {
    console.log(target,name,descriptor);
}
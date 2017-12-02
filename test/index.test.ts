import expect = require('expect.js');
import { receive, receiveOnce, cancel, trigger, has } from '../src';

beforeEach('清除所有注册过的监听器', function () {
    cancel();
});

it('测试 receive', function () {

    const result: number[] = [];

    receive('a', (data) => result.push(data));
    receive('a.b', (data) => result.push(data));
    receive('a.b.c', (data) => result.push(data));

    receive(['a'], (data) => result.push(data));
    receive(['a', 'b'], (data) => result.push(data));
    receive(['a', 'b', 'c'], (data) => result.push(data));

    trigger('a', 1);
    trigger('a.b', 2);
    trigger('a.b.c', 3);
    trigger('a.b.c.d', 4);

    trigger(['a'], 1);
    trigger(['a', 'b'], 2);
    trigger(['a', 'b', 'c'], 3);
    trigger(['a', 'b', 'c', 'd'], 4);

    expect(result).to.eql([
        1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3,
        1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3
    ]);
});

it('测试 receiveOnce', function () {

    const result: number[] = [];

    receiveOnce('a', (data) => result.push(data));
    receiveOnce('a.b', (data) => result.push(data));
    receiveOnce('a.b.c', (data) => result.push(data));

    receiveOnce(['a'], (data) => result.push(data));
    receiveOnce(['a', 'b'], (data) => result.push(data));
    receiveOnce(['a', 'b', 'c'], (data) => result.push(data));

    trigger('a', 1);
    trigger('a.b', 2);
    trigger('a.b.c', 3);
    trigger('a.b.c.d', 4);

    trigger(['a'], 1);
    trigger(['a', 'b'], 2);
    trigger(['a', 'b', 'c'], 3);
    trigger(['a', 'b', 'c', 'd'], 4);

    expect(result).to.eql([1, 1, 1, 1, 1, 1]);
});

it('测试 trigger 不触发子级', function () {
    const result: number[] = [];

    receive('a', (data) => result.push(data));
    receive('a.b', (data) => result.push(data));
    receive('a.b.c', (data) => result.push(data));

    trigger('a', 1, false);
    trigger('a.b', 2, false);
    trigger('a.b.c', 3, false);
    trigger('a.b.c.d', 4, false);

    trigger(['a'], 1, false);
    trigger(['a', 'b'], 2, false);
    trigger(['a', 'b', 'c'], 3, false);
    trigger(['a', 'b', 'c', 'd'], 4, false);

    expect(result).to.eql([
        1, 2, 3,
        1, 2, 3
    ]);
});

describe('测试 cancel', function () {
    it('只清除指定级别的监听器（不清除子级）', function () {
        const result: number[] = [];

        receive('a', (data) => result.push(data));
        receiveOnce('a.b', (data) => result.push(data));
        receive('a.b.c', (data) => result.push(data));

        cancel('a', false);

        trigger(['a'], 1);
        trigger(['a', 'b'], 2);
        trigger(['a', 'b', 'c'], 3);
        trigger(['a', 'b', 'c', 'd'], 4);

        expect(result).to.eql([1, 1, 2, 3]);
    });

    it('清除指定级别的特定事件监听器', function () {
        const result: number[] = [];

        function func(data: any) { result.push(data) }
        receive('a', func);

        receive('a', (data) => result.push(data));
        receiveOnce('a.b', (data) => result.push(data));
        receive('a.b.c', (data) => result.push(data));

        cancel('a', func);

        trigger(['a'], 1);
        trigger(['a', 'b'], 2);
        trigger(['a', 'b', 'c'], 3);
        trigger(['a', 'b', 'c', 'd'], 4);

        expect(result).to.eql([1, 1, 1, 2, 3]);
    });
});

describe('测试 has', function () {
    it('判断指定级别，以及其子级，是否注册的有事件监听器', function () {
        receive('a.b.c', () => { });

        expect(has('a')).to.be.ok();
        expect(has('a.b')).to.be.ok();
        expect(has('a.b.c')).to.be.ok();
        expect(has('a.b.c.d')).to.not.be.ok();
    });

    it('判断指定级别，不包括其子级，是否注册的有事件监听器', function () {
        receive('a.b.c', () => { });

        expect(has('a', false)).to.not.be.ok();
        expect(has('a.b', false)).to.not.be.ok();
        expect(has('a.b.c', false)).to.be.ok();
        expect(has('a.b.c.d', false)).to.not.be.ok();
    });

    it('判断指定级别是否注册的有特定事件监听器', function () {
        function test() { }
        receive('a', test);

        receive('a', () => { });
        receive('a.b', () => { });
        receive('a.b.c', () => { });

        expect(has('a', test)).to.be.ok();
        expect(has('a.b', test)).to.not.be.ok();
        expect(has('a.b.c', test)).to.not.be.ok();
        expect(has('a.b.c.d', test)).to.not.be.ok();
    });
});

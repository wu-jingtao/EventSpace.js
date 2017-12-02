import expect = require('expect.js');
import { receive, receiveOnce, cancel, cancelReverse, trigger, triggerReverse, has, hasReverse } from '../src';

beforeEach('清除所有注册过的监听器', function () {
    cancel();
});

it('测试 receive', function () {

    const result: number[] = [];

    receive([], (data) => result.push(data));
    receive('a', (data) => result.push(data));
    receive('a.b', (data) => result.push(data));
    receive('a.b.c', (data) => result.push(data));

    receive([], (data) => result.push(data));
    receive(['a'], (data) => result.push(data));
    receive(['a', 'b'], (data) => result.push(data));
    receive(['a', 'b', 'c'], (data) => result.push(data));

    trigger([], 1);
    trigger('a', 2);
    trigger('a.b', 3);
    trigger('a.b.c', 4);
    trigger('a.b.c.d', 5);

    trigger([], 1);
    trigger(['a'], 2);
    trigger(['a', 'b'], 3);
    trigger(['a', 'b', 'c'], 4);
    trigger(['a', 'b', 'c', 'd'], 5);

    expect(result).to.eql([
        1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4,
        1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4
    ]);
});

it('测试 receiveOnce', function () {

    const result: number[] = [];

    receiveOnce([], (data) => result.push(data));
    receiveOnce('a', (data) => result.push(data));
    receiveOnce('a.b', (data) => result.push(data));
    receiveOnce('a.b.c', (data) => result.push(data));

    receiveOnce([], (data) => result.push(data));
    receiveOnce(['a'], (data) => result.push(data));
    receiveOnce(['a', 'b'], (data) => result.push(data));
    receiveOnce(['a', 'b', 'c'], (data) => result.push(data));

    trigger([], 1);
    trigger('a', 2);
    trigger('a.b', 3);
    trigger('a.b.c', 4);
    trigger('a.b.c.d', 5);

    trigger([], 1);
    trigger(['a'], 2);
    trigger(['a', 'b'], 3);
    trigger(['a', 'b', 'c'], 4);
    trigger(['a', 'b', 'c', 'd'], 5);

    expect(result).to.eql([1, 1, 1, 1, 1, 1, 1, 1]);
});

it('测试 trigger 不触发子级', function () {
    const result: number[] = [];

    receive([], (data) => result.push(data));
    receive('a', (data) => result.push(data));
    receive('a.b', (data) => result.push(data));
    receive('a.b.c', (data) => result.push(data));

    trigger([], 1, false);
    trigger('a', 2, false);
    trigger('a.b', 3, false);
    trigger('a.b.c', 4, false);
    trigger('a.b.c.d', 5, false);

    trigger([], 1, false);
    trigger(['a'], 2, false);
    trigger(['a', 'b'], 3, false);
    trigger(['a', 'b', 'c'], 4, false);
    trigger(['a', 'b', 'c', 'd'], 5, false);

    expect(result).to.eql([
        1, 2, 3, 4,
        1, 2, 3, 4
    ]);
});

it('测试 triggerReverse', function () {
    const result: number[] = [];

    receive([], (data) => result.push(data));
    receive('a', (data) => result.push(data));
    receive('a.b', (data) => result.push(data));
    receive('a.b.c', (data) => result.push(data));

    triggerReverse([], 1);
    triggerReverse('a', 2);
    triggerReverse('a.b', 3);
    triggerReverse('a.b.c', 4);
    triggerReverse('a.b.c.d', 5);

    triggerReverse([], 1);
    triggerReverse(['a'], 2);
    triggerReverse(['a', 'b'], 3);
    triggerReverse(['a', 'b', 'c'], 4);
    triggerReverse(['a', 'b', 'c', 'd'], 5);

    expect(result).to.eql([
        1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5,
        1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5
    ]);
});

describe('测试 cancel', function () {
    it('只清除指定级别的监听器（不清除子级）', function () {
        const result: number[] = [];

        receive([], (data) => result.push(data));
        receive('a', (data) => result.push(data));
        receiveOnce('a.b', (data) => result.push(data));
        receive('a.b.c', (data) => result.push(data));

        cancel('a', false);

        trigger([], 1);
        trigger(['a'], 2);
        trigger(['a', 'b'], 3);
        trigger(['a', 'b', 'c'], 4);
        trigger(['a', 'b', 'c', 'd'], 5);

        expect(result).to.eql([1, 1, 1, 2, 3, 4]);
    });

    it('清除指定级别的特定事件监听器', function () {
        const result: number[] = [];

        function func(data: any) { result.push(data) }
        receive('a', func);

        receive([], (data) => result.push(data));
        receive('a', (data) => result.push(data));
        receiveOnce('a.b', (data) => result.push(data));
        receive('a.b.c', (data) => result.push(data));

        cancel('a', func);

        trigger([], 1);
        trigger(['a'], 2);
        trigger(['a', 'b'], 3);
        trigger(['a', 'b', 'c'], 4);
        trigger(['a', 'b', 'c', 'd'], 5);

        expect(result).to.eql([1, 1, 1, 1, 2, 2, 3, 4]);
    });
});

it('测试 cancelReverse', function () {
    const result: number[] = [];

    receive([], (data) => result.push(data));
    receive('a', (data) => result.push(data));
    receiveOnce('a.b', (data) => result.push(data));
    receive('a.b.c', (data) => result.push(data));

    cancelReverse('a.b');

    trigger([], 1);
    trigger(['a'], 2);
    trigger(['a', 'b'], 3);
    trigger(['a', 'b', 'c'], 4);
    trigger(['a', 'b', 'c', 'd'], 5);

    expect(result).to.eql([1, 2, 3, 4]);
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

it('测试 hasReverse', function () {
    receive('a.b.c', () => { });
    
    expect(hasReverse([])).to.not.be.ok();
    expect(hasReverse('a')).to.not.be.ok();
    expect(hasReverse('a.b')).to.not.be.ok();
    expect(hasReverse('a.b.c')).to.be.ok();
    expect(hasReverse('a.b.c.d')).to.be.ok();
});
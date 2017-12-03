import expect = require('expect.js');
import {
    receive,
    receiveOnce,
    cancel,
    cancelDescendants,
    cancelAncestors,
    trigger,
    triggerDescendants,
    triggerAncestors,
    has,
    hasDescendants,
    hasAncestors
} from '../src';

beforeEach('清除所有注册过的监听器', function () {
    cancelDescendants();
});

it('测试 receive 和 trigger', function () {
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
        1, 1, 2, 2, 3, 3, 4, 4,
        1, 1, 2, 2, 3, 3, 4, 4
    ]);
});

it('测试 receiveOnce 和 trigger', function () {
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

    expect(result).to.eql([1, 1, 2, 2, 3, 3, 4, 4]);
});

it('测试 triggerDescendants', function () {
    const result: number[] = [];

    receive([], (data) => result.push(data));
    receive('a', (data) => result.push(data));
    receive('a.b', (data) => result.push(data));
    receive('a.b.c', (data) => result.push(data));

    triggerDescendants([], 1);
    triggerDescendants('a', 2);
    triggerDescendants('a.b', 3);
    triggerDescendants('a.b.c', 4);
    triggerDescendants('a.b.c.d', 5);

    triggerDescendants([], 1, false);
    triggerDescendants(['a'], 2, false);
    triggerDescendants(['a', 'b'], 3, false);
    triggerDescendants(['a', 'b', 'c'], 4, false);
    triggerDescendants(['a', 'b', 'c', 'd'], 5, false);

    expect(result).to.eql([
        1, 1, 1, 1, 2, 2, 2, 3, 3, 4,
        1, 1, 1, 2, 2, 3
    ]);
});

it('测试 triggerAncestors', function () {
    const result: number[] = [];

    receive([], (data) => result.push(data));
    receive('a', (data) => result.push(data));
    receive('a.b', (data) => result.push(data));
    receive('a.b.c', (data) => result.push(data));

    triggerAncestors([], 1);
    triggerAncestors('a', 2);
    triggerAncestors('a.b', 3);
    triggerAncestors('a.b.c', 4);
    triggerAncestors('a.b.c.d', 5);

    triggerAncestors([], 1, false);
    triggerAncestors(['a'], 2, false);
    triggerAncestors(['a', 'b'], 3, false);
    triggerAncestors(['a', 'b', 'c'], 4, false);
    triggerAncestors(['a', 'b', 'c', 'd'], 5, false);

    expect(result).to.eql([
        1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5,
        2, 3, 3, 4, 4, 4, 5, 5, 5, 5
    ]);
});

it('测试 cancel', function () {
    const result: number[] = [];
    const func = (data: any) => result.push(data);

    receive([], (data) => result.push(data));
    receive('a', (data) => result.push(data));
    receive('a', func);
    receive('a.b', (data) => result.push(data));
    receiveOnce('a.b', (data) => result.push(data));
    receive('a.b.c', (data) => result.push(data));

    cancel('a', func);
    cancel('a.b');

    trigger([], 1);
    trigger(['a'], 2);
    trigger(['a', 'b'], 3);
    trigger(['a', 'b', 'c'], 4);
    trigger(['a', 'b', 'c', 'd'], 5);

    expect(result).to.eql([1, 2, 4]);
});

it('测试 cancelDescendants', function () {
    const result: number[] = [];

    receive([], (data) => result.push(data));
    receive('a', (data) => result.push(data));
    receiveOnce('a.b', (data) => result.push(data));
    receive('a.b.c', (data) => result.push(data));

    cancelDescendants('a.b');

    trigger([], 1);
    trigger(['a'], 2);
    trigger(['a', 'b'], 3);
    trigger(['a', 'b', 'c'], 4);
    trigger(['a', 'b', 'c', 'd'], 5);

    cancelDescendants([], false);

    trigger([], 1);
    trigger(['a'], 2);
    trigger(['a', 'b'], 3);
    trigger(['a', 'b', 'c'], 4);
    trigger(['a', 'b', 'c', 'd'], 5);

    expect(result).to.eql([
        1, 2,
        1
    ]);
});

it('测试 cancelAncestors', function () {
    const result: number[] = [];

    receive([], (data) => result.push(data));
    receive('a', (data) => result.push(data));
    receiveOnce('a.b', (data) => result.push(data));
    receive('a.b.c', (data) => result.push(data));

    cancelAncestors([]);

    trigger([], 1);
    trigger(['a'], 2);
    trigger(['a', 'b'], 3);
    trigger(['a', 'b', 'c'], 4);
    trigger(['a', 'b', 'c', 'd'], 5);

    cancelAncestors('a.b.c', false);

    trigger([], 1);
    trigger(['a'], 2);
    trigger(['a', 'b'], 3);
    trigger(['a', 'b', 'c'], 4);
    trigger(['a', 'b', 'c', 'd'], 5);

    expect(result).to.eql([
        2, 3, 4,
        4
    ]);
});

it('测试 has', function () {
    const func = () => { };
    receive('a.b', func);
    receive('a.b.c', () => { });

    expect(has('a')).to.not.be.ok();
    expect(has('a.b')).to.be.ok();
    expect(has('a.b', func)).to.be.ok();
    expect(has('a.b.c')).to.be.ok();
    expect(has('a.b.c', func)).to.not.be.ok();
    expect(has('a.b.c.d')).to.not.be.ok();
});

it('测试 hasDescendants', function () {
    receive([], () => { });
    receive('a', () => { });
    receive('a.b', () => { });
    receive('a.b.c', () => { });

    expect(hasDescendants([])).to.be.ok();
    expect(hasDescendants('a')).to.be.ok();
    expect(hasDescendants('a.b')).to.be.ok();
    expect(hasDescendants('a.b.c')).to.be.ok();
    expect(hasDescendants('a.b.c.d')).to.not.be.ok();

    expect(hasDescendants([], false)).to.be.ok();
    expect(hasDescendants('a', false)).to.be.ok();
    expect(hasDescendants('a.b', false)).to.be.ok();
    expect(hasDescendants('a.b.c', false)).to.not.be.ok();
    expect(hasDescendants('a.b.c.d', false)).to.not.be.ok();
});

it('测试 hasAncestors', function () {
    receive([], () => { });
    receive('a', () => { });
    receive('a.b', () => { });
    receive('a.b.c', () => { });

    expect(hasAncestors([])).to.be.ok();
    expect(hasAncestors('a')).to.be.ok();
    expect(hasAncestors('a.b')).to.be.ok();
    expect(hasAncestors('a.b.c')).to.be.ok();
    expect(hasAncestors('a.b.c.d')).to.be.ok();

    expect(hasAncestors([], false)).to.not.be.ok();
    expect(hasAncestors('a', false)).to.be.ok();
    expect(hasAncestors('a.b', false)).to.be.ok();
    expect(hasAncestors('a.b.c', false)).to.be.ok();
    expect(hasAncestors('a.b.c.d', false)).to.be.ok();
});

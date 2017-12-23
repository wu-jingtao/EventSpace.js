import expect = require('expect.js');
import EventSpace from '../src/EventSpace';

const es = new EventSpace();

beforeEach('清除所有注册过的监听器', function () {
    es.off();
    es.children.clear();
});

it('测试属性', function () {
    es.on(function () { });
    es.get('').on(function () { });
    es.get([]).on(function () { });
    es.get(['d']).on(function () { });
    es.get(['d', 'e']).on(function () { });
    es.get(['d', 'e', 'f']).on(function () { });

    //测试 parent 属性
    expect(es.parent).to.be(undefined);
    expect(es.get('').parent).to.be(undefined);
    expect(es.get([]).parent).to.be(undefined);
    expect(es.get('d').parent).to.be(es);
    expect(es.get('d.e').parent).to.be(es.get('d'));
    expect(es.get('d.e.f').parent).to.be(es.get('d.e'));

    //测试 root 属性
    expect(es.root).to.be(es);
    expect(es.get('').root).to.be(es);
    expect(es.get([]).root).to.be(es);
    expect(es.get('d').root).to.be(es);
    expect(es.get('d.e').root).to.be(es);
    expect(es.get('d.e.f').root).to.be(es);

    //测试 children 属性
    expect(es.children.size).to.be(1);
    expect(es.children.has('d')).to.be.ok();
    expect(es.get('').children.size).to.be(1);
    expect(es.get('').children.has('d')).to.be.ok();
    expect(es.get([]).children.size).to.be(1);
    expect(es.get([]).children.has('d')).to.be.ok();
    expect(es.get('d').children.size).to.be(1);
    expect(es.get('d').children.has('e')).to.be.ok();
    expect(es.get('d.e').children.size).to.be(1);
    expect(es.get('d.e').children.has('f')).to.be.ok();
    expect(es.get('d.e.f').children.size).to.be(0);

    //测试 name 属性
    expect(es.name).to.be('');
    expect(es.get('').name).to.be('');
    expect(es.get([]).name).to.be('');
    expect(es.get('d').name).to.be('d');
    expect(es.get('d.e').name).to.be('e');
    expect(es.get('d.e.f').name).to.be('f');

    //测试 fullName 属性
    expect(es.fullName).to.be.eql([]);
    expect(es.get('').fullName).to.be.eql([]);
    expect(es.get([]).fullName).to.be.eql([]);
    expect(es.get('d').fullName).to.be.eql(['d']);
    expect(es.get('d.e').fullName).to.be.eql(['d', 'e']);
    expect(es.get('d.e.f').fullName).to.be.eql(['d', 'e', 'f']);

    //测试 listenerCount 属性
    expect(es.listenerCount).to.be(3);
    expect(es.get('d').listenerCount).to.be(1);
    expect(es.get('d.e').listenerCount).to.be(1);
    expect(es.get('d.e.f').listenerCount).to.be(1);

    //测试 ancestorsListenerCount 属性
    expect(es.ancestorsListenerCount).to.be(0);
    expect(es.get('d').ancestorsListenerCount).to.be(3);
    expect(es.get('d.e').ancestorsListenerCount).to.be(4);
    expect(es.get('d.e.f').ancestorsListenerCount).to.be(5);

    //测试 descendantsListenerCount 属性
    expect(es.descendantsListenerCount).to.be(3);
    expect(es.get('d').descendantsListenerCount).to.be(2);
    expect(es.get('d.e').descendantsListenerCount).to.be(1);
    expect(es.get('d.e.f').descendantsListenerCount).to.be(0);

    //测试清空监听器后删除 data 属性
    es.data = 1;
    es.get('d').data = 1;
    es.get('d.e').data = 1;
    es.get('d.e.f').data = 1;
    es.offDescendants();

    expect(es.data).to.be(undefined);
    expect(es.get('d').data).to.be(undefined);
    expect(es.get('d.e').data).to.be(undefined);
    expect(es.get('d.e.f').data).to.be(undefined);
});

describe('测试工具方法', function () {

    it('测试 _clearNoLongerUsedLayer', function () {
        es.get('a.b.c.d.e');
        expect(es.children.size).to.be(1);
        expect(es.children.has('a')).to.be.ok();

        (<any>es)._clearNoLongerUsedLayer();
        expect(es.children.size).to.be(0);
    });

    it('测试 forEachDescendants 与 forEachAncestors', function () {
        const result: any[] = [];

        es.get('a.b.c.d.e');

        es.forEachDescendants(layer => { result.push(layer.name) });
        es.forEachDescendants(layer => { result.push(layer.name) }, true);
        es.forEachDescendants(layer => { result.push(layer.name); return layer.name === 'c' });

        es.get('a.b.c.d.e').forEachAncestors(layer => { result.push(layer.name) });
        es.get('a.b.c.d.e').forEachAncestors(layer => { result.push(layer.name) }, true);
        es.get('a.b.c.d.e').forEachAncestors(layer => { result.push(layer.name); return layer.name === 'c' });

        expect(result).to.be.eql([
            'a', 'b', 'c', 'd', 'e',
            '', 'a', 'b', 'c', 'd', 'e',
            'a', 'b', 'c',

            'd', 'c', 'b', 'a', '',
            'e', 'd', 'c', 'b', 'a', '',
            'd', 'c'
        ]);
    });

    it('测试 mapDescendants 与 mapAncestors', function () {
        es.get('a.b.c');

        expect(es.mapDescendants()).to.be.eql([
            es.get('a'),
            es.get('a.b'),
            es.get('a.b.c')
        ]);

        expect(es.mapDescendants(undefined, true)).to.be.eql([
            es,
            es.get('a'),
            es.get('a.b'),
            es.get('a.b.c')
        ]);

        expect(es.mapDescendants(layer => layer.name)).to.be.eql([
            'a', 'b', 'c'
        ]);

        expect(es.get('a.b.c').mapAncestors()).to.be.eql([
            es.get('a.b'),
            es.get('a'),
            es
        ]);

        expect(es.get('a.b.c').mapAncestors(undefined, true)).to.be.eql([
            es.get('a.b.c'),
            es.get('a.b'),
            es.get('a'),
            es
        ]);

        expect(es.get('a.b.c').mapAncestors(layer => layer.name)).to.be.eql([
            'b', 'a', ''
        ]);
    });

    it('测试 reduceDescendants 与 reduceAncestors', function () {
        es.get('a.b.c');

        expect(es.reduceDescendants((pre, layer) => pre + '.' + layer.name, '')).to.be('.a.b.c');
        expect(es.reduceDescendants((pre, layer) => pre + '.' + layer.name, '', true)).to.be('..a.b.c');

        expect(es.get('a.b.c').reduceAncestors((pre, layer) => pre + '.' + layer.name, '')).to.be('.b.a.');
        expect(es.get('a.b.c').reduceAncestors((pre, layer) => pre + '.' + layer.name, '', true)).to.be('.c.b.a.');
    });

    it('测试 findDescendant 与 findAncestor', function () {
        es.get('a.b.c');

        expect(es.findDescendant(layer => layer.name === 'b')).to.be(es.get('a.b'));
        expect(es.findDescendant(layer => layer.name === '')).to.be(undefined);
        expect(es.findDescendant(layer => layer.name === '', true)).to.be(es);

        expect(es.get('a.b.c').findAncestor(layer => layer.name === 'b')).to.be(es.get('a.b'));
        expect(es.get('a.b.c').findAncestor(layer => layer.name === 'c')).to.be(undefined);
        expect(es.get('a.b.c').findAncestor(layer => layer.name === 'c', true)).to.be(es.get('a.b.c'));
    });
});

describe('测试事件监听器', function () {

    it('测试 on 和 trigger', function () {
        const result: number[] = [];

        es.get([]).on((data) => result.push(data));
        es.get('a').on((data) => result.push(data));
        es.get('a.b').on((data) => result.push(data));
        es.get('a.b.c').on((data) => result.push(data));

        es.get([]).trigger(1);
        es.get('a').trigger(2);
        es.get('a.b').trigger(3);
        es.get('a.b.c').trigger(4);
        es.get('a.b.c.d').trigger(5);

        expect(result).to.eql([
            1, 2, 3, 4
        ]);
    });

    it('测试 once 和 trigger', function () {
        const result: number[] = [];

        es.get([]).once((data) => result.push(data));
        es.get('a').once((data) => result.push(data));
        es.get('a.b').once((data) => result.push(data));
        es.get('a.b.c').once((data) => result.push(data));

        es.get([]).trigger(1);
        es.get('a').trigger(2);
        es.get('a.b').trigger(3);
        es.get('a.b.c').trigger(4);
        es.get('a.b.c.d').trigger(5);

        es.get([]).trigger(1);
        es.get('a').trigger(2);
        es.get('a.b').trigger(3);
        es.get('a.b.c').trigger(4);
        es.get('a.b.c.d').trigger(5);

        expect(result).to.eql([
            1, 2, 3, 4
        ]);
    });

    it('测试 triggerDescendants', function () {
        const result: any[] = [];

        es.get([]).on((data, layer) => result.push(data, layer.name));
        es.get('a').on((data, layer) => result.push(data, layer.name));
        es.get('a.b').on((data, layer) => result.push(data, layer.name));
        es.get('a.b.c').on((data, layer) => result.push(data, layer.name));

        es.get([]).triggerDescendants(1);
        es.get('a').triggerDescendants(2);
        es.get('a.b').triggerDescendants(3);
        es.get('a.b.c').triggerDescendants(4);
        es.get('a.b.c.d').triggerDescendants(5);

        es.get([]).triggerDescendants(1, false);
        es.get('a').triggerDescendants(2, false);
        es.get('a.b').triggerDescendants(3, false);
        es.get('a.b.c').triggerDescendants(4, false);
        es.get('a.b.c.d').triggerDescendants(5, false);

        expect(result).to.eql([
            1, '', 1, 'a', 1, 'b', 1, 'c', 2, 'a', 2, 'b', 2, 'c', 3, 'b', 3, 'c', 4, 'c',
            1, 'a', 1, 'b', 1, 'c', 2, 'b', 2, 'c', 3, 'c'
        ]);
    });

    it('测试 triggerAncestors', function () {
        const result: any[] = [];

        es.get([]).on((data, layer) => result.push(data, layer.name));
        es.get('a').on((data, layer) => result.push(data, layer.name));
        es.get('a.b').on((data, layer) => result.push(data, layer.name));
        es.get('a.b.c').on((data, layer) => result.push(data, layer.name));

        es.get([]).triggerAncestors(1);
        es.get('a').triggerAncestors(2);
        es.get('a.b').triggerAncestors(3);
        es.get('a.b.c').triggerAncestors(4);
        es.get('a.b.c.d').triggerAncestors(5);

        es.get([]).triggerAncestors(1, false);
        es.get('a').triggerAncestors(2, false);
        es.get('a.b').triggerAncestors(3, false);
        es.get('a.b.c').triggerAncestors(4, false);
        es.get('a.b.c.d').triggerAncestors(5, false);

        expect(result).to.eql([
            1, '', 2, 'a', 2, '', 3, 'b', 3, 'a', 3, '', 4, 'c', 4, 'b', 4, 'a', 4, '', 5, 'c', 5, 'b', 5, 'a', 5, '',
            2, '', 3, 'a', 3, '', 4, 'b', 4, 'a', 4, '', 5, 'c', 5, 'b', 5, 'a', 5, ''
        ]);
    });

    it('测试 off', function () {
        const result: number[] = [];
        const func = (data: any) => result.push(data);

        es.on((data) => result.push(data));
        es.get('a').on((data) => result.push(data));
        es.on(func);

        es.off(func);
        es.get('a').off();

        es.trigger(1);
        es.get('a').trigger(2);

        expect(result).to.eql([1]);
    });

    it('测试 offDescendants', function () {
        const result: any[] = [];
        const func = (data: any, layer: any) => result.push(data, layer.name);

        es.get([]).on((data, layer) => result.push(data, layer.name));
        es.get('a').on(func);
        es.get('a.b').on(func);
        es.get('a.b.c').on((data, layer) => result.push(data, layer.name));

        es.offDescendants(func);
        es.get([]).triggerDescendants(1);

        es.offDescendants();
        es.get([]).triggerDescendants(2);

        expect(result).to.eql([
            1, '', 1, 'c'
        ]);
    });

    it('测试 offAncestors', function () {
        const result: any[] = [];
        const func = (data: any, layer: any) => result.push(data, layer.name);

        es.get([]).on((data, layer) => result.push(data, layer.name));
        es.get('a').on(func);
        es.get('a.b').on(func);
        es.get('a.b.c').on((data, layer) => result.push(data, layer.name));

        es.get('a.b.c').offAncestors(func);
        es.get([]).triggerDescendants(1);

        es.get('a.b.c').offAncestors();
        es.get([]).triggerDescendants(2);

        expect(result).to.eql([
            1, '', 1, 'c'
        ]);
    });

    it('测试 has', function () {
        const func = () => { };

        es.get('a').on(() => { });
        es.get('a').on(func);

        expect(es.get('').has()).to.not.be.ok();
        expect(es.get('').has(func)).to.not.be.ok();
        expect(es.get('').has(() => { })).to.not.be.ok();

        expect(es.get('a').has()).to.be.ok();
        expect(es.get('a').has(func)).to.be.ok();
        expect(es.get('a').has(() => { })).to.not.be.ok();

        expect(es.get('a.b').has()).to.not.be.ok();
        expect(es.get('a.b').has(func)).to.not.be.ok();
        expect(es.get('a.b').has(() => { })).to.not.be.ok();
    });

    it('测试 hasDescendants', function () {
        const func = () => { };

        es.get('a').on(() => { });
        es.get('a').on(func);

        expect(es.get('').hasDescendants()).to.be.ok();
        expect(es.get('').hasDescendants(func)).to.be.ok();
        expect(es.get('').hasDescendants(() => { })).to.not.be.ok();

        expect(es.get('a').hasDescendants()).to.be.ok();
        expect(es.get('a').hasDescendants(func)).to.be.ok();
        expect(es.get('a').hasDescendants(() => { })).to.not.be.ok();

        expect(es.get('a.b').hasDescendants()).to.not.be.ok();
        expect(es.get('a.b').hasDescendants(func)).to.not.be.ok();
        expect(es.get('a.b').hasDescendants(() => { })).to.not.be.ok();
    });

    it('测试 hasAncestors', function () {
        const func = () => { };

        es.get('a').on(() => { });
        es.get('a').on(func);

        expect(es.get('').hasAncestors()).to.not.be.ok();
        expect(es.get('').hasAncestors(func)).to.not.be.ok();
        expect(es.get('').hasAncestors(() => { })).to.not.be.ok();

        expect(es.get('a').hasAncestors()).to.be.ok();
        expect(es.get('a').hasAncestors(func)).to.be.ok();
        expect(es.get('a').hasAncestors(() => { })).to.not.be.ok();

        expect(es.get('a.b').hasAncestors()).to.be.ok();
        expect(es.get('a.b').hasAncestors(func)).to.be.ok();
        expect(es.get('a.b').hasAncestors(() => { })).to.not.be.ok();
    });
});

describe('测试监听事件监听器变化', function () {

    describe('测试注册与删除', function () {

        it('在根上注册', function () {
            const root_descendantsRemoveListener = (<any>es)._onDescendantsRemoveListenerCallback.values().next().value;

            es.watch('addListener', () => { });
            es.watch('removeListener', () => { });
            es.watch('ancestorsAddListener', () => { });
            es.watch('ancestorsRemoveListener', () => { });
            es.watch('descendantsAddListener', () => { });
            es.watch('descendantsRemoveListener', () => { });

            expect((<any>es)._onAddListenerCallback.size).to.be(1);
            expect((<any>es)._onRemoveListenerCallback.size).to.be(1);
            expect((<any>es)._onAncestorsAddListenerCallback.size).to.be(1);
            expect((<any>es)._onAncestorsRemoveListenerCallback.size).to.be(1);
            expect((<any>es)._onDescendantsAddListenerCallback.size).to.be(1);
            expect((<any>es)._onDescendantsRemoveListenerCallback.size).to.be(2);   //构造函数那里还会注册一个

            es.watchOff('addListener');
            es.watchOff('removeListener');
            es.watchOff('ancestorsAddListener');
            es.watchOff('ancestorsRemoveListener');
            es.watchOff('descendantsAddListener');
            es.watchOff('descendantsRemoveListener');

            expect((<any>es)._onAddListenerCallback.size).to.be(0);
            expect((<any>es)._onRemoveListenerCallback.size).to.be(0);
            expect((<any>es)._onAncestorsAddListenerCallback.size).to.be(0);
            expect((<any>es)._onAncestorsRemoveListenerCallback.size).to.be(0);
            expect((<any>es)._onDescendantsAddListenerCallback.size).to.be(0);
            expect((<any>es)._onDescendantsRemoveListenerCallback.size).to.be(1);   //确保没有清除构造函数配置的

            expect(root_descendantsRemoveListener).to.be((<any>es)._onDescendantsRemoveListenerCallback.values().next().value);
        });

        it('在其他层级上注册', function () {
            const layer = es.get('a');

            layer.watch('addListener', () => { });
            layer.watch('removeListener', () => { });
            layer.watch('ancestorsAddListener', () => { });
            layer.watch('ancestorsRemoveListener', () => { });
            layer.watch('descendantsAddListener', () => { });
            layer.watch('descendantsRemoveListener', () => { });

            expect((<any>layer)._onAddListenerCallback.size).to.be(1);
            expect((<any>layer)._onRemoveListenerCallback.size).to.be(1);
            expect((<any>layer)._onAncestorsAddListenerCallback.size).to.be(1);
            expect((<any>layer)._onAncestorsRemoveListenerCallback.size).to.be(1);
            expect((<any>layer)._onDescendantsAddListenerCallback.size).to.be(1);
            expect((<any>layer)._onDescendantsRemoveListenerCallback.size).to.be(1);

            layer.watchOff('addListener');
            layer.watchOff('removeListener');
            layer.watchOff('ancestorsAddListener');
            layer.watchOff('ancestorsRemoveListener');
            layer.watchOff('descendantsAddListener');
            layer.watchOff('descendantsRemoveListener');

            expect((<any>layer)._onAddListenerCallback.size).to.be(0);
            expect((<any>layer)._onRemoveListenerCallback.size).to.be(0);
            expect((<any>layer)._onAncestorsAddListenerCallback.size).to.be(0);
            expect((<any>layer)._onAncestorsRemoveListenerCallback.size).to.be(0);
            expect((<any>layer)._onDescendantsAddListenerCallback.size).to.be(0);
            expect((<any>layer)._onDescendantsRemoveListenerCallback.size).to.be(0);
        });
    });

    it('测试监听', function () {
        const result: any[] = [];

        es.get('b').watch('addListener', (listener, layer) => result.push(layer.name, 'addListener'));
        es.get('b').watch('removeListener', (listener, layer) => result.push(layer.name, 'removeListener'));
        es.get('b').watch('ancestorsAddListener', (listener, layer) => result.push(layer.name, 'ancestorsAddListener'));
        es.get('b').watch('ancestorsRemoveListener', (listener, layer) => result.push(layer.name, 'ancestorsRemoveListener'));
        es.get('b').watch('descendantsAddListener', (listener, layer) => result.push(layer.name, 'descendantsAddListener'));
        es.get('b').watch('descendantsRemoveListener', (listener, layer) => result.push(layer.name, 'descendantsRemoveListener'));

        es.get('').on(function () { });
        es.get('b').on(function () { });
        es.get('b.c').on(function () { });
        es.get('d').on(function () { });

        es.get('').off();
        es.get('b').off();
        es.get('b.c').off();
        es.get('d').off();

        expect(result).to.be.eql([
            '', 'ancestorsAddListener',
            'b', 'addListener',
            'c', 'descendantsAddListener',
            '', 'ancestorsRemoveListener',
            'b', 'removeListener',
            'c', 'descendantsRemoveListener'
        ]);
    });
});


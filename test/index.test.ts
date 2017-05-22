import expect = require('expect.js');
import _ = require('lodash');
import es = require('../bin/index');
const { receive, send, cancel, receiveOnce, EventSpace } = es;

describe('test nodejs version', function () {

    describe('test global event space', function () {

        beforeEach('clear all event listener', function () {
            cancel();
        });

        it('test event level', function () {
            let cycle = 0;

            receive('test', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive('test.2', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive('test.2.3', (data: any, path: any[]) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                    expect(_.isEqual(path, ['test'])).to.be.ok();
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                    expect(_.isEqual(path, ['test', '2'])).to.be.ok();
                } else {
                    expect(data).to.be.equal('c');
                    expect(_.isEqual(path, ['test', '2', '3'])).to.be.ok();
                }
            });

            send('test', 'a');
            cycle++;

            send('test.2', 'b');
            cycle++;

            send('test.2.3', 'c');
        });

        it('test number event name', function () {
            let cycle = 0;

            receive(1, (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive('1.2', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive([1, 2, 3], (data: any, path: any[]) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                    expect(_.isEqual(path, [1])).to.be.ok();
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                    expect(_.isEqual(path, [1, 2])).to.be.ok();
                } else {
                    expect(data).to.be.equal('c');
                    expect(_.isEqual(path, [1, 2, 3])).to.be.ok();
                }
            });

            send(1, 'a');
            cycle++;

            send([1, 2], 'b');
            cycle++;

            send([1, 2, 3], 'c');
        });

        it('test event level. Using array', function () {
            let cycle = 0;

            receive(['test'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive(['test', '2'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive(['test', '2', '3'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect(data).to.be.equal('c');
                }
            });

            send(['test'], 'a');
            cycle++;

            send(['test', '2'], 'b');
            cycle++;

            send(['test', '2', '3'], 'c');
        });

        it('test cancel', function () {

            receive('test', (data: any) => {
                expect(data).to.be.equal('a');
            });

            receive('test.2', (data: any) => {
                expect().fail(`"test.2" can\`t be triggered`);
            });

            receive('test.2.3', (data: any) => {
                expect().fail(`"test.2.3" can\`t be triggered`);
            });

            cancel('test.2');

            send('test', 'a');
            send('test.2', 'b');
            send('test.2.3', 'c');
        });

        it('test cancel.Using array', function () {

            receive(['test'], (data: any) => {
                expect(data).to.be.equal('a');
            });

            receive(['test', '2'], (data: any) => {
                expect().fail(`"test.2" can\`t be triggered`);
            });

            receive(['test', '2', '3'], (data: any) => {
                expect().fail(`"test.2.3" can\`t be triggered`);
            });

            cancel(['test', '2']);

            send(['test'], 'a');
            send(['test', '2'], 'b');
            send(['test', '2', '3'], 'c');
        });

        it('test multi register', function () {
            let cycle = 0;

            receive('test', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive('test', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive('test.2', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            send('test', 'a');
            cycle++;

            send('test.2', 'b');
            cycle++;

            send('test.2.3', 'c');
        });

        it('test multi register.Using array', function () {
            let cycle = 0;

            receive(['test'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive(['test'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive(['test', '2'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            send(['test'], 'a');
            cycle++;

            send(['test', '2'], 'b');
            cycle++;

            send(['test', '2', '3'], 'c');
        });

        it('test receiveOnce', function () {
            receiveOnce('test', (data: any, p: any[]) => {
                expect(data).to.be.equal('a');
                expect(_.isEqual(p, ['test'])).to.be.ok();
            });

            receiveOnce('test.2', (data: any, p: any[]) => {
                expect(data).to.be.equal('a');
                expect(_.isEqual(p, ['test'])).to.be.ok();
            });

            receiveOnce('test', (data: any) => {
                expect(data).to.be.equal('a');
            });

            send('test', 'a');
            send('test', 'b');
            send('test.2', 'c');
        });

        it('test cancel and receiveOnce', function () {
            receiveOnce('test', (data: any, p: any[]) => {
                expect(data).to.be.equal('a');
                expect(_.isEqual(p, ['test'])).to.be.ok();
            });

            receiveOnce('test.2', (data: any, p: any[]) => {
                expect().fail(`this level can\`t be triggered`);
            });

            receiveOnce('test', (data: any) => {
                expect(data).to.be.equal('a');
            });

            cancel(['test', '2']);

            send('test', 'a');
            send('test', 'b');
            send('test.2', 'c');
        });
    });

    describe('test new EventSpace()', function () {

        it('test event level', function () {
            const eventspace = new EventSpace();
            let cycle = 0;

            eventspace.receive('test', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive('test.2', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive('test.2.3', (data: any, path: any[]) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                    expect(_.isEqual(path, ['test'])).to.be.ok();
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                    expect(_.isEqual(path, ['test', '2'])).to.be.ok();
                } else {
                    expect(data).to.be.equal('c');
                    expect(_.isEqual(path, ['test', '2', '3'])).to.be.ok();
                }
            });

            eventspace.send('test', 'a');
            cycle++;

            eventspace.send('test.2', 'b');
            cycle++;

            eventspace.send('test.2.3', 'c');
        });

        it('test event level.Using array', function () {
            const eventspace = new EventSpace();
            let cycle = 0;

            eventspace.receive(['test'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive(['test', '2'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive(['test', '2', '3'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect(data).to.be.equal('c');
                }
            });

            eventspace.send(['test'], 'a');
            cycle++;

            eventspace.send(['test', '2'], 'b');
            cycle++;

            eventspace.send(['test', '2', '3'], 'c');
        });

        it('test cancel', function () {
            const eventspace = new EventSpace();

            eventspace.receive('test', (data: any) => {
                expect(data).to.be.equal('a');
            });

            eventspace.receive('test.2', (data: any) => {
                expect().fail(`"test.2" can\`t be triggered`);
            });

            eventspace.receive('test.2.3', (data: any) => {
                expect().fail(`"test.2.3" can\`t be triggered`);
            });

            eventspace.cancel('test.2');

            eventspace.send('test', 'a');
            eventspace.send('test.2', 'b');
            eventspace.send('test.2.3', 'c');
        });

        it('test cancel.Using array', function () {
            const eventspace = new EventSpace();

            eventspace.receive(['test'], (data: any) => {
                expect(data).to.be.equal('a');
            });

            eventspace.receive(['test', '2'], (data: any) => {
                expect().fail(`"test.2" can\`t be triggered`);
            });

            eventspace.receive(['test', '2', '3'], (data: any) => {
                expect().fail(`"test.2.3" can\`t be triggered`);
            });

            eventspace.cancel(['test', '2']);

            eventspace.send(['test'], 'a');
            eventspace.send(['test', '2'], 'b');
            eventspace.send(['test', '2', '3'], 'c');
        });

        it('test multi register', function () {
            const eventspace = new EventSpace();
            let cycle = 0;

            eventspace.receive('test', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive('test', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive('test.2', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.send('test', 'a');
            cycle++;

            eventspace.send('test.2', 'b');
            cycle++;

            eventspace.send('test.2.3', 'c');
        });

        it('test multi register.Using array', function () {
            const eventspace = new EventSpace();
            let cycle = 0;

            eventspace.receive(['test'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive(['test'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive(['test', '2'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.send(['test'], 'a');
            cycle++;

            eventspace.send(['test', '2'], 'b');
            cycle++;

            eventspace.send(['test', '2', '3'], 'c');
        });

        it('test receiveOnce', function () {
            const eventspace = new EventSpace();

            eventspace.receiveOnce('test', (data: any, p: any[]) => {
                expect(data).to.be.equal('a');
                expect(_.isEqual(p, ['test'])).to.be.ok();
            });

            eventspace.receiveOnce('test.2', (data: any, p: any[]) => {
                expect(data).to.be.equal('a');
                expect(_.isEqual(p, ['test'])).to.be.ok();
            });

            eventspace.receiveOnce('test', (data: any) => {
                expect(data).to.be.equal('a');
            });

            eventspace.send('test', 'a');
            eventspace.send('test', 'b');
            eventspace.send('test.2', 'c');
        });

        it('test cancel and receiveOnce', function () {
            const eventspace = new EventSpace();

            eventspace.receiveOnce('test', (data: any, p: any[]) => {
                expect(data).to.be.equal('a');
                expect(_.isEqual(p, ['test'])).to.be.ok();
            });

            eventspace.receiveOnce('test.2', (data: any, p: any[]) => {
                expect().fail(`this level can\`t be triggered`);
            });

            eventspace.receiveOnce('test', (data: any) => {
                expect(data).to.be.equal('a');
            });

            eventspace.cancel(['test', '2']);

            eventspace.send('test', 'a');
            eventspace.send('test', 'b');
            eventspace.send('test.2', 'c');
        });
    });
});

describe('test browser version', function () {

    //Make a global variable to emulate browser window 
    (<any>global).window = {};
    require('../bin/browser/index.js');

    describe('test global event space', function () {

        const { receive, send, cancel, receiveOnce, EventSpace } = (<any>global).window.es;

        beforeEach('clear all event listener', function () {
            cancel();
        });

        it('test event level', function () {
            let cycle = 0;

            receive('test', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive('test.2', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive('test.2.3', (data: any, path: any[]) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                    expect(_.isEqual(path, ['test'])).to.be.ok();
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                    expect(_.isEqual(path, ['test', '2'])).to.be.ok();
                } else {
                    expect(data).to.be.equal('c');
                    expect(_.isEqual(path, ['test', '2', '3'])).to.be.ok();
                }
            });

            send('test', 'a');
            cycle++;

            send('test.2', 'b');
            cycle++;

            send('test.2.3', 'c');
        });

        it('test number event name', function () {
            let cycle = 0;

            receive(1, (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive('1.2', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive([1, 2, 3], (data: any, path: any[]) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                    expect(_.isEqual(path, [1])).to.be.ok();
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                    expect(_.isEqual(path, [1, 2])).to.be.ok();
                } else {
                    expect(data).to.be.equal('c');
                    expect(_.isEqual(path, [1, 2, 3])).to.be.ok();
                }
            });

            send(1, 'a');
            cycle++;

            send([1, 2], 'b');
            cycle++;

            send([1, 2, 3], 'c');
        });

        it('test event level. Using array', function () {
            let cycle = 0;

            receive(['test'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive(['test', '2'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive(['test', '2', '3'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect(data).to.be.equal('c');
                }
            });

            send(['test'], 'a');
            cycle++;

            send(['test', '2'], 'b');
            cycle++;

            send(['test', '2', '3'], 'c');
        });

        it('test cancel', function () {

            receive('test', (data: any) => {
                expect(data).to.be.equal('a');
            });

            receive('test.2', (data: any) => {
                expect().fail(`"test.2" can\`t be triggered`);
            });

            receive('test.2.3', (data: any) => {
                expect().fail(`"test.2.3" can\`t be triggered`);
            });

            cancel('test.2');

            send('test', 'a');
            send('test.2', 'b');
            send('test.2.3', 'c');
        });

        it('test cancel.Using array', function () {

            receive(['test'], (data: any) => {
                expect(data).to.be.equal('a');
            });

            receive(['test', '2'], (data: any) => {
                expect().fail(`"test.2" can\`t be triggered`);
            });

            receive(['test', '2', '3'], (data: any) => {
                expect().fail(`"test.2.3" can\`t be triggered`);
            });

            cancel(['test', '2']);

            send(['test'], 'a');
            send(['test', '2'], 'b');
            send(['test', '2', '3'], 'c');
        });

        it('test multi register', function () {
            let cycle = 0;

            receive('test', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive('test', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive('test.2', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            send('test', 'a');
            cycle++;

            send('test.2', 'b');
            cycle++;

            send('test.2.3', 'c');
        });

        it('test multi register.Using array', function () {
            let cycle = 0;

            receive(['test'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive(['test'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive(['test', '2'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            send(['test'], 'a');
            cycle++;

            send(['test', '2'], 'b');
            cycle++;

            send(['test', '2', '3'], 'c');
        });

        it('test receiveOnce', function () {
            receiveOnce('test', (data: any, p: any[]) => {
                expect(data).to.be.equal('a');
                expect(_.isEqual(p, ['test'])).to.be.ok();
            });

            receiveOnce('test.2', (data: any, p: any[]) => {
                expect(data).to.be.equal('a');
                expect(_.isEqual(p, ['test'])).to.be.ok();
            });

            receiveOnce('test', (data: any) => {
                expect(data).to.be.equal('a');
            });

            send('test', 'a');
            send('test', 'b');
            send('test.2', 'c');
        });

        it('test cancel and receiveOnce', function () {
            receiveOnce('test', (data: any, p: any[]) => {
                expect(data).to.be.equal('a');
                expect(_.isEqual(p, ['test'])).to.be.ok();
            });

            receiveOnce('test.2', (data: any, p: any[]) => {
                expect().fail(`this level can\`t be triggered`);
            });

            receiveOnce('test', (data: any) => {
                expect(data).to.be.equal('a');
            });

            cancel(['test', '2']);

            send('test', 'a');
            send('test', 'b');
            send('test.2', 'c');
        });
    });

    describe('test new EventSpace()', function () {

        const { receive, send, cancel, receiveOnce, EventSpace } = (<any>global).window.es;

        it('test event level', function () {
            const eventspace = new EventSpace();
            let cycle = 0;

            eventspace.receive('test', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive('test.2', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive('test.2.3', (data: any, path: any[]) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                    expect(_.isEqual(path, ['test'])).to.be.ok();
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                    expect(_.isEqual(path, ['test', '2'])).to.be.ok();
                } else {
                    expect(data).to.be.equal('c');
                    expect(_.isEqual(path, ['test', '2', '3'])).to.be.ok();
                }
            });

            eventspace.send('test', 'a');
            cycle++;

            eventspace.send('test.2', 'b');
            cycle++;

            eventspace.send('test.2.3', 'c');
        });

        it('test event level.Using array', function () {
            const eventspace = new EventSpace();
            let cycle = 0;

            eventspace.receive(['test'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive(['test', '2'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive(['test', '2', '3'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect(data).to.be.equal('c');
                }
            });

            eventspace.send(['test'], 'a');
            cycle++;

            eventspace.send(['test', '2'], 'b');
            cycle++;

            eventspace.send(['test', '2', '3'], 'c');
        });

        it('test cancel', function () {
            const eventspace = new EventSpace();

            eventspace.receive('test', (data: any) => {
                expect(data).to.be.equal('a');
            });

            eventspace.receive('test.2', (data: any) => {
                expect().fail(`"test.2" can\`t be triggered`);
            });

            eventspace.receive('test.2.3', (data: any) => {
                expect().fail(`"test.2.3" can\`t be triggered`);
            });

            eventspace.cancel('test.2');

            eventspace.send('test', 'a');
            eventspace.send('test.2', 'b');
            eventspace.send('test.2.3', 'c');
        });

        it('test cancel.Using array', function () {
            const eventspace = new EventSpace();

            eventspace.receive(['test'], (data: any) => {
                expect(data).to.be.equal('a');
            });

            eventspace.receive(['test', '2'], (data: any) => {
                expect().fail(`"test.2" can\`t be triggered`);
            });

            eventspace.receive(['test', '2', '3'], (data: any) => {
                expect().fail(`"test.2.3" can\`t be triggered`);
            });

            eventspace.cancel(['test', '2']);

            eventspace.send(['test'], 'a');
            eventspace.send(['test', '2'], 'b');
            eventspace.send(['test', '2', '3'], 'c');
        });

        it('test multi register', function () {
            const eventspace = new EventSpace();
            let cycle = 0;

            eventspace.receive('test', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive('test', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive('test.2', (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.send('test', 'a');
            cycle++;

            eventspace.send('test.2', 'b');
            cycle++;

            eventspace.send('test.2.3', 'c');
        });

        it('test multi register.Using array', function () {
            const eventspace = new EventSpace();
            let cycle = 0;

            eventspace.receive(['test'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive(['test'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive(['test', '2'], (data: any) => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.send(['test'], 'a');
            cycle++;

            eventspace.send(['test', '2'], 'b');
            cycle++;

            eventspace.send(['test', '2', '3'], 'c');
        });

        it('test receiveOnce', function () {
            const eventspace = new EventSpace();

            eventspace.receiveOnce('test', (data: any, p: any[]) => {
                expect(data).to.be.equal('a');
                expect(_.isEqual(p, ['test'])).to.be.ok();
            });

            eventspace.receiveOnce('test.2', (data: any, p: any[]) => {
                expect(data).to.be.equal('a');
                expect(_.isEqual(p, ['test'])).to.be.ok();
            });

            eventspace.receiveOnce('test', (data: any) => {
                expect(data).to.be.equal('a');
            });

            eventspace.send('test', 'a');
            eventspace.send('test', 'b');
            eventspace.send('test.2', 'c');
        });

        it('test cancel and receiveOnce', function () {
            const eventspace = new EventSpace();

            eventspace.receiveOnce('test', (data: any, p: any[]) => {
                expect(data).to.be.equal('a');
                expect(_.isEqual(p, ['test'])).to.be.ok();
            });

            eventspace.receiveOnce('test.2', (data: any, p: any[]) => {
                expect().fail(`this level can\`t be triggered`);
            });

            eventspace.receiveOnce('test', (data: any) => {
                expect(data).to.be.equal('a');
            });

            eventspace.cancel(['test', '2']);

            eventspace.send('test', 'a');
            eventspace.send('test', 'b');
            eventspace.send('test.2', 'c');
        });
    });
});
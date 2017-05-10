const expect = require('expect.js');
const _ = require('lodash');
const { receive, send, cancel, receiveOnce, EventSpace } = require('../bin/index');

describe('test', function () {

    describe('test global event space', function () {

        beforeEach('clear all event listener', function () {
            cancel();
        });

        it('test event level', function () {
            let cycle = 0;

            receive('test', data => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive('test.2', data => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive('test.2.3', (data, path) => {
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

        it('test number event name', function (done) {
            receive(1, data => {
                expect(data).to.be.equal('a');
                done();
            });
            send(1, 'a');
        });

        it('test event level. Using array', function () {
            let cycle = 0;

            receive(['test'], data => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive(['test', '2'], data => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive(['test', '2', '3'], data => {
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

            receive('test', data => {
                expect(data).to.be.equal('a');
            });

            receive('test.2', data => {
                expect().fail(`"test.2" can\`t be triggered`);
            });

            receive('test.2.3', data => {
                expect().fail(`"test.2.3" can\`t be triggered`);
            });

            cancel('test.2');

            send('test', 'a');
            send('test.2', 'b');
            send('test.2.3', 'c');
        });

        it('test cancel.Using array', function () {

            receive(['test'], data => {
                expect(data).to.be.equal('a');
            });

            receive(['test', '2'], data => {
                expect().fail(`"test.2" can\`t be triggered`);
            });

            receive(['test', '2', '3'], data => {
                expect().fail(`"test.2.3" can\`t be triggered`);
            });

            cancel(['test', '2']);

            send(['test'], 'a');
            send(['test', '2'], 'b');
            send(['test', '2', '3'], 'c');
        });

        it('test multi register', function () {
            let cycle = 0;

            receive('test', data => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive('test', data => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive('test.2', data => {
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

            receive(['test'], data => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive(['test'], data => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            receive(['test', '2'], data => {
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
            receiveOnce('test', (data, p) => {
                expect(data).to.be.equal('a');
                expect(_.isEqual(p, ['test'])).to.be.ok();
            });

            receiveOnce('test.2', (data, p) => {
                expect(data).to.be.equal('a');
                expect(_.isEqual(p, ['test'])).to.be.ok();
            });

            receiveOnce('test', data => {
                expect(data).to.be.equal('a');
            });

            send('test', 'a');
            send('test', 'b');
            send('test.2', 'c');
        });

        it('test cancel and receiveOnce', function () {
            receiveOnce('test', (data, p) => {
                expect(data).to.be.equal('a');
                expect(_.isEqual(p, ['test'])).to.be.ok();
            });

            receiveOnce('test.2', (data, p) => {
                expect().fail(`this level can\`t be triggered`);
            });

            receiveOnce('test', data => {
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

            eventspace.receive('test', data => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive('test.2', data => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive('test.2.3', (data, path) => {
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

            eventspace.receive(['test'], data => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive(['test', '2'], data => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else if (cycle === 1) {
                    expect(data).to.be.equal('b');
                } else {
                    expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive(['test', '2', '3'], data => {
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

            eventspace.receive('test', data => {
                expect(data).to.be.equal('a');
            });

            eventspace.receive('test.2', data => {
                expect().fail(`"test.2" can\`t be triggered`);
            });

            eventspace.receive('test.2.3', data => {
                expect().fail(`"test.2.3" can\`t be triggered`);
            });

            eventspace.cancel('test.2');

            eventspace.send('test', 'a');
            eventspace.send('test.2', 'b');
            eventspace.send('test.2.3', 'c');
        });

        it('test cancel.Using array', function () {
            const eventspace = new EventSpace();

            eventspace.receive(['test'], data => {
                expect(data).to.be.equal('a');
            });

            eventspace.receive(['test', '2'], data => {
                expect().fail(`"test.2" can\`t be triggered`);
            });

            eventspace.receive(['test', '2', '3'], data => {
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

            eventspace.receive('test', data => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive('test', data => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive('test.2', data => {
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

            eventspace.receive(['test'], data => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive(['test'], data => {
                if (cycle === 0) {
                    expect(data).to.be.equal('a');
                } else {
                    expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
                }
            });

            eventspace.receive(['test', '2'], data => {
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

            eventspace.receiveOnce('test', (data, p) => {
                expect(data).to.be.equal('a');
                expect(_.isEqual(p, ['test'])).to.be.ok();
            });

            eventspace.receiveOnce('test.2', (data, p) => {
                expect(data).to.be.equal('a');
                expect(_.isEqual(p, ['test'])).to.be.ok();
            });

            eventspace.receiveOnce('test', data => {
                expect(data).to.be.equal('a');
            });

            eventspace.send('test', 'a');
            eventspace.send('test', 'b');
            eventspace.send('test.2', 'c');
        });

        it('test cancel and receiveOnce', function () {
            const eventspace = new EventSpace();

            eventspace.receiveOnce('test', (data, p) => {
                expect(data).to.be.equal('a');
                expect(_.isEqual(p, ['test'])).to.be.ok();
            });

            eventspace.receiveOnce('test.2', (data, p) => {
                expect().fail(`this level can\`t be triggered`);
            });

            eventspace.receiveOnce('test', data => {
                expect(data).to.be.equal('a');
            });

            eventspace.cancel(['test', '2']);

            eventspace.send('test', 'a');
            eventspace.send('test', 'b');
            eventspace.send('test.2', 'c');
        });
    });
});
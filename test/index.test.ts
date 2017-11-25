import expect = require('expect.js');
import _ = require('lodash');
import es = require('..');
const { receive, send, cancel, receiveOnce, EventSpace } = es;

/** 最近一次测试结果
  test global event space
    √ test event level
    √ test event level. Using array
    √ test cancel
    √ test cancel.Using array
    √ test multi register
    √ test multi register.Using array
    √ test receiveOnce
    √ test cancel and receiveOnce


  8 passing (27ms)
 */

describe('test global event space', function () {

    beforeEach('clear all event listener', function () {
        cancel();
    });

    it('test event level', function (done) {
        let cycle = 0;

        receive('test', (data) => {
            if (cycle === 0) {
                expect(data).to.be.equal('a');
            } else {
                expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
            }
        });

        receive('test.2', (data) => {
            if (cycle === 0) {
                expect(data).to.be.equal('a');
            } else if (cycle === 1) {
                expect(data).to.be.equal('b');
            } else {
                expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
            }
        });

        receive('test.2.3', (data) => {
            if (cycle === 0) {
                expect(data).to.be.equal('a');
            } else if (cycle === 1) {
                expect(data).to.be.equal('b');
            } else {
                expect(data).to.be.equal('c');
                done();
            }
        });

        send('test', 'a');
        cycle++;

        send('test.2', 'b');
        cycle++;

        send('test.2.3', 'c');
    });

    it('test event level. Using array', function (done) {
        let cycle = 0;

        receive(['test'], (data) => {
            if (cycle === 0) {
                expect(data).to.be.equal('a');
            } else {
                expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
            }
        });

        receive(['test', '2'], (data) => {
            if (cycle === 0) {
                expect(data).to.be.equal('a');
            } else if (cycle === 1) {
                expect(data).to.be.equal('b');
            } else {
                expect().fail(`"test.2" can\`t be triggered in cycle ${cycle}`);
            }
        });

        receive(['test', '2', '3'], (data) => {
            if (cycle === 0) {
                expect(data).to.be.equal('a');
            } else if (cycle === 1) {
                expect(data).to.be.equal('b');
            } else {
                expect(data).to.be.equal('c');
                done();
            }
        });

        send(['test'], 'a');
        cycle++;

        send(['test', '2'], 'b');
        cycle++;

        send(['test', '2', '3'], 'c');
    });

    it('test cancel', function () {

        receive('test', (data) => {
            expect(data).to.be.equal('a');
        });

        receive('test.2', (data) => {
            expect().fail(`"test.2" can\`t be triggered`);
        });

        receive('test.2.3', (data) => {
            expect().fail(`"test.2.3" can\`t be triggered`);
        });

        cancel('test.2');

        send('test', 'a');
        send('test.2', 'b');
        send('test.2.3', 'c');
    });

    it('test cancel.Using array', function () {

        receive(['test'], (data) => {
            expect(data).to.be.equal('a');
        });

        receive(['test', '2'], (data) => {
            expect().fail(`"test.2" can\`t be triggered`);
        });

        receive(['test', '2', '3'], (data) => {
            expect().fail(`"test.2.3" can\`t be triggered`);
        });

        cancel(['test', '2']);

        send(['test'], 'a');
        send(['test', '2'], 'b');
        send(['test', '2', '3'], 'c');
    });

    it('test multi register', function (done) {
        let cycle = 0;

        receive('test', (data) => {
            if (cycle === 0) {
                expect(data).to.be.equal('a');
            } else {
                expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
            }
        });

        receive('test', (data) => {
            if (cycle === 0) {
                expect(data).to.be.equal('a');
            } else {
                expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
            }
        });

        receive('test.2', (data) => {
            if (cycle === 0) {
                expect(data).to.be.equal('a');
            } else if (cycle === 1) {
                expect(data).to.be.equal('b');
                done();
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

    it('test multi register.Using array', function (done) {
        let cycle = 0;

        receive(['test'], (data) => {
            if (cycle === 0) {
                expect(data).to.be.equal('a');
            } else {
                expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
            }
        });

        receive(['test'], (data) => {
            if (cycle === 0) {
                expect(data).to.be.equal('a');
            } else {
                expect().fail(`"test" can\`t be triggered in cycle ${cycle}`);
            }
        });

        receive(['test', '2'], (data) => {
            if (cycle === 0) {
                expect(data).to.be.equal('a');
            } else if (cycle === 1) {
                expect(data).to.be.equal('b');
                done();
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
        receiveOnce('test', (data) => {
            expect(data).to.be.equal('a');
        });

        receiveOnce('test.2', (data) => {
            expect(data).to.be.equal('a');
        });

        receiveOnce('test', (data) => {
            expect(data).to.be.equal('a');
        });

        send('test', 'a');
        send('test', 'b');
        send('test.2', 'c');
    });

    it('test cancel and receiveOnce', function () {
        receiveOnce('test', (data) => {
            expect(data).to.be.equal('a');
        });

        receiveOnce('test.2', (data) => {
            expect().fail(`"test.2" can\`t be triggered`);
        });

        receiveOnce('test', (data) => {
            expect(data).to.be.equal('a');
        });

        cancel(['test', '2']);

        send('test', 'a');
        send('test', 'b');
        send('test.2', 'c');
    });
});
import expect = require('expect.js');
import _ = require('lodash');
import es = require('..');
const { receive, send, cancel, receiveOnce, EventSpace } = es;

describe('test global event space', function () {

    beforeEach('clear all event listener', function () {
        cancel();
    });

    it('test event level', function () {
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
            }
        });

        send('test', 'a');
        cycle++;

        send('test.2', 'b');
        cycle++;

        send('test.2.3', 'c');
    });

    it('test event level. Using array', function () {
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

    it('test multi register', function () {
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
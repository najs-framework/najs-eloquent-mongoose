"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const najs_eloquent_1 = require("najs-eloquent");
const mongoose_1 = require("mongoose");
const util_1 = require("../../util");
const MongooseRecordExecutor_1 = require("../../../lib/drivers/mongoose/MongooseRecordExecutor");
const MongooseQueryLog_1 = require("../../../lib/drivers/mongoose/MongooseQueryLog");
const mongoose = require('mongoose');
describe('MongooseRecordExecutor', function () {
    const Model = mongoose_1.model('MongooseModel', new mongoose_1.Schema({}));
    beforeAll(async function () {
        await util_1.init_mongoose(mongoose, 'mongoose_record_executor');
    });
    afterAll(async function () {
        util_1.delete_collection(mongoose, 'test');
    });
    beforeEach(function () {
        najs_eloquent_1.QueryLog.clear().enable();
    });
    function makeExecutor(model, document) {
        return new MongooseRecordExecutor_1.MongooseRecordExecutor(model, document, new MongooseQueryLog_1.MongooseQueryLog());
    }
    function makeDocument() {
        return new Model();
    }
    function expect_query_log(data, result = undefined, index = 0) {
        const logData = najs_eloquent_1.QueryLog.pull()[index]['data'];
        if (typeof result !== undefined) {
            expect(logData['result'] === result).toBe(true);
        }
        expect(logData).toMatchObject(data);
    }
    it('extends NajsEloquentLib.Driver.ExecutorBase', function () {
        const document = makeDocument();
        const executor = makeExecutor(mongoose_1.model, document);
        expect(executor).toBeInstanceOf(najs_eloquent_1.NajsEloquent.Driver.ExecutorBase);
    });
    describe('.create()', function () {
        it('calls and returns this.document.save()', async function () {
            const model = {
                getModelName() {
                    return 'Test';
                }
            };
            const document = makeDocument();
            const spy = Sinon.spy(document, 'save');
            const executor = makeExecutor(model, document);
            const result = await executor.create();
            expect_query_log({
                raw: 'Test.save()',
                action: 'Test.create()'
            }, result);
            expect(spy.called).toBe(true);
        });
        it('does not call this.document.save(), just returns an empty object if executeMode is disabled', async function () {
            const model = {
                getModelName() {
                    return 'Test';
                }
            };
            const document = makeDocument();
            const spy = Sinon.spy(document, 'save');
            const executor = makeExecutor(model, document);
            const result = await executor.setExecuteMode('disabled').create();
            expect_query_log({
                raw: 'Test.save()',
                action: 'Test.create()'
            }, result);
            expect(result).toEqual({});
            expect(spy.called).toBe(false);
        });
    });
    describe('.update()', function () {
        it('calls and returns this.document.save()', async function () {
            const model = {
                getModelName() {
                    return 'Test';
                }
            };
            const document = makeDocument();
            const spy = Sinon.spy(document, 'save');
            const executor = makeExecutor(model, document);
            const result = await executor.update();
            expect_query_log({
                raw: 'Test.save()',
                action: 'Test.update()'
            }, result);
            expect(spy.called).toBe(true);
        });
        it('does not call this.document.save(), just returns an empty object if executeMode is disabled', async function () {
            const model = {
                getModelName() {
                    return 'Test';
                }
            };
            const document = makeDocument();
            const spy = Sinon.spy(document, 'save');
            const executor = makeExecutor(model, document);
            const result = await executor.setExecuteMode('disabled').update();
            expect_query_log({
                raw: 'Test.save()',
                action: 'Test.update()'
            }, result);
            expect(result).toEqual({});
            expect(spy.called).toBe(false);
        });
    });
    describe('.softDelete()', function () {
        it('calls and returns this.document.delete()', async function () {
            const model = {
                getModelName() {
                    return 'Test';
                }
            };
            const document = {
                async delete() { }
            };
            const spy = Sinon.spy(document, 'delete');
            const executor = makeExecutor(model, document);
            const result = await executor.softDelete();
            expect_query_log({
                raw: 'Test.delete()',
                action: 'Test.softDelete()'
            }, result);
            expect(spy.called).toBe(true);
        });
        it('does not call this.document.delete(), just returns an empty object if executeMode is disabled', async function () {
            const model = {
                getModelName() {
                    return 'Test';
                }
            };
            const document = {
                async delete() { }
            };
            const spy = Sinon.spy(document, 'delete');
            const executor = makeExecutor(model, document);
            const result = await executor.setExecuteMode('disabled').softDelete();
            expect_query_log({
                raw: 'Test.delete()',
                action: 'Test.softDelete()'
            }, result);
            expect(result).toEqual({});
            expect(spy.called).toBe(false);
        });
    });
    describe('.hardDelete()', function () {
        it('calls and returns this.document.remove()', async function () {
            const model = {
                getModelName() {
                    return 'Test';
                }
            };
            const document = makeDocument();
            const spy = Sinon.spy(document, 'remove');
            const executor = makeExecutor(model, document);
            const result = await executor.hardDelete();
            expect_query_log({
                raw: 'Test.remove()',
                action: 'Test.hardDelete()'
            }, result);
            expect(spy.called).toBe(true);
        });
        it('does not call this.document.remove(), just returns an empty object if executeMode is disabled', async function () {
            const model = {
                getModelName() {
                    return 'Test';
                }
            };
            const document = makeDocument();
            const spy = Sinon.spy(document, 'remove');
            const executor = makeExecutor(model, document);
            const result = await executor.setExecuteMode('disabled').hardDelete();
            expect_query_log({
                raw: 'Test.remove()',
                action: 'Test.hardDelete()'
            }, result);
            expect(result).toEqual({});
            expect(spy.called).toBe(false);
        });
    });
    describe('.restore()', function () {
        it('calls and returns this.document.restore()', async function () {
            const model = {
                getModelName() {
                    return 'Test';
                }
            };
            const document = {
                async restore() { }
            };
            const spy = Sinon.spy(document, 'restore');
            const executor = makeExecutor(model, document);
            const result = await executor.restore();
            expect_query_log({
                raw: 'Test.restore()',
                action: 'Test.restore()'
            }, result);
            expect(spy.called).toBe(true);
        });
        it('does not call this.document.restore(), just returns an empty object if executeMode is disabled', async function () {
            const model = {
                getModelName() {
                    return 'Test';
                }
            };
            const document = {
                async restore() { }
            };
            const spy = Sinon.spy(document, 'restore');
            const executor = makeExecutor(model, document);
            const result = await executor.setExecuteMode('disabled').restore();
            expect_query_log({
                raw: 'Test.restore()',
                action: 'Test.restore()'
            }, result);
            expect(result).toEqual({});
            expect(spy.called).toBe(false);
        });
    });
});

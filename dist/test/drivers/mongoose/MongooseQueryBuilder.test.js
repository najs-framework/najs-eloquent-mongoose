"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const najs_eloquent_1 = require("najs-eloquent");
const MongooseQueryBuilder_1 = require("../../../lib/drivers/mongoose/MongooseQueryBuilder");
const MongooseQueryBuilderHandler_1 = require("../../../lib/drivers/mongoose/MongooseQueryBuilderHandler");
describe('MongooseQueryBuilder', function () {
    it('extends QueryBuilder', function () {
        const model = {};
        const instance = new MongooseQueryBuilder_1.MongooseQueryBuilder(new MongooseQueryBuilderHandler_1.MongooseQueryBuilderHandler(model));
        expect(instance).toBeInstanceOf(najs_eloquent_1.NajsEloquent.QueryBuilder.QueryBuilder);
    });
    describe('.native()', function () {
        it('simply calls and returns QueryExecutor.native()', function () {
            const fakeExecutor = {
                native() {
                    return 'anything';
                }
            };
            const fakeHandler = {
                getQueryExecutor() {
                    return fakeExecutor;
                }
            };
            const queryBuilder = new MongooseQueryBuilder_1.MongooseQueryBuilder(fakeHandler);
            const spy = Sinon.spy(fakeExecutor, 'native');
            const handler = {};
            expect(queryBuilder.native(handler)).toEqual('anything');
            expect(spy.calledWith(handler)).toBe(true);
        });
    });
    describe('.nativeModel()', function () {
        it('simply calls and returns QueryExecutor.getCollection()', function () {
            const fakeExecutor = {
                getMongooseModel() {
                    return 'anything';
                }
            };
            const fakeHandler = {
                getQueryExecutor() {
                    return fakeExecutor;
                }
            };
            const queryBuilder = new MongooseQueryBuilder_1.MongooseQueryBuilder(fakeHandler);
            const spy = Sinon.spy(fakeExecutor, 'getMongooseModel');
            expect(queryBuilder.nativeModel()).toEqual('anything');
            expect(spy.calledWith()).toBe(true);
        });
    });
});

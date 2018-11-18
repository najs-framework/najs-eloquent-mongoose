"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const najs_binding_1 = require("najs-binding");
const MongooseQueryBuilder_1 = require("../../../lib/drivers/mongoose/MongooseQueryBuilder");
const MongooseQueryBuilderFactory_1 = require("../../../lib/drivers/mongoose/MongooseQueryBuilderFactory");
describe('MongooseQueryBuilderFactory', function () {
    it('implements IAutoload and register with singleton option = true', function () {
        const a = najs_binding_1.make(MongooseQueryBuilderFactory_1.MongooseQueryBuilderFactory.className);
        const b = najs_binding_1.make(MongooseQueryBuilderFactory_1.MongooseQueryBuilderFactory.className);
        expect(a.getClassName()).toEqual('NajsEloquent.Driver.Mongoose.MongooseQueryBuilderFactory');
        expect(a === b).toBe(true);
    });
    describe('.make()', function () {
        it('creates new instance of MongooseQueryBuilder', function () {
            const model = {
                getRecordName() {
                    return 'Model';
                }
            };
            const factory = najs_binding_1.make(MongooseQueryBuilderFactory_1.MongooseQueryBuilderFactory.className);
            const qb1 = factory.make(model);
            const qb2 = factory.make(model);
            expect(qb1).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
            expect(qb1 === qb2).toBe(false);
        });
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const najs_binding_1 = require("najs-binding");
const MongooseConditionMatcher_1 = require("../../../lib/drivers/mongoose/MongooseConditionMatcher");
const MongooseConditionMatcherFactory_1 = require("../../../lib/drivers/mongoose/MongooseConditionMatcherFactory");
describe('MongooseConditionMatcherFactory', function () {
    it('implements NajsEloquent.QueryBuilder.IConditionMatcherFactory, Autoload under name "NajsEloquent.Driver.Mongoose.MongooseConditionMatcherFactory" with singleton option', function () {
        const factory = najs_binding_1.make(MongooseConditionMatcherFactory_1.MongooseConditionMatcherFactory.className);
        const instance = najs_binding_1.make(MongooseConditionMatcherFactory_1.MongooseConditionMatcherFactory.className);
        expect(factory === instance).toBe(true);
        expect(factory.getClassName()).toEqual('NajsEloquent.Driver.Mongoose.MongooseConditionMatcherFactory');
    });
    describe('.make()', function () {
        it('returns an instance of MongooseConditionMatcher', function () {
            const factory = najs_binding_1.make(MongooseConditionMatcherFactory_1.MongooseConditionMatcherFactory.className);
            const data = {
                field: 'a',
                operator: '=',
                value: 'anything'
            };
            const matcher = factory.make(data);
            expect(matcher).toBeInstanceOf(MongooseConditionMatcher_1.MongooseConditionMatcher);
            expect(matcher.toMongodbQuery()).toEqual({ a: 'anything' });
        });
    });
    describe('.transform()', function () {
        it('does nothing, just return the given object', function () {
            const factory = najs_binding_1.make(MongooseConditionMatcherFactory_1.MongooseConditionMatcherFactory.className);
            const given = {};
            expect(factory.transform(given) === given).toBe(true);
        });
    });
});

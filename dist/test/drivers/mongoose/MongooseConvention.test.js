"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const MongooseConvention_1 = require("../../../lib/drivers/mongoose/MongooseConvention");
describe('MongooseConvention', function () {
    describe('.formatFieldName()', function () {
        it('converts id to _id otherwise returns the original name', function () {
            const dataset = {
                id: '_id',
                test: 'test',
                anything: 'anything'
            };
            const instance = new MongooseConvention_1.MongooseConvention();
            for (const input in dataset) {
                expect(instance.formatFieldName(input)).toEqual(dataset[input]);
            }
        });
    });
    describe('.getNullValueFor()', function () {
        it('returns null', function () {
            const instance = new MongooseConvention_1.MongooseConvention();
            expect(instance.getNullValueFor('any')).toBeNull();
        });
    });
});

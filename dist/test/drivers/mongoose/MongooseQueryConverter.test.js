"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const MongooseQueryConverter_1 = require("../../../lib/drivers/mongoose/MongooseQueryConverter");
const MongooseQueryBuilder_1 = require("../../../lib/drivers/mongoose/MongooseQueryBuilder");
const MongooseQueryBuilderHandler_1 = require("../../../lib/drivers/mongoose/MongooseQueryBuilderHandler");
describe('MongooseConditionMatcher', function () {
    describe('Integration', function () {
        function expectConvertedQuery(cb) {
            const model = {};
            const handler = new MongooseQueryBuilderHandler_1.MongooseQueryBuilderHandler(model);
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder(handler);
            cb(query);
            const converter = new MongooseQueryConverter_1.MongooseQueryConverter(handler.getBasicQuery());
            return expect(converter.getConvertedQuery());
        }
        it('does nothing if the query is empty', function () {
            expectConvertedQuery(query => { }).toEqual({});
        });
        it('should simplify query with .where()', function () {
            expectConvertedQuery(query => query.where('a', 1)).toEqual({
                a: 1
            });
        });
        it('should simplify query with .where().where()', function () {
            expectConvertedQuery(query => query.where('a', 1).where('b', 2)).toEqual({
                a: 1,
                b: 2
            });
        });
        it('should simplify query with .where().where(..., ">")', function () {
            expectConvertedQuery(query => query.where('a', 1).where('b', '>', 2)).toEqual({
                a: 1,
                b: { $gt: 2 }
            });
        });
        it('should not simplify but converted query with .orWhere()', function () {
            expectConvertedQuery(query => query.orWhere('a', 1)).toEqual({
                $or: [{ a: 1 }]
            });
        });
        it('should not simplify but converted query with .where().orWhere()', function () {
            expectConvertedQuery(query => query.where('a', 1).orWhere('b', 2)).toEqual({
                $or: [{ a: 1 }, { b: 2 }]
            });
        });
        it('should not simplify if .where().where() has the same field', function () {
            expectConvertedQuery(query => query.where('a', 1).where('a', 2)).toEqual({
                $and: [{ a: 1 }, { a: 2 }]
            });
        });
        it('should not simplify if .where().where().where() if there is a sub query', function () {
            expectConvertedQuery(query => query
                .where('a', 1)
                .where('b', 2)
                .where(function (subQuery) {
                subQuery.where('c', 3).where('d', 4);
            })).toEqual({
                $and: [{ a: 1 }, { b: 2 }, { c: 3, d: 4 }]
            });
        });
        it('should simplify sub query with .where().where()', function () {
            expectConvertedQuery(query => query
                .where(function (subQuery) {
                subQuery.where('a', 1).where('b', 2);
            })
                .orWhere('c', 3)).toEqual({
                $or: [{ a: 1, b: 2 }, { c: 3 }]
            });
        });
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const util_1 = require("../../util");
const mongoose_1 = require("mongoose");
const najs_eloquent_1 = require("najs-eloquent");
const MongooseQueryBuilderHandler_1 = require("../../../lib/drivers/mongoose/MongooseQueryBuilderHandler");
const MongooseConvention_1 = require("../../../lib/drivers/mongoose/MongooseConvention");
const MongooseQueryExecutor_1 = require("../../../lib/drivers/mongoose/MongooseQueryExecutor");
const mongoose = require('mongoose');
describe('MongooseQueryBuilderHandler', function () {
    it('extends NajsEloquentLib.QueryBuilder.QueryBuilderHandlerBase', function () {
        const model = {};
        const instance = new MongooseQueryBuilderHandler_1.MongooseQueryBuilderHandler(model);
        expect(instance).toBeInstanceOf(najs_eloquent_1.NajsEloquent.QueryBuilder.QueryBuilderHandlerBase);
    });
    beforeAll(async function () {
        await util_1.init_mongoose(mongoose, 'mongoose_query_builder_handler');
    });
    describe('constructor()', function () {
        it('makes 3 instances, 1. convention = MongooseConvention', function () {
            const model = {};
            const handler = new MongooseQueryBuilderHandler_1.MongooseQueryBuilderHandler(model);
            expect(handler.getQueryConvention()).toBeInstanceOf(MongooseConvention_1.MongooseConvention);
        });
        it('makes 3 instances, 2. basicQuery = BasicQuery', function () {
            const model = {};
            const handler = new MongooseQueryBuilderHandler_1.MongooseQueryBuilderHandler(model);
            expect(handler.getBasicQuery()).toBeInstanceOf(najs_eloquent_1.NajsEloquent.QueryBuilder.Shared.BasicQuery);
        });
        it('makes 3 instances, 3. conditionQuery = ConditionQueryHandle which wrap "basicQuery"', function () {
            const model = {};
            const handler = new MongooseQueryBuilderHandler_1.MongooseQueryBuilderHandler(model);
            expect(handler.getConditionQuery()).toBeInstanceOf(najs_eloquent_1.NajsEloquent.QueryBuilder.Shared.ConditionQueryHandler);
            expect(handler.getConditionQuery()['basicConditionQuery'] === handler.getBasicQuery()).toBe(true);
        });
    });
    describe('.getBasicQuery()', function () {
        it('simply returns "basicQuery" property', function () {
            const model = {};
            const handler = new MongooseQueryBuilderHandler_1.MongooseQueryBuilderHandler(model);
            expect(handler.getBasicQuery() === handler['basicQuery']).toBe(true);
        });
    });
    describe('.getConditionQuery()', function () {
        it('simply returns "conditionQuery" property', function () {
            const model = {};
            const handler = new MongooseQueryBuilderHandler_1.MongooseQueryBuilderHandler(model);
            expect(handler.getConditionQuery() === handler['conditionQuery']).toBe(true);
        });
    });
    describe('.getQueryConvention()', function () {
        it('simply returns "convention" property', function () {
            const model = {};
            const handler = new MongooseQueryBuilderHandler_1.MongooseQueryBuilderHandler(model);
            expect(handler.getQueryConvention() === handler['convention']).toBe(true);
        });
    });
    describe('.getQueryExecutor()', function () {
        it('creates and returns new instance of MongooseQueryExecutor', function () {
            mongoose.model('Model', new mongoose_1.Schema({}));
            const model = {
                getModelName() {
                    return 'Model';
                }
            };
            const handler = new MongooseQueryBuilderHandler_1.MongooseQueryBuilderHandler(model);
            const executor1 = handler.getQueryExecutor();
            const executor2 = handler.getQueryExecutor();
            expect(executor1 === executor2).toBe(false);
            expect(executor1).toBeInstanceOf(MongooseQueryExecutor_1.MongooseQueryExecutor);
        });
    });
});

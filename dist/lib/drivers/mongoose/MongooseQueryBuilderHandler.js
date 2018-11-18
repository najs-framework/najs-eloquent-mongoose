"use strict";
/// <reference types="najs-eloquent" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const najs_eloquent_1 = require("najs-eloquent");
const MongooseConvention_1 = require("./MongooseConvention");
const MongooseExecutorFactory_1 = require("./MongooseExecutorFactory");
class MongooseQueryBuilderHandler extends najs_eloquent_1.NajsEloquent.QueryBuilder.QueryBuilderHandlerBase {
    constructor(model) {
        super(model, najs_binding_1.make(MongooseExecutorFactory_1.MongooseExecutorFactory.className));
        this.convention = new MongooseConvention_1.MongooseConvention();
        this.basicQuery = new najs_eloquent_1.NajsEloquent.QueryBuilder.Shared.BasicQuery(this.convention);
        this.conditionQuery = new najs_eloquent_1.NajsEloquent.QueryBuilder.Shared.ConditionQueryHandler(this.basicQuery, this.convention);
    }
    getBasicQuery() {
        return this.basicQuery;
    }
    getConditionQuery() {
        return this.conditionQuery;
    }
    getQueryConvention() {
        return this.convention;
    }
}
exports.MongooseQueryBuilderHandler = MongooseQueryBuilderHandler;

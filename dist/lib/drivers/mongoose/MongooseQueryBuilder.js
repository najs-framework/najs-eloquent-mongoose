"use strict";
/// <reference types="najs-eloquent" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_eloquent_1 = require("najs-eloquent");
class MongooseQueryBuilder extends najs_eloquent_1.NajsEloquent.QueryBuilder.QueryBuilder {
    native(handler) {
        const executor = this.handler.getQueryExecutor();
        return executor.native(handler);
    }
    nativeModel() {
        const executor = this.handler.getQueryExecutor();
        return executor.getMongooseModel();
    }
}
exports.MongooseQueryBuilder = MongooseQueryBuilder;

"use strict";
/// <reference types="najs-eloquent" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const MongooseRecordExecutor_1 = require("./MongooseRecordExecutor");
const MongooseQueryExecutor_1 = require("./MongooseQueryExecutor");
const MongooseQueryLog_1 = require("./MongooseQueryLog");
const MongooseProviderFacade_1 = require("../../facades/global/MongooseProviderFacade");
const constants_1 = require("../../constants");
class MongooseExecutorFactory {
    getClassName() {
        return constants_1.ClassNames.Driver.Mongoose.MongooseExecutorFactory;
    }
    makeRecordExecutor(model, document) {
        return new MongooseRecordExecutor_1.MongooseRecordExecutor(model, document, this.makeLogger());
    }
    makeQueryExecutor(handler) {
        return new MongooseQueryExecutor_1.MongooseQueryExecutor(handler, this.getMongooseModel(handler.getModel()), this.makeLogger());
    }
    getMongooseModel(model) {
        return MongooseProviderFacade_1.MongooseProviderFacade.getMongooseInstance().model(model.getModelName());
    }
    makeLogger() {
        return new MongooseQueryLog_1.MongooseQueryLog();
    }
}
MongooseExecutorFactory.className = constants_1.ClassNames.Driver.Mongoose.MongooseExecutorFactory;
exports.MongooseExecutorFactory = MongooseExecutorFactory;
najs_binding_1.register(MongooseExecutorFactory, constants_1.ClassNames.Driver.Mongoose.MongooseExecutorFactory, true, true);

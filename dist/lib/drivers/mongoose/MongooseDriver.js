"use strict";
/// <reference types="najs-eloquent" />
Object.defineProperty(exports, "__esModule", { value: true });
require("./MongooseDocumentManager");
const najs_binding_1 = require("najs-binding");
const najs_eloquent_1 = require("najs-eloquent");
const constants_1 = require("../../constants");
const MongooseQueryBuilderFactory_1 = require("./MongooseQueryBuilderFactory");
const MongooseExecutorFactory_1 = require("./MongooseExecutorFactory");
class MongooseDriver extends najs_eloquent_1.NajsEloquent.Driver.DriverBase {
    constructor() {
        super();
        this.documentManager = najs_binding_1.make(constants_1.ClassNames.Driver.Mongoose.MongooseDocumentManager, [
            najs_binding_1.make(MongooseExecutorFactory_1.MongooseExecutorFactory.className)
        ]);
    }
    getClassName() {
        return constants_1.ClassNames.Driver.MongooseDriver;
    }
    getRecordManager() {
        return this.documentManager;
    }
    makeQueryBuilderFactory() {
        return najs_binding_1.make(MongooseQueryBuilderFactory_1.MongooseQueryBuilderFactory.className);
    }
}
MongooseDriver.Name = 'mongoose';
exports.MongooseDriver = MongooseDriver;
najs_binding_1.register(MongooseDriver, constants_1.ClassNames.Driver.MongooseDriver);

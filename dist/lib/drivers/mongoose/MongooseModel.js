"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_eloquent_1 = require("najs-eloquent");
const MongooseDriver_1 = require("./MongooseDriver");
class MongooseModel extends najs_eloquent_1.Model {
    makeDriver() {
        if (!najs_eloquent_1.DriverProvider.has(MongooseDriver_1.MongooseDriver)) {
            najs_eloquent_1.DriverProvider.register(MongooseDriver_1.MongooseDriver, MongooseDriver_1.MongooseDriver.name);
            najs_eloquent_1.DriverProvider.bind(this.getModelName(), MongooseDriver_1.MongooseDriver.name);
        }
        return super.makeDriver();
    }
    newQuery() {
        return super.newQuery();
    }
    getNativeModel() {
        return this.newQuery().nativeModel();
    }
}
exports.MongooseModel = MongooseModel;
najs_eloquent_1.NajsEloquent.Util.PrototypeManager.stopFindingRelationsIn(MongooseModel.prototype);

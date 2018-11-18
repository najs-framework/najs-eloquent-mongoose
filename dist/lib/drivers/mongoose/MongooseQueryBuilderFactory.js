"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
const MongooseQueryBuilder_1 = require("./MongooseQueryBuilder");
const MongooseQueryBuilderHandler_1 = require("./MongooseQueryBuilderHandler");
class MongooseQueryBuilderFactory {
    getClassName() {
        return constants_1.ClassNames.Driver.Mongoose.MongooseQueryBuilderFactory;
    }
    make(model) {
        return new MongooseQueryBuilder_1.MongooseQueryBuilder(new MongooseQueryBuilderHandler_1.MongooseQueryBuilderHandler(model));
    }
}
MongooseQueryBuilderFactory.className = constants_1.ClassNames.Driver.Mongoose.MongooseQueryBuilderFactory;
exports.MongooseQueryBuilderFactory = MongooseQueryBuilderFactory;
najs_binding_1.register(MongooseQueryBuilderFactory, constants_1.ClassNames.Driver.Mongoose.MongooseQueryBuilderFactory, true, true);

"use strict";
/// <reference types="najs-eloquent" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
const MongooseConditionMatcher_1 = require("./MongooseConditionMatcher");
class MongooseConditionMatcherFactory {
    getClassName() {
        return constants_1.ClassNames.Driver.Mongoose.MongooseConditionMatcherFactory;
    }
    make(data) {
        return new MongooseConditionMatcher_1.MongooseConditionMatcher(data.field, data.operator, data.value);
    }
    transform(matcher) {
        return matcher;
    }
}
MongooseConditionMatcherFactory.className = constants_1.ClassNames.Driver.Mongoose.MongooseConditionMatcherFactory;
exports.MongooseConditionMatcherFactory = MongooseConditionMatcherFactory;
najs_binding_1.register(MongooseConditionMatcherFactory, constants_1.ClassNames.Driver.Mongoose.MongooseConditionMatcherFactory, true, true);

"use strict";
/// <reference types="najs-eloquent" />
Object.defineProperty(exports, "__esModule", { value: true });
class MongooseConvention {
    formatFieldName(name) {
        if (name === 'id') {
            return '_id';
        }
        return name;
    }
    getNullValueFor(name) {
        // tslint:disable-next-line
        return null;
    }
}
exports.MongooseConvention = MongooseConvention;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_eloquent_1 = require("najs-eloquent");
class MongooseQueryLog extends najs_eloquent_1.NajsEloquent.Driver.QueryLogBase {
    getDefaultData() {
        return this.getEmptyData();
    }
    query(data) {
        this.data.query = data;
        return data;
    }
    options(data) {
        this.data.options = data;
        return data;
    }
}
exports.MongooseQueryLog = MongooseQueryLog;

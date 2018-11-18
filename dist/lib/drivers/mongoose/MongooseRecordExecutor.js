"use strict";
/// <reference types="najs-eloquent" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_eloquent_1 = require("najs-eloquent");
const MongooseConvention_1 = require("./MongooseConvention");
class MongooseRecordExecutor extends najs_eloquent_1.NajsEloquent.Driver.ExecutorBase {
    constructor(model, document, logger) {
        super();
        this.model = model;
        this.document = document;
        this.logger = logger;
        this.convention = new MongooseConvention_1.MongooseConvention();
    }
    async create() {
        const result = this.shouldExecute() ? await this.document.save() : {};
        return this.logRaw('save')
            .action(`${this.model.getModelName()}.create()`)
            .end(result);
    }
    async update() {
        const result = this.shouldExecute() ? await this.document.save() : {};
        return this.logRaw('save')
            .action(`${this.model.getModelName()}.update()`)
            .end(result);
    }
    async softDelete() {
        const result = this.shouldExecute() ? await this.document['delete']() : {};
        return this.logRaw('delete')
            .action(`${this.model.getModelName()}.softDelete()`)
            .end(result);
    }
    async hardDelete() {
        const result = this.shouldExecute() ? await this.document.remove() : {};
        return this.logRaw('remove')
            .action(`${this.model.getModelName()}.hardDelete()`)
            .end(result);
    }
    async restore() {
        const result = this.shouldExecute() ? await this.document['restore']() : {};
        return this.logRaw('restore')
            .action(`${this.model.getModelName()}.restore()`)
            .end(result);
    }
    logRaw(func) {
        return this.logger.raw(this.document.modelName || this.model.getModelName(), `.${func}()`);
    }
}
exports.MongooseRecordExecutor = MongooseRecordExecutor;

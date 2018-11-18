"use strict";
/// <reference types="najs-eloquent" />
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
const najs_binding_1 = require("najs-binding");
const SoftDelete_1 = require("./plugins/SoftDelete");
const najs_eloquent_1 = require("najs-eloquent");
const MongooseProviderFacade_1 = require("../../facades/global/MongooseProviderFacade");
const constants_1 = require("../../constants");
const setupTimestampMoment = require('mongoose-timestamps-moment').setupTimestamp;
class MongooseDocumentManager extends najs_eloquent_1.NajsEloquent.Driver.RecordManagerBase {
    getClassName() {
        return constants_1.ClassNames.Driver.Mongoose.MongooseDocumentManager;
    }
    initialize(model, isGuarded, data) {
        this.initializeMongooseModelIfNeeded(model);
        const MongooseModel = MongooseProviderFacade_1.MongooseProvider.getMongooseInstance().model(model.getModelName());
        if (data instanceof MongooseModel) {
            model.attributes = data;
            return;
        }
        model.attributes = new MongooseModel();
        if (typeof data === 'object') {
            if (isGuarded) {
                model.fill(data);
            }
            else {
                model.attributes.set(data);
            }
        }
    }
    initializeMongooseModelIfNeeded(model) {
        const modelName = model.getModelName();
        // prettier-ignore
        if (MongooseProviderFacade_1.MongooseProvider.getMongooseInstance().modelNames().indexOf(modelName) !== -1) {
            return;
        }
        const schema = this.getMongooseSchema(model);
        const timestampsFeature = model.getDriver().getTimestampsFeature();
        if (timestampsFeature.hasTimestamps(model)) {
            schema.set('timestamps', timestampsFeature.getTimestampsSetting(model));
        }
        const softDeletesFeature = model.getDriver().getSoftDeletesFeature();
        if (softDeletesFeature.hasSoftDeletes(model)) {
            schema.plugin(SoftDelete_1.SoftDelete, softDeletesFeature.getSoftDeletesSetting(model));
        }
        MongooseProviderFacade_1.MongooseProvider.createModelFromSchema(modelName, schema);
    }
    getMongooseSchema(model) {
        let schema = undefined;
        if (lodash_1.isFunction(model['getSchema'])) {
            schema = model['getSchema']();
        }
        if (!schema || !(schema instanceof mongoose_1.Schema)) {
            schema = new mongoose_1.Schema(this.getSchemaDefinition(model), this.getSchemaOptions(model));
        }
        Object.getPrototypeOf(schema).setupTimestamp = setupTimestampMoment;
        return schema;
    }
    getSchemaDefinition(model) {
        return model
            .getDriver()
            .getSettingFeature()
            .getSettingProperty(model, 'schema', {});
    }
    getSchemaOptions(model) {
        return Object.assign({ collection: this.getRecordName(model) }, model
            .getDriver()
            .getSettingFeature()
            .getSettingProperty(model, 'options', {}));
    }
    getAttribute(model, key) {
        return model.attributes.get(key);
    }
    setAttribute(model, key, value) {
        model.attributes.set(key, value);
        return true;
    }
    hasAttribute(model, key) {
        return typeof this.getSchemaDefinition(model)[key] !== 'undefined';
    }
    getPrimaryKeyName(model) {
        return model
            .getDriver()
            .getSettingFeature()
            .getSettingProperty(model, 'primaryKey', '_id');
    }
    toObject(model) {
        return model.attributes.toObject({ virtuals: true });
    }
    markModified(model, keys) {
        const attributes = lodash_1.flatten(lodash_1.flatten(keys));
        for (const attribute of attributes) {
            model.attributes.markModified(attribute);
        }
    }
    isModified(model, keys) {
        const attributes = lodash_1.flatten(lodash_1.flatten(keys));
        const record = this.getRecord(model);
        for (const attribute of attributes) {
            if (!record.isModified(attribute)) {
                return false;
            }
        }
        return true;
    }
    getModified(model) {
        return model.attributes.modifiedPaths();
    }
    isNew(model) {
        return this.getRecord(model).isNew;
    }
}
exports.MongooseDocumentManager = MongooseDocumentManager;
najs_binding_1.register(MongooseDocumentManager, constants_1.ClassNames.Driver.Mongoose.MongooseDocumentManager);

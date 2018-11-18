import Model = NajsEloquent.Model.ModelInternal;
import { Document, Schema, SchemaDefinition } from 'mongoose';
import { NajsEloquent as NajsEloquentLib } from 'najs-eloquent';
export declare class MongooseDocumentManager extends NajsEloquentLib.Driver.RecordManagerBase<Document> {
    getClassName(): string;
    initialize(model: Model<Document>, isGuarded: boolean, data?: Document | object): void;
    initializeMongooseModelIfNeeded(model: Model<Document>): void;
    getMongooseSchema(model: Model<Document>): Schema;
    getSchemaDefinition(model: Model): SchemaDefinition;
    getSchemaOptions(model: Model): {
        collection: string;
    };
    getAttribute(model: Model<Document>, key: string): any;
    setAttribute<T>(model: Model<Document>, key: string, value: T): boolean;
    hasAttribute(model: Model, key: string): boolean;
    getPrimaryKeyName(model: Model<Document>): string;
    toObject(model: Model<Document>): object;
    markModified(model: Model<Document>, keys: ArrayLike<Array<string | string[]>>): void;
    isModified(model: Model<Document>, keys: ArrayLike<Array<string | string[]>>): boolean;
    getModified(model: Model<Document>): string[];
    isNew(model: Model<Document>): boolean;
}

import { Model } from 'najs-eloquent';
import { MongooseQueryBuilder } from './MongooseQueryBuilder';
import { MongooseQueryBuilderHandler } from './MongooseQueryBuilderHandler';
import { Document, Model as NativeModel, SchemaDefinition, SchemaOptions } from 'mongoose';
export declare class MongooseModel extends Model {
    id?: string;
    protected schema?: SchemaDefinition;
    protected options?: SchemaOptions;
    protected makeDriver<T>(): Najs.Contracts.Eloquent.Driver<T>;
    newQuery(): MongooseQueryBuilder<this, MongooseQueryBuilderHandler>;
    getNativeModel(): NativeModel<Document & this>;
}

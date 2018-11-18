import { NajsEloquent } from 'najs-eloquent';
import { MongooseQueryBuilderHandler } from './MongooseQueryBuilderHandler';
import { MongooseQueryExecutor } from './MongooseQueryExecutor';
import { Document, Model as MongooseModel, Query as MongooseQuery } from 'mongoose';
export declare class MongooseQueryBuilder<T, H extends MongooseQueryBuilderHandler = MongooseQueryBuilderHandler> extends NajsEloquent.QueryBuilder.QueryBuilder<T, H> {
    native(handler: (native: MongooseQuery<Document & T>) => MongooseQuery<any>): MongooseQueryExecutor;
    nativeModel(): MongooseModel<Document & T>;
}

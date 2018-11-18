import IModel = NajsEloquent.Model.IModel;
import IQueryBuilderHandler = NajsEloquent.QueryBuilder.IQueryBuilderHandler;
import { Document, Model as MongooseModel } from 'mongoose';
import { MongooseRecordExecutor } from './MongooseRecordExecutor';
import { MongooseQueryExecutor } from './MongooseQueryExecutor';
import { MongooseQueryLog } from './MongooseQueryLog';
export declare class MongooseExecutorFactory implements NajsEloquent.Driver.IExecutorFactory {
    static className: string;
    getClassName(): string;
    makeRecordExecutor<T extends Document>(model: IModel, document: T): MongooseRecordExecutor;
    makeQueryExecutor(handler: IQueryBuilderHandler): MongooseQueryExecutor;
    getMongooseModel(model: IModel): MongooseModel<any>;
    makeLogger(): MongooseQueryLog;
}

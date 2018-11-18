import IConvention = NajsEloquent.QueryBuilder.IConvention;
import Model = NajsEloquent.Model.IModel;
import { Document } from 'mongoose';
import { NajsEloquent as NajsEloquentLib } from 'najs-eloquent';
import { MongooseQueryLog } from './MongooseQueryLog';
export declare class MongooseRecordExecutor extends NajsEloquentLib.Driver.ExecutorBase implements NajsEloquent.Feature.IRecordExecutor {
    protected model: NajsEloquent.Model.IModel;
    protected document: Document;
    protected logger: MongooseQueryLog;
    protected convention: IConvention;
    constructor(model: Model, document: Document, logger: MongooseQueryLog);
    create<R = any>(): Promise<R>;
    update<R = any>(): Promise<R>;
    softDelete<R = any>(): Promise<R>;
    hardDelete<R = any>(): Promise<R>;
    restore<R = any>(): Promise<R>;
    logRaw(func: string): MongooseQueryLog;
}

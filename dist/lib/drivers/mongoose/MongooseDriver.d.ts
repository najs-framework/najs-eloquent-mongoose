import './MongooseDocumentManager';
import { NajsEloquent as NajsEloquentLib } from 'najs-eloquent';
import { Document } from 'mongoose';
import { MongooseQueryBuilderFactory } from './MongooseQueryBuilderFactory';
export declare class MongooseDriver<T extends Document = Document> extends NajsEloquentLib.Driver.DriverBase<T> {
    protected documentManager: NajsEloquent.Feature.IRecordManager<T>;
    static Name: string;
    constructor();
    getClassName(): string;
    getRecordManager(): NajsEloquent.Feature.IRecordManager<T>;
    makeQueryBuilderFactory(): MongooseQueryBuilderFactory;
}

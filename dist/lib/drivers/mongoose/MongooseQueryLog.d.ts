import { NajsEloquent } from 'najs-eloquent';
export interface IMongooseQueryLogData extends NajsEloquent.Driver.IQueryLogData {
    query?: object;
    options?: object;
}
export declare class MongooseQueryLog extends NajsEloquent.Driver.QueryLogBase<IMongooseQueryLogData> {
    getDefaultData(): IMongooseQueryLogData;
    query(data: object): object;
    options(data: object | undefined): object | undefined;
}

import { NajsEloquent as NajsEloquentLib } from 'najs-eloquent';
import { MongooseConditionMatcher } from './MongooseConditionMatcher';
export declare type RawConditions = Array<MongooseConditionMatcher | RawConvertedQuery>;
export declare type RawConvertedQuery = {
    $and: RawConditions[];
} | {
    $or: RawConditions[];
} | {};
export declare class MongooseQueryConverter {
    protected basicQuery: NajsEloquentLib.QueryBuilder.Shared.BasicQuery;
    constructor(basicQuery: NajsEloquentLib.QueryBuilder.Shared.BasicQuery);
    getConvertedQuery(): object;
    getRawConvertedQueryFromBasicQueryConverter(): RawConvertedQuery;
    convert(rawQuery: RawConvertedQuery): object;
    toMongodbQuery(conditions: RawConditions): object[];
    simplify(conditions: MongooseConditionMatcher[]): {};
    shouldSimplify(conditions: RawConditions): boolean;
}

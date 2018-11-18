import IConditionMatcherFactory = NajsEloquent.QueryBuilder.IConditionMatcherFactory;
import SingleQueryConditionData = NajsEloquent.QueryBuilder.SingleQueryConditionData;
import { MongooseConditionMatcher } from './MongooseConditionMatcher';
export declare class MongooseConditionMatcherFactory implements IConditionMatcherFactory {
    static className: string;
    getClassName(): string;
    make(data: SingleQueryConditionData): MongooseConditionMatcher;
    transform(matcher: MongooseConditionMatcher): MongooseConditionMatcher;
}

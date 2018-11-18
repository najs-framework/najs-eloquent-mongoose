import { MongooseQueryBuilder } from './MongooseQueryBuilder';
export declare class MongooseQueryBuilderFactory implements NajsEloquent.QueryBuilder.IQueryBuilderFactory {
    static className: string;
    getClassName(): string;
    make(model: NajsEloquent.Model.IModel): MongooseQueryBuilder<any>;
}

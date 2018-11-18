import { NajsEloquent as NajsEloquentLib } from 'najs-eloquent';
export declare class MongooseQueryBuilderHandler extends NajsEloquentLib.QueryBuilder.QueryBuilderHandlerBase {
    protected basicQuery: NajsEloquentLib.QueryBuilder.Shared.BasicQuery;
    protected conditionQuery: NajsEloquentLib.QueryBuilder.Shared.ConditionQueryHandler;
    protected convention: NajsEloquent.QueryBuilder.IConvention;
    constructor(model: IModel);
    getBasicQuery(): NajsEloquentLib.QueryBuilder.Shared.BasicQuery;
    getConditionQuery(): NajsEloquent.QueryGrammar.IConditionQuery;
    getQueryConvention(): NajsEloquent.QueryBuilder.IConvention;
}

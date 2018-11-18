/// <reference types="najs-eloquent" />

import { make } from 'najs-binding'
import { NajsEloquent as NajsEloquentLib } from 'najs-eloquent'
import { MongooseConvention } from './MongooseConvention'
import { MongooseExecutorFactory } from './MongooseExecutorFactory'

export class MongooseQueryBuilderHandler extends NajsEloquentLib.QueryBuilder.QueryBuilderHandlerBase {
  protected basicQuery: NajsEloquentLib.QueryBuilder.Shared.BasicQuery
  protected conditionQuery: NajsEloquentLib.QueryBuilder.Shared.ConditionQueryHandler
  protected convention: NajsEloquent.QueryBuilder.IConvention

  constructor(model: IModel) {
    super(model, make<MongooseExecutorFactory>(MongooseExecutorFactory.className))
    this.convention = new MongooseConvention()
    this.basicQuery = new NajsEloquentLib.QueryBuilder.Shared.BasicQuery(this.convention)
    this.conditionQuery = new NajsEloquentLib.QueryBuilder.Shared.ConditionQueryHandler(
      this.basicQuery,
      this.convention
    )
  }

  getBasicQuery(): NajsEloquentLib.QueryBuilder.Shared.BasicQuery {
    return this.basicQuery
  }

  getConditionQuery(): NajsEloquent.QueryGrammar.IConditionQuery {
    return this.conditionQuery
  }

  getQueryConvention(): NajsEloquent.QueryBuilder.IConvention {
    return this.convention
  }
}

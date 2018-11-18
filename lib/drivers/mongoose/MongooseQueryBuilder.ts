/// <reference types="najs-eloquent" />

import { NajsEloquent } from 'najs-eloquent'
import { MongooseQueryBuilderHandler } from './MongooseQueryBuilderHandler'
import { MongooseQueryExecutor } from './MongooseQueryExecutor'
import { Document, Model as MongooseModel, Query as MongooseQuery } from 'mongoose'

export class MongooseQueryBuilder<
  T,
  H extends MongooseQueryBuilderHandler = MongooseQueryBuilderHandler
> extends NajsEloquent.QueryBuilder.QueryBuilder<T, H> {
  native(handler: (native: MongooseQuery<Document & T>) => MongooseQuery<any>) {
    const executor: MongooseQueryExecutor = this.handler.getQueryExecutor() as MongooseQueryExecutor
    return executor.native(handler)
  }

  nativeModel(): MongooseModel<Document & T> {
    const executor: MongooseQueryExecutor = this.handler.getQueryExecutor() as MongooseQueryExecutor
    return executor.getMongooseModel()
  }
}

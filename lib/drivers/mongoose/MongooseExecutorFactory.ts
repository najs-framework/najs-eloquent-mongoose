/// <reference types="najs-eloquent" />

import IModel = NajsEloquent.Model.IModel
import IQueryBuilderHandler = NajsEloquent.QueryBuilder.IQueryBuilderHandler
import { register } from 'najs-binding'
import { Document, Model as MongooseModel } from 'mongoose'
import { MongooseRecordExecutor } from './MongooseRecordExecutor'
import { MongooseQueryExecutor } from './MongooseQueryExecutor'
import { MongooseQueryLog } from './MongooseQueryLog'
import { MongooseProviderFacade } from '../../facades/global/MongooseProviderFacade'
import { MongooseQueryBuilderHandler } from './MongooseQueryBuilderHandler'
import { ClassNames } from '../../constants'

export class MongooseExecutorFactory implements NajsEloquent.Driver.IExecutorFactory {
  static className: string = ClassNames.Driver.Mongoose.MongooseExecutorFactory

  getClassName() {
    return ClassNames.Driver.Mongoose.MongooseExecutorFactory
  }

  makeRecordExecutor<T extends Document>(model: IModel, document: T): MongooseRecordExecutor {
    return new MongooseRecordExecutor(model, document, this.makeLogger())
  }

  makeQueryExecutor(handler: IQueryBuilderHandler): MongooseQueryExecutor {
    return new MongooseQueryExecutor(
      handler as MongooseQueryBuilderHandler,
      this.getMongooseModel(handler.getModel()),
      this.makeLogger()
    )
  }

  getMongooseModel(model: IModel): MongooseModel<any> {
    return MongooseProviderFacade.getMongooseInstance().model(model.getModelName())
  }

  makeLogger(): MongooseQueryLog {
    return new MongooseQueryLog()
  }
}
register(MongooseExecutorFactory, ClassNames.Driver.Mongoose.MongooseExecutorFactory, true, true)

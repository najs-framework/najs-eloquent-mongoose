/// <reference types="najs-eloquent" />

import './MongooseDocumentManager'
import { register, make } from 'najs-binding'
import { NajsEloquent as NajsEloquentLib } from 'najs-eloquent'
import { Document } from 'mongoose'
import { ClassNames } from '../../constants'
import { MongooseQueryBuilderFactory } from './MongooseQueryBuilderFactory'
import { MongooseExecutorFactory } from './MongooseExecutorFactory'

export class MongooseDriver<T extends Document = Document> extends NajsEloquentLib.Driver.DriverBase<T> {
  protected documentManager: NajsEloquent.Feature.IRecordManager<T>
  static Name = 'mongoose'

  constructor() {
    super()

    this.documentManager = make(ClassNames.Driver.Mongoose.MongooseDocumentManager, [
      make(MongooseExecutorFactory.className)
    ])
  }

  getClassName() {
    return ClassNames.Driver.MongooseDriver
  }

  getRecordManager() {
    return this.documentManager
  }

  makeQueryBuilderFactory() {
    return make<MongooseQueryBuilderFactory>(MongooseQueryBuilderFactory.className)
  }
}
register(MongooseDriver, ClassNames.Driver.MongooseDriver)

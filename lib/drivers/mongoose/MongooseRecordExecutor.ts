/// <reference types="najs-eloquent" />

import IConvention = NajsEloquent.QueryBuilder.IConvention
import Model = NajsEloquent.Model.IModel
import { Document } from 'mongoose'
import { NajsEloquent as NajsEloquentLib } from 'najs-eloquent'
import { MongooseQueryLog } from './MongooseQueryLog'
import { MongooseConvention } from './MongooseConvention'

export class MongooseRecordExecutor extends NajsEloquentLib.Driver.ExecutorBase
  implements NajsEloquent.Feature.IRecordExecutor {
  protected model: NajsEloquent.Model.IModel
  protected document: Document
  protected logger: MongooseQueryLog
  protected convention: IConvention

  constructor(model: Model, document: Document, logger: MongooseQueryLog) {
    super()
    this.model = model
    this.document = document
    this.logger = logger
    this.convention = new MongooseConvention()
  }

  async create<R = any>(): Promise<R> {
    const result = this.shouldExecute() ? await this.document.save() : {}
    return this.logRaw('save')
      .action(`${this.model.getModelName()}.create()`)
      .end(result)
  }

  async update<R = any>(): Promise<R> {
    const result = this.shouldExecute() ? await this.document.save() : {}
    return this.logRaw('save')
      .action(`${this.model.getModelName()}.update()`)
      .end(result)
  }

  async softDelete<R = any>(): Promise<R> {
    const result = this.shouldExecute() ? await this.document['delete']() : {}
    return this.logRaw('delete')
      .action(`${this.model.getModelName()}.softDelete()`)
      .end(result)
  }

  async hardDelete<R = any>(): Promise<R> {
    const result = this.shouldExecute() ? await this.document.remove() : {}
    return this.logRaw('remove')
      .action(`${this.model.getModelName()}.hardDelete()`)
      .end(result)
  }

  async restore<R = any>(): Promise<R> {
    const result = this.shouldExecute() ? await this.document['restore']() : {}
    return this.logRaw('restore')
      .action(`${this.model.getModelName()}.restore()`)
      .end(result)
  }

  logRaw(func: string): MongooseQueryLog {
    return this.logger.raw(this.document.modelName || this.model.getModelName(), `.${func}()`)
  }
}

import 'jest'
import { init_mongoose } from '../../util'
import { Schema } from 'mongoose'
import { NajsEloquent as NajsEloquentLib } from 'najs-eloquent'
import { MongooseQueryBuilderHandler } from '../../../lib/drivers/mongoose/MongooseQueryBuilderHandler'
import { MongooseConvention } from '../../../lib/drivers/mongoose/MongooseConvention'
import { MongooseQueryExecutor } from '../../../lib/drivers/mongoose/MongooseQueryExecutor'
const mongoose = require('mongoose')

describe('MongooseQueryBuilderHandler', function() {
  it('extends NajsEloquentLib.QueryBuilder.QueryBuilderHandlerBase', function() {
    const model: any = {}
    const instance = new MongooseQueryBuilderHandler(model)
    expect(instance).toBeInstanceOf(NajsEloquentLib.QueryBuilder.QueryBuilderHandlerBase)
  })

  beforeAll(async function() {
    await init_mongoose(mongoose, 'mongoose_query_builder_handler')
  })

  describe('constructor()', function() {
    it('makes 3 instances, 1. convention = MongooseConvention', function() {
      const model: any = {}
      const handler = new MongooseQueryBuilderHandler(model)
      expect(handler.getQueryConvention()).toBeInstanceOf(MongooseConvention)
    })

    it('makes 3 instances, 2. basicQuery = BasicQuery', function() {
      const model: any = {}
      const handler = new MongooseQueryBuilderHandler(model)
      expect(handler.getBasicQuery()).toBeInstanceOf(NajsEloquentLib.QueryBuilder.Shared.BasicQuery)
    })

    it('makes 3 instances, 3. conditionQuery = ConditionQueryHandle which wrap "basicQuery"', function() {
      const model: any = {}
      const handler = new MongooseQueryBuilderHandler(model)
      expect(handler.getConditionQuery()).toBeInstanceOf(NajsEloquentLib.QueryBuilder.Shared.ConditionQueryHandler)
      expect(handler.getConditionQuery()['basicConditionQuery'] === handler.getBasicQuery()).toBe(true)
    })
  })

  describe('.getBasicQuery()', function() {
    it('simply returns "basicQuery" property', function() {
      const model: any = {}
      const handler = new MongooseQueryBuilderHandler(model)
      expect(handler.getBasicQuery() === handler['basicQuery']).toBe(true)
    })
  })

  describe('.getConditionQuery()', function() {
    it('simply returns "conditionQuery" property', function() {
      const model: any = {}
      const handler = new MongooseQueryBuilderHandler(model)
      expect(handler.getConditionQuery() === handler['conditionQuery']).toBe(true)
    })
  })

  describe('.getQueryConvention()', function() {
    it('simply returns "convention" property', function() {
      const model: any = {}
      const handler = new MongooseQueryBuilderHandler(model)
      expect(handler.getQueryConvention() === handler['convention']).toBe(true)
    })
  })

  describe('.getQueryExecutor()', function() {
    it('creates and returns new instance of MongooseQueryExecutor', function() {
      mongoose.model('Model', new Schema({}))
      const model: any = {
        getModelName() {
          return 'Model'
        }
      }
      const handler = new MongooseQueryBuilderHandler(model)
      const executor1 = handler.getQueryExecutor()
      const executor2 = handler.getQueryExecutor()
      expect(executor1 === executor2).toBe(false)
      expect(executor1).toBeInstanceOf(MongooseQueryExecutor)
    })
  })
})

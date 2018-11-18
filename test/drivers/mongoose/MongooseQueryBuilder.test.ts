import 'jest'
import * as Sinon from 'sinon'
import { NajsEloquent as NajsEloquentLib } from 'najs-eloquent'
import { MongooseQueryBuilder } from '../../../lib/drivers/mongoose/MongooseQueryBuilder'
import { MongooseQueryBuilderHandler } from '../../../lib/drivers/mongoose/MongooseQueryBuilderHandler'

describe('MongooseQueryBuilder', function() {
  it('extends QueryBuilder', function() {
    const model: any = {}
    const instance = new MongooseQueryBuilder(new MongooseQueryBuilderHandler(model))
    expect(instance).toBeInstanceOf(NajsEloquentLib.QueryBuilder.QueryBuilder)
  })

  describe('.native()', function() {
    it('simply calls and returns QueryExecutor.native()', function() {
      const fakeExecutor = {
        native() {
          return 'anything'
        }
      }
      const fakeHandler: any = {
        getQueryExecutor() {
          return fakeExecutor
        }
      }

      const queryBuilder = new MongooseQueryBuilder(fakeHandler)
      const spy = Sinon.spy(fakeExecutor, 'native')

      const handler: any = {}
      expect(queryBuilder.native(handler)).toEqual('anything')
      expect(spy.calledWith(handler)).toBe(true)
    })
  })

  describe('.nativeModel()', function() {
    it('simply calls and returns QueryExecutor.getCollection()', function() {
      const fakeExecutor = {
        getMongooseModel() {
          return 'anything'
        }
      }
      const fakeHandler: any = {
        getQueryExecutor() {
          return fakeExecutor
        }
      }

      const queryBuilder = new MongooseQueryBuilder(fakeHandler)
      const spy = Sinon.spy(fakeExecutor, 'getMongooseModel')

      expect(queryBuilder.nativeModel()).toEqual('anything')
      expect(spy.calledWith()).toBe(true)
    })
  })
})

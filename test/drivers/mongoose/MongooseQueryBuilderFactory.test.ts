import 'jest'
import { make } from 'najs-binding'
import { MongooseQueryBuilder } from '../../../lib/drivers/mongoose/MongooseQueryBuilder'
import { MongooseQueryBuilderFactory } from '../../../lib/drivers/mongoose/MongooseQueryBuilderFactory'

describe('MongooseQueryBuilderFactory', function() {
  it('implements IAutoload and register with singleton option = true', function() {
    const a = make<MongooseQueryBuilderFactory>(MongooseQueryBuilderFactory.className)
    const b = make<MongooseQueryBuilderFactory>(MongooseQueryBuilderFactory.className)
    expect(a.getClassName()).toEqual('NajsEloquent.Driver.Mongoose.MongooseQueryBuilderFactory')
    expect(a === b).toBe(true)
  })

  describe('.make()', function() {
    it('creates new instance of MongooseQueryBuilder', function() {
      const model: any = {
        getRecordName() {
          return 'Model'
        }
      }
      const factory = make<MongooseQueryBuilderFactory>(MongooseQueryBuilderFactory.className)
      const qb1 = factory.make(model)
      const qb2 = factory.make(model)
      expect(qb1).toBeInstanceOf(MongooseQueryBuilder)
      expect(qb1 === qb2).toBe(false)
    })
  })
})

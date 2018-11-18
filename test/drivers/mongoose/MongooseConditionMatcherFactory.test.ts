import 'jest'
import { make } from 'najs-binding'
import { MongooseConditionMatcher } from '../../../lib/drivers/mongoose/MongooseConditionMatcher'
import { MongooseConditionMatcherFactory } from '../../../lib/drivers/mongoose/MongooseConditionMatcherFactory'

describe('MongooseConditionMatcherFactory', function() {
  it('implements NajsEloquent.QueryBuilder.IConditionMatcherFactory, Autoload under name "NajsEloquent.Driver.Mongoose.MongooseConditionMatcherFactory" with singleton option', function() {
    const factory = make<MongooseConditionMatcherFactory>(MongooseConditionMatcherFactory.className)
    const instance = make<MongooseConditionMatcherFactory>(MongooseConditionMatcherFactory.className)
    expect(factory === instance).toBe(true)
    expect(factory.getClassName()).toEqual('NajsEloquent.Driver.Mongoose.MongooseConditionMatcherFactory')
  })

  describe('.make()', function() {
    it('returns an instance of MongooseConditionMatcher', function() {
      const factory = make<MongooseConditionMatcherFactory>(MongooseConditionMatcherFactory.className)
      const data: any = {
        field: 'a',
        operator: '=',
        value: 'anything'
      }
      const matcher = factory.make(data)
      expect(matcher).toBeInstanceOf(MongooseConditionMatcher)
      expect(matcher.toMongodbQuery()).toEqual({ a: 'anything' })
    })
  })

  describe('.transform()', function() {
    it('does nothing, just return the given object', function() {
      const factory = make<MongooseConditionMatcherFactory>(MongooseConditionMatcherFactory.className)
      const given: any = {}
      expect(factory.transform(given) === given).toBe(true)
    })
  })
})

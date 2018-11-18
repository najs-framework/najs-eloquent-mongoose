import 'jest'
import { MongooseConvention } from '../../../lib/drivers/mongoose/MongooseConvention'

describe('MongooseConvention', function() {
  describe('.formatFieldName()', function() {
    it('converts id to _id otherwise returns the original name', function() {
      const dataset = {
        id: '_id',
        test: 'test',
        anything: 'anything'
      }
      const instance = new MongooseConvention()
      for (const input in dataset) {
        expect(instance.formatFieldName(input)).toEqual(dataset[input])
      }
    })
  })

  describe('.getNullValueFor()', function() {
    it('returns null', function() {
      const instance = new MongooseConvention()
      expect(instance.getNullValueFor('any')).toBeNull()
    })
  })
})

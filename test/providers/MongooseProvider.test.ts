import 'jest'
import * as Sinon from 'sinon'
import { Facade } from 'najs-facade'
import { MongooseProvider } from '../../lib/providers/MongooseProvider'
const mongoose = require('mongoose')

describe('MongooseProvider', function() {
  it('extends Facade and implements Autoload under name "NajsEloquent.Provider.MongooseProvider"', function() {
    const instance = new MongooseProvider()
    expect(instance).toBeInstanceOf(Facade)
    expect(instance.getClassName()).toEqual('NajsEloquent.Provider.MongooseProvider')
  })

  describe('.getMongooseInstance()', function() {
    it('simply returns mongoose from the mongoose package', function() {
      const instance = new MongooseProvider()
      expect(instance.getMongooseInstance() === mongoose).toBe(true)
    })
  })

  describe('.createModelFromSchema()', function() {
    it('simply calls and returns model() from the mongoose package', function() {
      const stub = Sinon.stub(mongoose, 'model')
      stub.returns('anything')

      const schema: any = {}
      const instance = new MongooseProvider()
      expect(instance.createModelFromSchema('test', schema)).toEqual('anything')
      expect(stub.calledWith('test', schema)).toBe(true)
    })
  })
})

import 'jest'
import * as Sinon from 'sinon'
import * as NajsBinding from 'najs-binding'
import { NajsEloquent as NajsEloquentLib } from 'najs-eloquent'
import { MongooseDriver } from '../../../lib/drivers/mongoose/MongooseDriver'
import { MongooseQueryBuilderFactory } from '../../../lib/drivers/mongoose/MongooseQueryBuilderFactory'
import { MongooseDocumentManager } from '../../../lib/drivers/mongoose/MongooseDocumentManager'

describe('MongooseDriver', function() {
  it('extends DriverBase, implements Autoload under name "NajsEloquent.Driver.MongooseDriver"', function() {
    const driver = new MongooseDriver()
    expect(driver).toBeInstanceOf(NajsEloquentLib.Driver.DriverBase)
    expect(driver.getClassName()).toEqual('NajsEloquent.Driver.MongooseDriver')
  })

  describe('constructor()', function() {
    it('makes RecordManager from "NajsEloquent.Driver.Mongoose.MongooseDocumentManager" class', function() {
      const makeSpy = Sinon.spy(NajsBinding, 'make')
      const driver = new MongooseDriver()
      expect(makeSpy.lastCall.calledWith('NajsEloquent.Driver.Mongoose.MongooseDocumentManager')).toBe(true)
      expect(driver['documentManager']).toBeInstanceOf(MongooseDocumentManager)
      makeSpy.restore()
    })
  })

  describe('.getClassName()', function() {
    it('implements Autoload under name "NajsEloquent.Driver.MongooseDriver"', function() {
      const driver = new MongooseDriver()
      expect(driver.getClassName()).toEqual('NajsEloquent.Driver.MongooseDriver')
    })
  })

  describe('.getRecordManager()', function() {
    it('simply returns property "documentManager"', function() {
      const driver = new MongooseDriver()
      expect(driver.getRecordManager() === driver['documentManager']).toBe(true)
    })
  })

  describe('.makeQuery()', function() {
    it('creates and returns an instance of MongooseQueryBuilderFactory', function() {
      const driver = new MongooseDriver()
      const factory1 = driver.makeQueryBuilderFactory()
      const factory2 = driver.makeQueryBuilderFactory()
      expect(factory1 === factory2).toBe(true)
      expect(factory1).toBeInstanceOf(MongooseQueryBuilderFactory)
    })
  })
})

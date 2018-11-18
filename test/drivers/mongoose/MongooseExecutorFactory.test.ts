import 'jest'
import { make } from 'najs-binding'
import { MongooseQueryLog } from '../../../lib/drivers/mongoose/MongooseQueryLog'
import { MongooseExecutorFactory } from '../../../lib/drivers/mongoose/MongooseExecutorFactory'
import { MongooseRecordExecutor } from '../../../lib/drivers/mongoose/MongooseRecordExecutor'
import { MongooseQueryExecutor } from '../../../lib/drivers/mongoose/MongooseQueryExecutor'
import { MongooseProvider } from '../../../lib/facades/global/MongooseProviderFacade'

describe('MongooseExecutorFactory', function() {
  it('implements IAutoload and register with singleton option = true', function() {
    const a = make<MongooseExecutorFactory>(MongooseExecutorFactory.className)
    const b = make<MongooseExecutorFactory>(MongooseExecutorFactory.className)
    expect(a.getClassName()).toEqual('NajsEloquent.Driver.Mongoose.MongooseExecutorFactory')
    expect(a === b).toBe(true)
  })

  describe('.makeRecordExecutor()', function() {
    it('creates new instance of MongooseRecordExecutor with model, record, collection and logger', function() {
      const model: any = {}
      const document: any = {}

      const factory = make<MongooseExecutorFactory>(MongooseExecutorFactory.className)
      const recordExecutor = factory.makeRecordExecutor(model, document)

      expect(recordExecutor).toBeInstanceOf(MongooseRecordExecutor)
      expect(recordExecutor['model'] === model).toBe(true)
      expect(recordExecutor['document'] === document).toBe(true)
    })
  })

  describe('.makeQueryExecutor()', function() {
    it('creates new instance of MongooseQueryExecutor with model, record, collection and logger', function() {
      const basicQuery: any = {}
      const model: any = {
        getModelName() {
          return 'any'
        }
      }
      const handler: any = {
        getQueryName() {
          return 'test'
        },
        getBasicQuery() {
          return basicQuery
        },
        getModel() {
          return model
        }
      }
      const mongooseModel = {}
      const mongooseInstance = {
        model(name: any) {
          return mongooseModel
        }
      }
      const stub = MongooseProvider.getFacade().createStub('getMongooseInstance')
      stub.returns(mongooseInstance)

      const factory = make<MongooseExecutorFactory>(MongooseExecutorFactory.className)
      const queryExecutor = factory.makeQueryExecutor(handler)

      expect(queryExecutor).toBeInstanceOf(MongooseQueryExecutor)
      expect(queryExecutor['queryHandler'] === handler).toBe(true)
      expect(queryExecutor['mongooseModel'] === mongooseModel).toBe(true)

      stub.restore()
    })
  })

  describe('.getMongooseModel()', function() {
    it('calls and returns MongooseProviderFacade.getMongooseInstance().model()', function() {
      const model: any = {
        getModelName() {
          return 'Model'
        }
      }
      const mongooseModel = { name: '' }
      const mongooseInstance = {
        model(name: any) {
          mongooseModel.name = name
          return mongooseModel
        }
      }
      const stub = MongooseProvider.getFacade().createStub('getMongooseInstance')
      stub.returns(mongooseInstance)

      const result = make<MongooseExecutorFactory>(MongooseExecutorFactory.className).getMongooseModel(model)
      expect(result === mongooseModel).toBe(true)
      expect(result.name).toEqual('Model')

      stub.restore()
    })
  })

  describe('.makeLogger()', function() {
    it('simply create new MongooseQueryLog', function() {
      const factory = make<MongooseExecutorFactory>(MongooseExecutorFactory.className)
      expect(factory.makeLogger()).toBeInstanceOf(MongooseQueryLog)
    })
  })
})

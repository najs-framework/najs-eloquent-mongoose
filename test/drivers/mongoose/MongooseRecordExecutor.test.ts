import 'jest'
import * as Sinon from 'sinon'
import { QueryLog, NajsEloquent as NajsEloquentLib } from 'najs-eloquent'
import { Document, model, Schema } from 'mongoose'
import { init_mongoose, delete_collection } from '../../util'
import { MongooseRecordExecutor } from '../../../lib/drivers/mongoose/MongooseRecordExecutor'
import { MongooseQueryLog } from '../../../lib/drivers/mongoose/MongooseQueryLog'

const mongoose = require('mongoose')

describe('MongooseRecordExecutor', function() {
  const Model = model('MongooseModel', new Schema({}))

  beforeAll(async function() {
    await init_mongoose(mongoose, 'mongoose_record_executor')
  })

  afterAll(async function() {
    delete_collection(mongoose, 'test')
  })

  beforeEach(function() {
    QueryLog.clear().enable()
  })

  function makeExecutor(model: any, document: Document) {
    return new MongooseRecordExecutor(model, document, new MongooseQueryLog())
  }

  function makeDocument(): Document {
    return new Model()
  }

  function expect_query_log(data: object, result: any = undefined, index: number = 0) {
    const logData = QueryLog.pull()[index]['data']
    if (typeof result !== undefined) {
      expect(logData['result'] === result).toBe(true)
    }
    expect(logData).toMatchObject(data)
  }

  it('extends NajsEloquentLib.Driver.ExecutorBase', function() {
    const document = makeDocument()
    const executor = makeExecutor(model, document)
    expect(executor).toBeInstanceOf(NajsEloquentLib.Driver.ExecutorBase)
  })

  describe('.create()', function() {
    it('calls and returns this.document.save()', async function() {
      const model: any = {
        getModelName() {
          return 'Test'
        }
      }
      const document = makeDocument()
      const spy = Sinon.spy(document, 'save')

      const executor = makeExecutor(model, document)
      const result = await executor.create()

      expect_query_log(
        {
          raw: 'Test.save()',
          action: 'Test.create()'
        },
        result
      )
      expect(spy.called).toBe(true)
    })

    it('does not call this.document.save(), just returns an empty object if executeMode is disabled', async function() {
      const model: any = {
        getModelName() {
          return 'Test'
        }
      }
      const document = makeDocument()
      const spy = Sinon.spy(document, 'save')

      const executor = makeExecutor(model, document)
      const result = await executor.setExecuteMode('disabled').create()

      expect_query_log(
        {
          raw: 'Test.save()',
          action: 'Test.create()'
        },
        result
      )
      expect(result).toEqual({})
      expect(spy.called).toBe(false)
    })
  })

  describe('.update()', function() {
    it('calls and returns this.document.save()', async function() {
      const model: any = {
        getModelName() {
          return 'Test'
        }
      }
      const document = makeDocument()
      const spy = Sinon.spy(document, 'save')

      const executor = makeExecutor(model, document)
      const result = await executor.update()

      expect_query_log(
        {
          raw: 'Test.save()',
          action: 'Test.update()'
        },
        result
      )
      expect(spy.called).toBe(true)
    })

    it('does not call this.document.save(), just returns an empty object if executeMode is disabled', async function() {
      const model: any = {
        getModelName() {
          return 'Test'
        }
      }
      const document = makeDocument()
      const spy = Sinon.spy(document, 'save')

      const executor = makeExecutor(model, document)
      const result = await executor.setExecuteMode('disabled').update()

      expect_query_log(
        {
          raw: 'Test.save()',
          action: 'Test.update()'
        },
        result
      )
      expect(result).toEqual({})
      expect(spy.called).toBe(false)
    })
  })

  describe('.softDelete()', function() {
    it('calls and returns this.document.delete()', async function() {
      const model: any = {
        getModelName() {
          return 'Test'
        }
      }
      const document: any = {
        async delete() {}
      }
      const spy = Sinon.spy(document, 'delete')

      const executor = makeExecutor(model, document)
      const result = await executor.softDelete()

      expect_query_log(
        {
          raw: 'Test.delete()',
          action: 'Test.softDelete()'
        },
        result
      )
      expect(spy.called).toBe(true)
    })

    it('does not call this.document.delete(), just returns an empty object if executeMode is disabled', async function() {
      const model: any = {
        getModelName() {
          return 'Test'
        }
      }
      const document: any = {
        async delete() {}
      }
      const spy = Sinon.spy(document, 'delete')

      const executor = makeExecutor(model, document)
      const result = await executor.setExecuteMode('disabled').softDelete()

      expect_query_log(
        {
          raw: 'Test.delete()',
          action: 'Test.softDelete()'
        },
        result
      )
      expect(result).toEqual({})
      expect(spy.called).toBe(false)
    })
  })

  describe('.hardDelete()', function() {
    it('calls and returns this.document.remove()', async function() {
      const model: any = {
        getModelName() {
          return 'Test'
        }
      }
      const document = makeDocument()
      const spy = Sinon.spy(document, 'remove')

      const executor = makeExecutor(model, document)
      const result = await executor.hardDelete()

      expect_query_log(
        {
          raw: 'Test.remove()',
          action: 'Test.hardDelete()'
        },
        result
      )
      expect(spy.called).toBe(true)
    })

    it('does not call this.document.remove(), just returns an empty object if executeMode is disabled', async function() {
      const model: any = {
        getModelName() {
          return 'Test'
        }
      }
      const document = makeDocument()
      const spy = Sinon.spy(document, 'remove')

      const executor = makeExecutor(model, document)
      const result = await executor.setExecuteMode('disabled').hardDelete()

      expect_query_log(
        {
          raw: 'Test.remove()',
          action: 'Test.hardDelete()'
        },
        result
      )
      expect(result).toEqual({})
      expect(spy.called).toBe(false)
    })
  })

  describe('.restore()', function() {
    it('calls and returns this.document.restore()', async function() {
      const model: any = {
        getModelName() {
          return 'Test'
        }
      }
      const document: any = {
        async restore() {}
      }
      const spy = Sinon.spy(document, 'restore')

      const executor = makeExecutor(model, document)
      const result = await executor.restore()

      expect_query_log(
        {
          raw: 'Test.restore()',
          action: 'Test.restore()'
        },
        result
      )
      expect(spy.called).toBe(true)
    })

    it('does not call this.document.restore(), just returns an empty object if executeMode is disabled', async function() {
      const model: any = {
        getModelName() {
          return 'Test'
        }
      }
      const document: any = {
        async restore() {}
      }
      const spy = Sinon.spy(document, 'restore')

      const executor = makeExecutor(model, document)
      const result = await executor.setExecuteMode('disabled').restore()

      expect_query_log(
        {
          raw: 'Test.restore()',
          action: 'Test.restore()'
        },
        result
      )
      expect(result).toEqual({})
      expect(spy.called).toBe(false)
    })
  })
})

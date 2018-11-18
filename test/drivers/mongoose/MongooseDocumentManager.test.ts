import 'jest'
import * as Sinon from 'sinon'
import { register } from 'najs-binding'
import { Facade, FacadeContainer } from 'najs-facade'
import { Schema } from 'mongoose'
import { MongooseProvider } from '../../../lib/facades/global/MongooseProviderFacade'
import { MongooseDocumentManager } from '../../../lib/drivers/mongoose/MongooseDocumentManager'
import { NajsEloquent as NajsEloquentLib } from 'najs-eloquent'
import { SoftDelete } from '../../../lib/drivers/mongoose/plugins/SoftDelete'

describe('MongooseDocumentManager', function() {
  const documentManager = new MongooseDocumentManager({} as any)

  it('extends RecordManagerBase, implements Autoload under name "NajsEloquent.Driver.Mongoose.MongooseDocumentManager"', function() {
    expect(documentManager).toBeInstanceOf(NajsEloquentLib.Driver.RecordManagerBase)
    expect(documentManager.getClassName()).toEqual('NajsEloquent.Driver.Mongoose.MongooseDocumentManager')
  })

  describe('.initialize()', function() {
    it('calls .initializeMongooseModelIfNeeded(), then init the property attributes of model', function() {
      const stub = Sinon.stub(documentManager, 'initializeMongooseModelIfNeeded')
      stub.callsFake(function() {})

      MongooseProvider.createModelFromSchema('TestA', new Schema({}))
      const model: any = {
        getModelName() {
          return 'TestA'
        }
      }
      documentManager.initialize(model, true)
      expect(model.attributes).toBeInstanceOf(MongooseProvider.getMongooseInstance().model('TestA'))
      stub.restore()
    })

    it('simply assigns the data to model.attributes if data is an instance of MongooseModel', function() {
      const stub = Sinon.stub(documentManager, 'initializeMongooseModelIfNeeded')
      stub.callsFake(function() {})

      MongooseProvider.createModelFromSchema('TestB', new Schema({}))
      const MongooseModel = MongooseProvider.getMongooseInstance().model('TestB')
      const data = new MongooseModel()
      const model: any = {
        getModelName() {
          return 'TestB'
        }
      }
      documentManager.initialize(model, true, data)
      expect(model.attributes === data).toBe(true)
      stub.restore()
    })

    it('creates an new instance of MongooseModel, then call model.fill() if isGuarded = true', function() {
      const stub = Sinon.stub(documentManager, 'initializeMongooseModelIfNeeded')
      stub.callsFake(function() {})

      MongooseProvider.createModelFromSchema('TestC', new Schema({}))
      const data = {}
      const model: any = {
        getModelName() {
          return 'TestC'
        },

        fill() {}
      }
      const fillSpy = Sinon.spy(model, 'fill')

      documentManager.initialize(model, true, data)
      expect(fillSpy.calledWith(data)).toBe(true)
      stub.restore()
    })

    it('creates an new instance of MongooseModel, then call model.attributes.set() if isGuarded = false', function() {
      const stub = Sinon.stub(documentManager, 'initializeMongooseModelIfNeeded')
      stub.callsFake(function() {})

      MongooseProvider.createModelFromSchema('TestD', new Schema({}))
      const data = {}
      const model: any = {
        getModelName() {
          return 'TestD'
        },

        fill() {}
      }
      const fillSpy = Sinon.spy(model, 'fill')

      documentManager.initialize(model, false, data)
      expect(fillSpy.calledWith(data)).toBe(false)
      stub.restore()
    })
  })

  describe('.initializeMongooseModelIfNeeded()', function() {
    it('does nothing if the model is already register to mongoose', function() {
      MongooseProvider.createModelFromSchema('RegisteredModel', new Schema({}))
      const getMongooseSchemaSpy = Sinon.spy(documentManager, 'getMongooseSchema')

      const model: any = {
        getModelName() {
          return 'RegisteredModel'
        }
      }

      documentManager.initializeMongooseModelIfNeeded(model)
      expect(getMongooseSchemaSpy.called).toBe(false)
      getMongooseSchemaSpy.restore()
    })

    it('calls .getMongooseSchema(), then calls MongooseProvider.createModelFromSchema() to register model', function() {
      const schema = {}
      Facade(MongooseProvider)
        .shouldReceive('createModelFromSchema')
        .withArgs('Test', schema)

      const getMongooseSchemaStub = Sinon.stub(documentManager, 'getMongooseSchema')
      getMongooseSchemaStub.returns(schema)

      const model: any = {
        getModelName() {
          return 'Test'
        },

        getDriver() {
          return {
            getTimestampsFeature() {
              return {
                hasTimestamps() {
                  return false
                }
              }
            },
            getSoftDeletesFeature() {
              return {
                hasSoftDeletes() {
                  return false
                }
              }
            }
          }
        }
      }

      documentManager.initializeMongooseModelIfNeeded(model)
      expect(getMongooseSchemaStub.called).toBe(true)
      getMongooseSchemaStub.restore()
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('calls schema.set("timestamps", model.getTimestampsSetting()) if the TimestampFeature.hasTimestamps() returns true', function() {
      const schema = {
        set() {}
      }
      const timestampsSetting = {}
      Facade(MongooseProvider)
        .shouldReceive('createModelFromSchema')
        .withArgs('Test', schema)

      const getMongooseSchemaStub = Sinon.stub(documentManager, 'getMongooseSchema')
      getMongooseSchemaStub.returns(schema)

      const model: any = {
        getModelName() {
          return 'Test'
        },

        getDriver() {
          return {
            getTimestampsFeature() {
              return {
                hasTimestamps() {
                  return true
                },
                getTimestampsSetting() {
                  return timestampsSetting
                }
              }
            },
            getSoftDeletesFeature() {
              return {
                hasSoftDeletes() {
                  return false
                }
              }
            }
          }
        }
      }

      const spy = Sinon.spy(schema, 'set')

      documentManager.initializeMongooseModelIfNeeded(model)
      expect(getMongooseSchemaStub.called).toBe(true)
      expect(spy.calledWith('timestamps', timestampsSetting)).toBe(true)

      getMongooseSchemaStub.restore()
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('calls schema.plugin(SoftDelete, model.getSoftDeletesSetting()) if the TimestampFeature.hasTimestamps() returns true', function() {
      const schema = {
        plugin() {}
      }
      const softDeletesSetting = {}
      Facade(MongooseProvider)
        .shouldReceive('createModelFromSchema')
        .withArgs('Test', schema)

      const getMongooseSchemaStub = Sinon.stub(documentManager, 'getMongooseSchema')
      getMongooseSchemaStub.returns(schema)

      const model: any = {
        getModelName() {
          return 'Test'
        },

        getDriver() {
          return {
            getTimestampsFeature() {
              return {
                hasTimestamps() {
                  return false
                }
              }
            },
            getSoftDeletesFeature() {
              return {
                hasSoftDeletes() {
                  return true
                },
                getSoftDeletesSetting() {
                  return softDeletesSetting
                }
              }
            }
          }
        }
      }

      const spy = Sinon.spy(schema, 'plugin')

      documentManager.initializeMongooseModelIfNeeded(model)
      expect(getMongooseSchemaStub.called).toBe(true)
      expect(spy.calledWith(SoftDelete, softDeletesSetting)).toBe(true)

      getMongooseSchemaStub.restore()
      FacadeContainer.verifyAndRestoreAllFacades()
    })
  })

  describe('.getMongooseSchema()', function() {
    it('calls and returns model.getSchema() if that is a function', function() {
      const schema = new Schema({})
      const model: any = {
        getSchema() {
          return schema
        }
      }
      const getSchemaSpy = Sinon.spy(model, 'getSchema')

      expect(documentManager.getMongooseSchema(<any>model)).toEqual(schema)
      expect(getSchemaSpy.called).toBe(true)
    })

    it('creates an schema instance from .getSchemaDefinition() and .getSchemaOptions() if needed', function() {
      const model: any = {}
      const getSchemaDefinitionStub = Sinon.stub(documentManager, 'getSchemaDefinition')
      getSchemaDefinitionStub.returns({})

      const getSchemaOptionsStub = Sinon.stub(documentManager, 'getSchemaOptions')
      getSchemaOptionsStub.returns({})

      expect(documentManager.getMongooseSchema(<any>model)).toBeInstanceOf(Schema)
      expect(getSchemaDefinitionStub.calledWith(model)).toBe(true)
      expect(getSchemaOptionsStub.calledWith(model)).toBe(true)
      getSchemaDefinitionStub.restore()
      getSchemaOptionsStub.restore()
    })
  })

  describe('.getSchemaDefinition()', function() {
    it('calls SettingFeature.getSettingProperty() with property = "schema" and default value = {}', function() {
      class ModelWithoutCustomSchema {
        internalData = {}
        getClassName() {
          return 'ModelWithoutCustomSchema'
        }

        getDriver() {
          return {
            getSettingFeature() {
              return new NajsEloquentLib.Feature.SettingFeature()
            }
          }
        }
      }
      register(ModelWithoutCustomSchema)

      class ModelWithCustomSchema {
        internalData = {}
        schema = { test: { type: 'any' } }

        getClassName() {
          return 'ModelWithCustomSchema'
        }

        getDriver() {
          return {
            getSettingFeature() {
              return new NajsEloquentLib.Feature.SettingFeature()
            }
          }
        }
      }
      register(ModelWithCustomSchema)

      expect(documentManager.getSchemaDefinition(<any>new ModelWithoutCustomSchema())).toEqual({})
      expect(documentManager.getSchemaDefinition(<any>new ModelWithCustomSchema())).toEqual({ test: { type: 'any' } })
    })
  })

  describe('.getSchemaOptions()', function() {
    it('calls SettingFeature.getSettingProperty() with property = "options" and default value = {}, then merged with default options', function() {
      class ModelWithoutCustomOption {
        internalData = {}
        getClassName() {
          return 'ModelWithoutCustomOption'
        }

        getModelName() {
          return 'Test'
        }

        getDriver() {
          return {
            getSettingFeature() {
              return new NajsEloquentLib.Feature.SettingFeature()
            }
          }
        }
      }
      register(ModelWithoutCustomOption)

      class ModelWithCustomOption {
        internalData = {}
        options = { test: { type: 'any' } }

        getClassName() {
          return 'ModelWithCustomOption'
        }

        getModelName() {
          return 'test'
        }

        getDriver() {
          return {
            getSettingFeature() {
              return new NajsEloquentLib.Feature.SettingFeature()
            }
          }
        }
      }
      register(ModelWithCustomOption)

      expect(documentManager.getSchemaOptions(<any>new ModelWithoutCustomOption())).toEqual({
        collection: 'tests'
      })
      expect(documentManager.getSchemaOptions(<any>new ModelWithCustomOption())).toEqual({
        collection: 'tests',
        test: { type: 'any' }
      })
    })
  })

  describe('.getAttribute()', function() {
    it('calls and returns model.attributes.get()', function() {
      const model: any = {
        attributes: {
          get() {
            return 'result'
          }
        }
      }
      const stub = Sinon.stub(model.attributes, 'get')
      stub.returns('anything')

      expect(documentManager.getAttribute(model, 'test')).toEqual('anything')
      expect(stub.calledWith('test')).toBe(true)
    })
  })

  describe('.setAttribute()', function() {
    it('calls model.attributes.set() and always return true', function() {
      const model: any = {
        attributes: {
          set() {
            return 'result'
          }
        }
      }
      const stub = Sinon.stub(model.attributes, 'set')
      stub.returns('anything')

      expect(documentManager.setAttribute(model, 'test', 'value')).toBe(true)
      expect(stub.calledWith('test', 'value')).toBe(true)
    })
  })

  describe('.hasAttribute()', function() {
    it('returns true if the given key in .getSchemaDefinition()', function() {
      const stub = Sinon.stub(documentManager, 'getSchemaDefinition')
      stub.returns({ a: {}, b: 'any' })
      const model: any = {}

      expect(documentManager.hasAttribute(model, 'a')).toBe(true)
      expect(documentManager.hasAttribute(model, 'b')).toBe(true)
      expect(documentManager.hasAttribute(model, 'c')).toBe(false)
      expect(documentManager.hasAttribute(model, 'd')).toBe(false)

      stub.restore()
    })
  })

  describe('.getPrimaryKeyName()', function() {
    it('uses SettingFeature.getSettingProperty() with property "primaryKey" and default value = "id"', function() {
      class ModelWithoutCustomPrimaryKey {
        internalData = {}
        getClassName() {
          return 'ModelWithoutCustomPrimaryKey'
        }

        getDriver() {
          return {
            getSettingFeature() {
              return new NajsEloquentLib.Feature.SettingFeature()
            }
          }
        }
      }
      register(ModelWithoutCustomPrimaryKey)

      class ModelWithCustomPrimaryKey {
        internalData = {}
        primaryKey = 'test'

        getClassName() {
          return 'ModelWithCustomPrimaryKey'
        }

        getDriver() {
          return {
            getSettingFeature() {
              return new NajsEloquentLib.Feature.SettingFeature()
            }
          }
        }
      }
      register(ModelWithCustomPrimaryKey)

      expect(documentManager.getPrimaryKeyName(<any>new ModelWithoutCustomPrimaryKey())).toEqual('_id')
      expect(documentManager.getPrimaryKeyName(<any>new ModelWithCustomPrimaryKey())).toEqual('test')
    })
  })

  describe('.toObject()', function() {
    it('calls and returns model.attributes.toObject() with option virtuals = true', function() {
      const model: any = {
        attributes: {
          toObject() {
            return 'result'
          }
        }
      }
      const stub = Sinon.stub(model.attributes, 'toObject')
      stub.returns('anything')

      expect(documentManager.toObject(model)).toEqual('anything')
      expect(stub.calledWith({ virtuals: true })).toBe(true)
    })
  })

  describe('.markModified()', function() {
    it('flattens the keys and calls model.attributes.markModified()', function() {
      const model: any = {
        attributes: {
          markModified() {
            return 'result'
          }
        }
      }
      const spy = Sinon.stub(model.attributes, 'markModified')

      documentManager.markModified(model, [['a', ['b', 'c']]])
      expect(spy.callCount).toEqual(3)
      expect(spy.firstCall.calledWith('a')).toBe(true)
      expect(spy.secondCall.calledWith('b')).toBe(true)
      expect(spy.thirdCall.calledWith('c')).toBe(true)
    })
  })

  describe('.isModified()', function() {
    it('flattens the keys and returns true if all keys in model.attributes.isModified() return true', function() {
      const model: any = {
        attributes: {
          isModified() {
            return true
          }
        }
      }
      const stub = Sinon.stub(model.attributes, 'isModified')
      stub.callsFake(function(name: string) {
        return name === 'a' || name === 'b'
      })

      expect(documentManager.isModified(model, [['a', ['b']]])).toBe(true)
      expect(documentManager.isModified(model, [['a', ['b', 'c']]])).toBe(false)
    })
  })

  describe('.getModified()', function() {
    it('calls and returns model.attributes.modifiedPaths()', function() {
      const model: any = {
        attributes: {
          modifiedPaths() {
            return 'result'
          }
        }
      }
      const stub = Sinon.stub(model.attributes, 'modifiedPaths')
      stub.returns('anything')

      expect(documentManager.getModified(model)).toEqual('anything')
      expect(stub.calledWith()).toBe(true)
    })
  })

  describe('.isNew()', function() {
    it('calls and returns property model.attributes.isNew', function() {
      const model: any = {
        attributes: {
          isNew: 'result'
        }
      }

      expect(documentManager.isNew(model)).toEqual('result')
    })
  })
})

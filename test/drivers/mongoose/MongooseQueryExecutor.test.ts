import 'jest'
import * as Sinon from 'sinon'
import { init_mongoose, delete_collection } from '../../util'
import { QueryLog, NajsEloquent as NajsEloquentLib } from 'najs-eloquent'
import { MongooseQueryExecutor } from '../../../lib/drivers/mongoose/MongooseQueryExecutor'
import { MongooseQueryBuilder } from '../../../lib/drivers/mongoose/MongooseQueryBuilder'
import { MongooseQueryBuilderHandler } from '../../../lib/drivers/mongoose/MongooseQueryBuilderHandler'
import { SoftDelete } from '../../../lib/drivers/mongoose/plugins/SoftDelete'
import { MongooseQueryLog } from '../../../lib/drivers/mongoose/MongooseQueryLog'
import { Schema } from 'mongoose'

const mongoose = require('mongoose')

const UserSchema: Schema = new Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    age: { type: Number }
  },
  {
    collection: 'users'
  }
)
const UserModel = mongoose.model('User', UserSchema)

const RoleSchema: Schema = new Schema(
  {
    name: { type: String }
  },
  {
    collection: 'roles'
  }
)
RoleSchema.plugin(SoftDelete, { deletedAt: 'deleted_at', overrideMethods: true })
const RoleModel = mongoose.model('Role', RoleSchema)

describe('MongooseQueryExecutor', function() {
  jest.setTimeout(10000)

  const dataset = [
    { first_name: 'john', last_name: 'doe', age: 30 },
    { first_name: 'jane', last_name: 'doe', age: 25 },
    { first_name: 'tony', last_name: 'stark', age: 40 },
    { first_name: 'thor', last_name: 'god', age: 1000 },
    { first_name: 'captain', last_name: 'american', age: 100 },
    { first_name: 'tony', last_name: 'stewart', age: 40 },
    { first_name: 'peter', last_name: 'parker', age: 15 }
  ]

  beforeAll(async function() {
    await init_mongoose(mongoose, 'mongoose_query_builder')
    for (const data of dataset) {
      const user = new UserModel()
      user.set(data)
      await user.save()
    }
    for (let i = 0; i < 10; i++) {
      const role = new RoleModel()
      role.set({ name: 'role-' + i })
      await role['delete']()
    }
  })

  afterAll(async function() {
    delete_collection(mongoose, 'users')
    delete_collection(mongoose, 'roles')
  })

  beforeEach(function() {
    QueryLog.clear().enable()
  })

  function expect_match_user(result: any, expected: any) {
    for (const name in expected) {
      expect(result[name]).toEqual(expected[name])
    }
  }

  function expect_query_log(data: object, result: any = undefined, index: number = 0) {
    const logData = QueryLog.pull()[index]['data']
    if (typeof result !== 'undefined') {
      expect(logData['result'] === result).toBe(true)
    }
    expect(logData).toMatchObject(data)
  }

  function makeQueryBuilder(name: string, model?: any) {
    if (!model) {
      model = {
        getModelName() {
          return name
        }
      }
    }
    return new MongooseQueryBuilder(new MongooseQueryBuilderHandler(model))
  }

  function makeQueryExecutor(queryBuilder: MongooseQueryBuilder<any, any>, model: any) {
    return new MongooseQueryExecutor(queryBuilder['handler'], model, new MongooseQueryLog())
  }

  it('extends NajsEloquentLib.Driver.ExecutorBase', function() {
    const executor = makeQueryExecutor(makeQueryBuilder('User'), UserModel)
    expect(executor).toBeInstanceOf(NajsEloquentLib.Driver.ExecutorBase)
  })

  describe('.get()', function() {
    it('gets all data of collection and return an instance of Collection<Eloquent<T>>', async function() {
      const query = makeQueryExecutor(makeQueryBuilder('User'), UserModel)
      const result = await query.get()
      expect(result.length).toEqual(7)
      for (let i = 0; i < 7; i++) {
        expect_match_user(result[i], dataset[i])
      }
      expect_query_log(
        {
          raw: 'User.find({}).exec()',
          action: 'get'
        },
        result
      )
    })

    it('returns an empty collection if no result', async function() {
      const query = makeQueryBuilder('User')
      query.where('first_name', 'no-one')

      const result = await makeQueryExecutor(query, UserModel).get()
      expect(result.length === 0).toBe(true)
      expect_query_log(
        {
          raw: 'User.find({"first_name":"no-one"}).exec()',
          action: 'get'
        },
        result
      )
    })

    it('can get data by query builder, case 1', async function() {
      const query = makeQueryBuilder('User')
      query.where('age', 1000)

      const result = await makeQueryExecutor(query, UserModel).get()

      expect(result.length).toEqual(1)
      expect_match_user(result[0], dataset[3])
      expect_query_log(
        {
          raw: 'User.find({"age":1000}).exec()',
          action: 'get'
        },
        result
      )
    })

    it('can get data by query builder, case 2', async function() {
      const query = makeQueryBuilder('User')
      query.where('age', 40)

      const result = await makeQueryExecutor(query, UserModel).get()
      expect(result.length).toEqual(2)
      expect_match_user(result[0], dataset[2])
      expect_match_user(result[1], dataset[5])
      expect_query_log(
        {
          raw: 'User.find({"age":40}).exec()',
          action: 'get'
        },
        result
      )
    })

    it('can get data by query builder, case 3', async function() {
      const query = makeQueryBuilder('User')
      query.where('age', 40).where('last_name', 'stark')

      const result = await makeQueryExecutor(query, UserModel).get()
      expect(result.length).toEqual(1)
      expect_match_user(result[0], dataset[2])
      expect_query_log(
        {
          raw: 'User.find({"age":40,"last_name":"stark"}).exec()',
          action: 'get'
        },
        result
      )
    })

    it('can get data by query builder, case 4', async function() {
      const query = makeQueryBuilder('User')
      query.where('age', 40).orWhere('first_name', 'peter')

      const result = await makeQueryExecutor(query, UserModel).get()
      expect(result.length).toEqual(3)
      expect_match_user(result[0], dataset[2])
      expect_match_user(result[1], dataset[5])
      expect_match_user(result[2], dataset[6])
      expect_query_log(
        {
          raw: 'User.find({"$or":[{"age":40},{"first_name":"peter"}]}).exec()',
          action: 'get'
        },
        result
      )
    })

    it('returns an empty array is executeMode is disabled', async function() {
      const query = makeQueryBuilder('User')
      query.where('age', 40)

      const result = await makeQueryExecutor(query, UserModel)
        .setExecuteMode('disabled')
        .get()
      expect(result.length).toEqual(0)
      expect_query_log(
        {
          raw: 'User.find({"age":40}).exec()',
          action: 'get'
        },
        result
      )
      expect(result).toEqual([])
    })
  })

  describe('.first()', function() {
    it('finds first document of collection and return an instance of Eloquent<T>', async function() {
      const query = makeQueryBuilder('User')

      const result = await makeQueryExecutor(query, UserModel).first()
      expect_match_user(result, dataset[0])
      expect_query_log(
        {
          raw: 'User.findOne({}).exec()',
          action: 'first'
        },
        result
      )
    })

    it('finds first document of collection and return an instance of Eloquent<T>', async function() {
      const query = makeQueryBuilder('User')
      query.orderBy('_id', 'desc')

      const result = await makeQueryExecutor(query, UserModel).first()
      expect_match_user(result, dataset[6])
      expect_query_log(
        {
          raw: 'User.findOne({}).sort({"_id":-1}).exec()',
          action: 'first'
        },
        result
      )
    })

    it('returns null if no result', async function() {
      const query = makeQueryBuilder('User')
      query.where('first_name', 'no-one')

      const result = await makeQueryExecutor(query, UserModel).first()

      expect(result).toBeNull()
      expect_query_log(
        {
          raw: 'User.findOne({"first_name":"no-one"}).exec()',
          action: 'first'
        },
        result
      )
    })

    it('can find data by query builder, case 1', async function() {
      const query = makeQueryBuilder('User')
      query.where('age', 1000)

      const result = await makeQueryExecutor(query, UserModel).first()
      expect_match_user(result, dataset[3])
      expect_query_log(
        {
          raw: 'User.findOne({"age":1000}).exec()',
          action: 'first'
        },
        result
      )
    })

    it('can find data by query builder, case 2', async function() {
      const query = makeQueryBuilder('User')
      query.where('age', 40).orWhere('first_name', 'jane')

      const result = await makeQueryExecutor(query, UserModel).first()
      expect_match_user(result, dataset[1])
      expect_query_log(
        {
          raw: 'User.findOne({"$or":[{"age":40},{"first_name":"jane"}]}).exec()',
          action: 'first'
        },
        result
      )
    })

    it('can find data by query builder, case 3', async function() {
      const query = makeQueryBuilder('User')
      query.where('first_name', 'tony').where('last_name', 'stewart')

      const result = await makeQueryExecutor(query, UserModel).first()

      expect_match_user(result, dataset[5])
      expect_query_log(
        {
          raw: 'User.findOne({"first_name":"tony","last_name":"stewart"}).exec()',
          action: 'first'
        },
        result
      )
    })

    it('can find data by .native() before using query functions of query builder', async function() {
      const query = makeQueryBuilder('User')
      const result = await makeQueryExecutor(query, UserModel)
        .native(function(subQuery) {
          return subQuery.findOne({
            first_name: 'tony'
          })
        })
        .first()
      expect_match_user(result, dataset[2])
      expect_query_log(
        {
          raw: 'User.find({}).exec()',
          action: 'first'
        },
        result
      )
    })

    it('can find data by .native() after using query functions of query builder', async function() {
      const query = makeQueryBuilder('User')
      query.where('age', 40).orWhere('age', 1000)

      const result = await makeQueryExecutor(query, UserModel)
        .native(function(nativeQuery) {
          return nativeQuery.sort({ last_name: -1 })
        })
        .first()
      expect_match_user(result, dataset[5])
      expect_query_log(
        {
          raw: 'User.find({"$or":[{"age":40},{"age":1000}]}).fineOne().exec()',
          action: 'first'
        },
        result
      )
    })

    it('can find data by .native() and modified after using query functions of query builder', async function() {
      const query = makeQueryBuilder('User')
      query.where('age', 40).orWhere('age', 1000)

      const result = await makeQueryExecutor(query, UserModel)
        .native(function(collection) {
          return collection.findOne({
            first_name: 'thor'
          })
        })
        .execute()
      expect_match_user(result, dataset[3])
      expect_query_log(
        {
          raw: 'User.find({"$or":[{"age":40},{"age":1000}]}).exec()',
          action: 'execute'
        },
        result
      )
    })

    it('returns undefined is executeMode is disabled', async function() {
      const query = makeQueryBuilder('User')
      query.where('age', 40).orWhere('first_name', 'jane')

      const result = await makeQueryExecutor(query, UserModel)
        .setExecuteMode('disabled')
        .first()
      expect_query_log(
        {
          raw: 'User.findOne({"$or":[{"age":40},{"first_name":"jane"}]}).exec()',
          action: 'first'
        },
        result
      )
      expect(result).toBeUndefined()
    })
  })

  describe('.count()', function() {
    it('counts all data of collection and returns a Number', async function() {
      const query = makeQueryBuilder('User')

      const result = await makeQueryExecutor(query, UserModel).count()
      expect(result).toEqual(7)
      expect_query_log(
        {
          raw: 'User.find({}).count().exec()',
          action: 'count'
        },
        result
      )
    })

    it('returns 0 if no result', async function() {
      const query = makeQueryBuilder('User')
      query.where('first_name', 'no-one')

      const result = await makeQueryExecutor(query, UserModel).count()
      expect(result).toEqual(0)
      expect_query_log(
        {
          raw: 'User.find({"first_name":"no-one"}).count().exec()',
          action: 'count'
        },
        result
      )
    })

    it('overrides select even .select was used', async function() {
      const query = makeQueryBuilder('User')
      query.select('abc', 'def')

      const result = await makeQueryExecutor(query, UserModel).count()
      expect(result).toEqual(7)
      expect_query_log(
        {
          raw: 'User.find({}).count().exec()',
          action: 'count'
        },
        result
      )
    })

    it('can count items by query builder, case 1', async function() {
      const query = makeQueryBuilder('User')
      query.where('age', 18).orWhere('first_name', 'tony')

      const result = await makeQueryExecutor(query, UserModel).count()
      expect(result).toEqual(2)
      expect_query_log(
        {
          raw: 'User.find({"$or":[{"age":18},{"first_name":"tony"}]}).count().exec()',
          action: 'count'
        },
        result
      )
    })

    it('can count items by query builder, case 2', async function() {
      const query = makeQueryBuilder('User')
      query
        .where('age', 1000)
        .orWhere('first_name', 'captain')
        .orderBy('last_name')

      const result = await makeQueryExecutor(query, UserModel).count()
      expect(result).toEqual(2)
      expect_query_log(
        {
          raw: 'User.find({"$or":[{"age":1000},{"first_name":"captain"}]}).count().exec()',
          action: 'count'
        },
        result
      )
    })

    it('returns 0 is executeMode is disabled', async function() {
      const query = makeQueryBuilder('User')
      query
        .where('age', 1000)
        .orWhere('first_name', 'captain')
        .orderBy('last_name')

      const result = await makeQueryExecutor(query, UserModel)
        .setExecuteMode('disabled')
        .count()
      expect(result).toEqual(0)
      expect_query_log(
        {
          raw: 'User.find({"$or":[{"age":1000},{"first_name":"captain"}]}).count().exec()',
          action: 'count'
        },
        result
      )
    })
  })

  describe('.update()', function() {
    it('can update data of collection, returns update result of mongoose', async function() {
      const query = makeQueryBuilder('User')
      query.where('first_name', 'peter')

      const result = await makeQueryExecutor(query, UserModel).update({ $set: { age: 19 } })

      expect(result).toEqual({ n: 1, nModified: 1, ok: 1 })
      expect_query_log(
        {
          raw: 'User.update({"first_name":"peter"}, {"$set":{"age":19}}, {"multi":true}).exec()',
          action: 'update'
        },
        result,
        0
      )

      const updatedResult = await makeQueryExecutor(
        makeQueryBuilder('User').where('first_name', 'peter'),
        UserModel
      ).first()
      expect_match_user(updatedResult, Object.assign({}, dataset[6], { age: 19 }))
    })

    it('returns empty update result if no row matched', async function() {
      const query = makeQueryBuilder('User')
      query.where('first_name', 'no-one')

      const result = await makeQueryExecutor(query, UserModel).update({ $set: { age: 19 } })
      expect(result).toEqual({ n: 0, nModified: 0, ok: 1 })
      expect_query_log(
        {
          raw: 'User.update({"first_name":"no-one"}, {"$set":{"age":19}}, {"multi":true}).exec()',
          action: 'update'
        },
        result
      )
    })

    it('can update data by query builder, case 1', async function() {
      const query = makeQueryBuilder('User')
      query.where('age', 1000)

      const result = await makeQueryExecutor(query, UserModel).update({ $set: { age: 1001 } })
      expect(result).toEqual({ n: 1, nModified: 1, ok: 1 })
      expect_query_log(
        {
          raw: 'User.update({"age":1000}, {"$set":{"age":1001}}, {"multi":true}).exec()',
          action: 'update'
        },
        result
      )

      const updatedResult = await makeQueryExecutor(
        makeQueryBuilder('User').where('first_name', 'thor'),
        UserModel
      ).first()
      expect_match_user(updatedResult, Object.assign({}, dataset[3], { age: 1001 }))
    })

    it('can update data by query builder, case 2: multiple documents', async function() {
      const query = makeQueryBuilder('User')
      query.where('first_name', 'tony').orWhere('first_name', 'jane')

      const result = await makeQueryExecutor(query, UserModel).update({ $inc: { age: 1 } })
      expect(result).toEqual({ n: 3, nModified: 3, ok: 1 })
      expect_query_log(
        {
          raw:
            'User.update({"$or":[{"first_name":"tony"},{"first_name":"jane"}]}, {"$inc":{"age":1}}, {"multi":true}).exec()',
          action: 'update'
        },
        result
      )

      const updatedResults = await makeQueryExecutor(
        makeQueryBuilder('User')
          .where('first_name', 'tony')
          .orWhere('first_name', 'jane'),
        UserModel
      ).get()
      expect_match_user(updatedResults[0], Object.assign({}, dataset[1], { age: 26 }))
      expect_match_user(updatedResults[1], Object.assign({}, dataset[2], { age: 41 }))
      expect_match_user(updatedResults[2], Object.assign({}, dataset[5], { age: 41 }))
    })

    it('can update data by query builder, case 3', async function() {
      const query = makeQueryBuilder('User')
      query.where('first_name', 'tony').where('last_name', 'stewart')

      const result = await makeQueryExecutor(query, UserModel).update({ $inc: { age: 1 } })
      expect(result).toEqual({ n: 1, nModified: 1, ok: 1 })
      expect_query_log(
        {
          raw: 'User.update({"first_name":"tony","last_name":"stewart"}, {"$inc":{"age":1}}, {"multi":true}).exec()',
          action: 'update'
        },
        result
      )

      const updatedResult = await makeQueryExecutor(
        makeQueryBuilder('User')
          .where('first_name', 'tony')
          .where('last_name', 'stewart'),
        UserModel
      ).first()
      expect_match_user(updatedResult, Object.assign({}, dataset[5], { age: 42 }))
    })

    it('returns an empty object is executeMode is disabled', async function() {
      const query = makeQueryBuilder('User')
      query.where('first_name', 'tony').where('last_name', 'stewart')

      const result = await makeQueryExecutor(query, UserModel)
        .setExecuteMode('disabled')
        .update({ $inc: { age: 1 } })
      expect(result).toEqual({})
      expect_query_log(
        {
          raw: 'User.update({"first_name":"tony","last_name":"stewart"}, {"$inc":{"age":1}}, {"multi":true}).exec()',
          action: 'update'
        },
        result
      )

      const updatedResult = await makeQueryExecutor(
        makeQueryBuilder('User')
          .where('first_name', 'tony')
          .where('last_name', 'stewart'),
        UserModel
      ).first()
      expect_match_user(updatedResult, Object.assign({}, dataset[5], { age: 42 }))
    })
  })

  describe('.delete()', function() {
    it('can delete data of collection, returns delete result of mongoose', async function() {
      const query = makeQueryBuilder('User')
      query.where('first_name', 'peter')

      const result = await makeQueryExecutor(query, UserModel).delete()
      expect(result).toEqual({ n: 1, ok: 1 })
      expect_query_log(
        {
          raw: 'User.remove({"first_name":"peter"}).exec()',
          action: 'delete'
        },
        result
      )

      const count = await makeQueryExecutor(makeQueryBuilder('User'), UserModel).count()
      expect(count).toEqual(6)
    })

    it('can delete data by query builder, case 1', async function() {
      const query = makeQueryBuilder('User')
      query.where('age', 1001)

      const result = await makeQueryExecutor(query, UserModel).delete()
      expect(result).toEqual({ n: 1, ok: 1 })
      expect_query_log(
        {
          raw: 'User.remove({"age":1001}).exec()',
          action: 'delete'
        },
        result
      )

      const count = await makeQueryExecutor(makeQueryBuilder('User'), UserModel).count()
      expect(count).toEqual(5)
    })

    it('can delete data by query builder, case 2: multiple documents', async function() {
      const query = makeQueryBuilder('User')
      query.where('first_name', 'tony').orWhere('first_name', 'jane')

      const result = await makeQueryExecutor(query, UserModel).delete()
      expect(result).toEqual({ n: 3, ok: 1 })
      expect_query_log(
        {
          raw: 'User.remove({"$or":[{"first_name":"tony"},{"first_name":"jane"}]}).exec()',
          action: 'delete'
        },
        result
      )

      const count = await makeQueryExecutor(makeQueryBuilder('User'), UserModel).count()
      expect(count).toEqual(2)
    })

    it('returns an empty object is executeMode is disabled', async function() {
      const query = makeQueryBuilder('User')
      query.where('first_name', 'tony').orWhere('first_name', 'jane')

      const result = await makeQueryExecutor(query, UserModel)
        .setExecuteMode('disabled')
        .delete()
      expect(result).toEqual({})
      expect_query_log(
        {
          raw: 'User.remove({"$or":[{"first_name":"tony"},{"first_name":"jane"}]}).exec()',
          action: 'delete'
        },
        result
      )

      const count = await makeQueryExecutor(makeQueryBuilder('User'), UserModel).count()
      expect(count).toEqual(2)
    })

    it('can delete data by query builder, case 3', async function() {
      const query = makeQueryBuilder('User')
      query.where('first_name', 'john').where('last_name', 'doe')

      const result = await makeQueryExecutor(query, UserModel).delete()
      expect(result).toEqual({ n: 1, ok: 1 })
      expect_query_log(
        {
          raw: 'User.remove({"first_name":"john","last_name":"doe"}).exec()',
          action: 'delete'
        },
        result
      )

      const count = await makeQueryExecutor(makeQueryBuilder('User'), UserModel).count()
      expect(count).toEqual(1)
    })

    it('can not call delete without using any .where() statement', async function() {
      const result = await makeQueryExecutor(makeQueryBuilder('User'), UserModel).delete()
      expect(result).toEqual({ n: 0, ok: 1 })
    })

    it('can not call delete if query is empty', async function() {
      const query = makeQueryBuilder('User')
      query.select('any')

      const result = await makeQueryExecutor(query, UserModel).delete()
      expect(result).toEqual({ n: 0, ok: 1 })
    })

    it('can delete by native() function', async function() {
      const result = await makeQueryExecutor(makeQueryBuilder('User'), UserModel)
        .native(function(model: any) {
          return model.remove({})
        })
        .execute()
      expect(result).toEqual({ n: 1, ok: 1 })

      const count = await makeQueryExecutor(makeQueryBuilder('User'), UserModel).count()
      expect(count).toEqual(0)
    })
  })

  describe('.restore()', function() {
    it('does nothing if Model do not support SoftDeletes', async function() {
      const query = makeQueryBuilder('User', {
        getDriver() {
          return {
            getSoftDeletesFeature() {
              return {
                hasSoftDeletes() {
                  return false
                }
              }
            }
          }
        }
      })
      query.where('first_name', 'peter')

      const result = await makeQueryExecutor(query, UserModel).restore()
      expect(result).toEqual({ n: 0, nModified: 0, ok: 1 })
    })

    it('can not call restore if query is empty', async function() {
      const query = makeQueryBuilder('User', {
        getDriver() {
          return {
            getSoftDeletesFeature() {
              return {
                hasSoftDeletes() {
                  return true
                },
                getSoftDeletesSetting() {
                  return { deletedAt: 'deleted_at', overrideMethods: true }
                }
              }
            }
          }
        }
      })
      query.withTrashed()
      const result = await makeQueryExecutor(query, UserModel).restore()
      expect(result).toEqual({ n: 0, nModified: 0, ok: 1 })
    })

    it('returns an empty object is executeMode is disabled', async function() {
      const query = makeQueryBuilder('Role', {
        getDriver() {
          return {
            getSoftDeletesFeature() {
              return {
                hasSoftDeletes() {
                  return true
                },
                getSoftDeletesSetting() {
                  return { deletedAt: 'deleted_at', overrideMethods: true }
                }
              }
            }
          }
        }
      })
      query.onlyTrashed().where('name', 'role-0')

      const result = await makeQueryExecutor(query, RoleModel)
        .setExecuteMode('disabled')
        .restore()
      expect(result).toEqual({})
      expect_query_log(
        {
          raw:
            'Role.update({"deleted_at":{"$ne":null},"name":"role-0"}, {"$set":{"deleted_at":null}}, {"multi":true}).exec()',
          action: 'restore'
        },
        result
      )
      const count = await makeQueryExecutor(makeQueryBuilder('Role'), RoleModel).count()
      expect(count).toEqual(0)
    })

    it('can restore data by query builder, case 1', async function() {
      const query = makeQueryBuilder('Role', {
        getDriver() {
          return {
            getSoftDeletesFeature() {
              return {
                hasSoftDeletes() {
                  return true
                },
                getSoftDeletesSetting() {
                  return { deletedAt: 'deleted_at', overrideMethods: true }
                }
              }
            }
          }
        }
      })
      query.onlyTrashed().where('name', 'role-0')

      const result = await makeQueryExecutor(query, RoleModel).restore()
      expect(result).toEqual({ n: 1, nModified: 1, ok: 1 })
      expect_query_log(
        {
          raw:
            'Role.update({"deleted_at":{"$ne":null},"name":"role-0"}, {"$set":{"deleted_at":null}}, {"multi":true}).exec()',
          action: 'restore'
        },
        result
      )
      const count = await makeQueryExecutor(makeQueryBuilder('Role'), RoleModel).count()
      expect(count).toEqual(1)
    })

    it('can restore data by query builder, case 2: multiple documents', async function() {
      const query = makeQueryBuilder('Role', {
        getDriver() {
          return {
            getSoftDeletesFeature() {
              return {
                hasSoftDeletes() {
                  return true
                },
                getSoftDeletesSetting() {
                  return { deletedAt: 'deleted_at', overrideMethods: true }
                }
              }
            }
          }
        }
      })
      await query
        .withTrashed()
        .where('name', 'role-1')
        .orWhere('name', 'role-2')
        .orWhere('name', 'role-3')

      const result = await makeQueryExecutor(query, RoleModel).restore()
      expect(result).toEqual({ n: 3, nModified: 3, ok: 1 })
      const conditions = {
        $or: [{ name: 'role-1' }, { name: 'role-2' }, { name: 'role-3' }]
      }
      expect_query_log(
        {
          raw: `Role.update(${JSON.stringify(conditions)}, {"$set":{"deleted_at":null}}, {"multi":true}).exec()`,
          action: 'restore'
        },
        result
      )
      const count = await makeQueryExecutor(makeQueryBuilder('Role'), RoleModel).count()
      expect(count).toEqual(4)
    })
  })

  describe('.native()', function() {
    it('is chain-able', function() {
      const query = makeQueryExecutor(makeQueryBuilder('User'), UserModel)
      expect(
        query.native(function(model) {
          return model.find()
        })
      ).toEqual(query)
    })

    it('passes .createQuery(false) result if there is a query builder functions was used', function() {
      const query = makeQueryExecutor(makeQueryBuilder('User'), UserModel)
      query.native(function(nativeQuery: any) {
        expect(nativeQuery === query['mongooseQuery']).toBe(true)
        return nativeQuery
      })
    })
  })

  describe('.execute()', function() {
    it('does nothing and returns an empty array if executeMode is disabled', async function() {
      const query = makeQueryBuilder('User')
      query.where('age', 40).orWhere('age', 1000)

      const result = await makeQueryExecutor(query, UserModel)
        .native(function(collection) {
          return collection.findOne({
            first_name: 'thor'
          })
        })
        .setExecuteMode('disabled')
        .execute()
      expect(result).toEqual({})
      expect_query_log(
        {
          raw: 'User.find({"$or":[{"age":40},{"age":1000}]}).exec()',
          action: 'execute'
        },
        result
      )
    })
  })

  describe('.constructor()', function() {
    it('find modelName from mongooseModel.modelName, otherwise will use queryHandler.getModel().getModelName()', function() {
      const query = makeQueryBuilder('User')
      const executor = makeQueryExecutor(query, {})
      expect(executor['modelName']).toEqual('User')

      const queryTwo = makeQueryBuilder('Anything')
      const executorTwo = makeQueryExecutor(queryTwo, UserModel)
      expect(executorTwo['modelName']).toEqual('User')
    })
  })

  describe('.getMongooseModel()', function() {
    it('simply returns property mongooseModel', function() {
      const query = makeQueryBuilder('User')
      const executor = makeQueryExecutor(query, {})
      expect(executor.getMongooseModel() === executor['mongooseModel']).toBe(true)
    })
  })

  describe('.getMongooseQuery()', function() {
    it('does nothing, just returns .mongooseQuery if .hasMongooseQuery is true', function() {
      const executor = makeQueryExecutor(makeQueryBuilder('User'), UserModel)

      const mongooseQuery: any = {}
      executor['hasMongooseQuery'] = true
      executor['mongooseQuery'] = mongooseQuery

      expect(executor.createQuery(true) === mongooseQuery).toBe(true)
    })

    it('convert conditions of basicQuery then create mongooseQuery from mongooseModel use .find() if isFindOne = false', function() {
      const query = makeQueryBuilder('User')
      query.where('a', 1).where('b', 2)
      const executor = makeQueryExecutor(query, UserModel)

      executor.getMongooseQuery(false)
      executor['logger'].end({})

      expect_query_log({ raw: 'User.find({"a":1,"b":2})' })
    })

    it('convert conditions of basicQuery then create mongooseQuery from mongooseModel use .findOne() if isFindOne = true', function() {
      const query = makeQueryBuilder('User')
      query.where('a', 1).where('b', 2)
      const executor = makeQueryExecutor(query, UserModel)

      executor.getMongooseQuery(true)
      executor['logger'].end({})

      expect_query_log({ raw: 'User.findOne({"a":1,"b":2})' })
    })
  })

  describe('.passSelectToQuery()', function() {
    it('does nothing if there is no select in queryBuilder', function() {
      const query = makeQueryBuilder('User')
      const executor = makeQueryExecutor(query, UserModel)

      const mongooseQuery = executor.getMongooseQuery(false)
      executor.passSelectToQuery(mongooseQuery)
      executor['logger'].end({})

      expect_query_log({ raw: 'User.find({})' })
    })

    it('passed selected field to MongooseQuery if needed', function() {
      const query = makeQueryBuilder('User')
      query.select('a', 'b').select('a', 'c')
      const executor = makeQueryExecutor(query, UserModel)

      const mongooseQuery = executor.getMongooseQuery(false)
      executor.passSelectToQuery(mongooseQuery)
      executor['logger'].end({})

      expect_query_log({ raw: 'User.find({}).select("a b c")' })
    })
  })

  describe('.passLimitToQuery()', function() {
    it('does nothing if there is no limit in queryBuilder', function() {
      const query = makeQueryBuilder('User')
      const executor = makeQueryExecutor(query, UserModel)

      const mongooseQuery = executor.getMongooseQuery(false)
      executor.passLimitToQuery(mongooseQuery)
      executor['logger'].end({})

      expect_query_log({ raw: 'User.find({})' })
    })

    it('passed limit number to MongooseQuery if needed', function() {
      const query = makeQueryBuilder('User')
      query.limit(100)
      const executor = makeQueryExecutor(query, UserModel)

      const mongooseQuery = executor.getMongooseQuery(false)
      executor.passLimitToQuery(mongooseQuery)
      executor['logger'].end({})

      expect_query_log({ raw: 'User.find({}).limit(100)' })
    })
  })

  describe('.passOrderingToQuery()', function() {
    it('does nothing if there is no limit in queryBuilder', function() {
      const query = makeQueryBuilder('User')
      const executor = makeQueryExecutor(query, UserModel)

      const mongooseQuery = executor.getMongooseQuery(false)
      executor.passOrderingToQuery(mongooseQuery)
      executor['logger'].end({})

      expect_query_log({ raw: 'User.find({})' })
    })

    it('passed order to MongooseQuery if needed', function() {
      const query = makeQueryBuilder('User')
      query.orderByAsc('a').orderByDesc('b')
      const executor = makeQueryExecutor(query, UserModel)

      const mongooseQuery = executor.getMongooseQuery(false)
      executor.passOrderingToQuery(mongooseQuery)
      executor['logger'].end({})

      expect_query_log({ raw: 'User.find({}).sort({"a":1,"b":-1})' })
    })
  })

  describe('.createQuery()', function() {
    it('calls .getMongooseQuery() then call 3 pass params functions', function() {
      const query = makeQueryBuilder('User')
      const executor = makeQueryExecutor(query, UserModel)

      const getMongooseQueryStub = Sinon.stub(executor, 'getMongooseQuery')
      getMongooseQueryStub.returns('anything')

      const passSelectToQueryStub = Sinon.stub(executor, 'passSelectToQuery')
      passSelectToQueryStub.returns('pass function 1')

      const passLimitToQueryStub = Sinon.stub(executor, 'passLimitToQuery')
      passLimitToQueryStub.returns('pass function 2')

      const passOrderingToQueryStub = Sinon.stub(executor, 'passOrderingToQuery')
      passOrderingToQueryStub.returns('pass function 3')

      expect(executor.createQuery(true)).toBe('anything')
      expect(getMongooseQueryStub.calledWith(true)).toBe(true)
      expect(passSelectToQueryStub.calledWith('anything')).toBe(true)
      expect(passLimitToQueryStub.calledWith('anything')).toBe(true)
      expect(passOrderingToQueryStub.calledWith('anything')).toBe(true)
    })
  })
})

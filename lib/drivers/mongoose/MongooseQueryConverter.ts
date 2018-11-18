import { make } from 'najs-binding'
import { MongooseConditionMatcherFactory } from './MongooseConditionMatcherFactory'
import { NajsEloquent as NajsEloquentLib } from 'najs-eloquent'
import { MongooseConditionMatcher } from './MongooseConditionMatcher'

export type RawConditions = Array<MongooseConditionMatcher | RawConvertedQuery>
export type RawConvertedQuery = { $and: RawConditions[] } | { $or: RawConditions[] } | {}

export class MongooseQueryConverter {
  protected basicQuery: NajsEloquentLib.QueryBuilder.Shared.BasicQuery

  constructor(basicQuery: NajsEloquentLib.QueryBuilder.Shared.BasicQuery) {
    this.basicQuery = basicQuery
  }

  getConvertedQuery() {
    return this.convert(this.getRawConvertedQueryFromBasicQueryConverter())
  }

  getRawConvertedQueryFromBasicQueryConverter(): RawConvertedQuery {
    const converter = new NajsEloquentLib.QueryBuilder.Shared.BasicQueryConverter(
      this.basicQuery,
      make<MongooseConditionMatcherFactory>(MongooseConditionMatcherFactory.className)
    )

    return converter.getConvertedQuery()
  }

  convert(rawQuery: RawConvertedQuery): object {
    if (typeof rawQuery['$and'] === 'undefined') {
      if (typeof rawQuery['$or'] === 'undefined') {
        return {}
      }
      return { $or: this.toMongodbQuery(rawQuery['$or']) }
    }

    if (!this.shouldSimplify(rawQuery['$and'])) {
      return { $and: this.toMongodbQuery(rawQuery['$and']) }
    }

    return this.simplify(rawQuery['$and'])
  }

  toMongodbQuery(conditions: RawConditions) {
    const result = []
    for (const condition of conditions) {
      if (condition instanceof MongooseConditionMatcher) {
        result.push(condition.toMongodbQuery())
        continue
      }

      result.push(this.convert(condition))
    }
    return result
  }

  simplify(conditions: MongooseConditionMatcher[]) {
    return conditions.reduce(function(result, condition) {
      result[condition.getField()] = condition.getMongodbQueryValue()

      return result
    }, {})
  }

  shouldSimplify(conditions: RawConditions) {
    const fields: string[] = []
    for (const condition of conditions) {
      if (!(condition instanceof MongooseConditionMatcher)) {
        return false
      }

      const currentField = condition.getField()
      if (fields.indexOf(currentField) !== -1) {
        return false
      }
      fields.push(currentField)
    }
    return true
  }
}

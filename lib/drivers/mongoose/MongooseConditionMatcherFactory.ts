/// <reference types="najs-eloquent" />

import IConditionMatcherFactory = NajsEloquent.QueryBuilder.IConditionMatcherFactory
import SingleQueryConditionData = NajsEloquent.QueryBuilder.SingleQueryConditionData

import { register } from 'najs-binding'
import { ClassNames } from '../../constants'
import { MongooseConditionMatcher } from './MongooseConditionMatcher'

export class MongooseConditionMatcherFactory implements IConditionMatcherFactory {
  static className: string = ClassNames.Driver.Mongoose.MongooseConditionMatcherFactory

  getClassName() {
    return ClassNames.Driver.Mongoose.MongooseConditionMatcherFactory
  }

  make(data: SingleQueryConditionData): MongooseConditionMatcher {
    return new MongooseConditionMatcher(data.field, data.operator, data.value)
  }

  transform(matcher: MongooseConditionMatcher): MongooseConditionMatcher {
    return matcher
  }
}
register(MongooseConditionMatcherFactory, ClassNames.Driver.Mongoose.MongooseConditionMatcherFactory, true, true)

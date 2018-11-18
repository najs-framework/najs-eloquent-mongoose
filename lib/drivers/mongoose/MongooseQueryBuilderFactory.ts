import { register } from 'najs-binding'
import { ClassNames } from '../../constants'
import { MongooseQueryBuilder } from './MongooseQueryBuilder'
import { MongooseQueryBuilderHandler } from './MongooseQueryBuilderHandler'

export class MongooseQueryBuilderFactory implements NajsEloquent.QueryBuilder.IQueryBuilderFactory {
  static className: string = ClassNames.Driver.Mongoose.MongooseQueryBuilderFactory

  getClassName() {
    return ClassNames.Driver.Mongoose.MongooseQueryBuilderFactory
  }

  make(model: NajsEloquent.Model.IModel): MongooseQueryBuilder<any> {
    return new MongooseQueryBuilder(new MongooseQueryBuilderHandler(model))
  }
}
register(MongooseQueryBuilderFactory, ClassNames.Driver.Mongoose.MongooseQueryBuilderFactory, true, true)

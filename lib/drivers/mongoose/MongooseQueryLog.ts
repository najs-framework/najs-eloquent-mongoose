import { NajsEloquent } from 'najs-eloquent'

export interface IMongooseQueryLogData extends NajsEloquent.Driver.IQueryLogData {
  query?: object
  options?: object
}

export class MongooseQueryLog extends NajsEloquent.Driver.QueryLogBase<IMongooseQueryLogData> {
  getDefaultData(): IMongooseQueryLogData {
    return this.getEmptyData()
  }

  query(data: object): object {
    this.data.query = data

    return data
  }

  options(data: object | undefined): object | undefined {
    this.data.options = data

    return data
  }
}

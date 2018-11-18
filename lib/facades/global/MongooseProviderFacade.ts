/// <reference path="../../contracts/MongooseProvider.ts" />

import '../../providers/MongooseProvider'
import { make } from 'najs-binding'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { NajsEloquentFacadeContainer } from 'najs-eloquent'
import { Mongoose, Model, Schema, Document } from 'mongoose'
import { ClassNames } from '../../constants'

export interface IMongooseProviderFacade
  extends Najs.Contracts.Eloquent.MongooseProvider<Mongoose, Schema, Model<Document>> {}

const facade = Facade.create<IMongooseProviderFacade>(NajsEloquentFacadeContainer, 'MongooseProvider', function() {
  return make<IMongooseProviderFacade>(ClassNames.Provider.MongooseProvider)
})

export const MongooseProviderFacade: IMongooseProviderFacade & IFacade = facade
export const MongooseProvider: IMongooseProviderFacade & IFacadeBase = facade

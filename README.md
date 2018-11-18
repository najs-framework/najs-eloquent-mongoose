# najs-eloquent-mongoose

> Mongoose driver for NajsEloquent - an ORM written in Typescript, inspired by Laravel Eloquent.

[![Travis](https://img.shields.io/travis/najs-framework/najs-eloquent-mongoose/master.svg?style=flat-square)](https://travis-ci.org/najs-framework/najs-eloquent-mongoose/builds)
[![Maintainability](https://api.codeclimate.com/v1/badges/8e742d9ea43f41650492/maintainability)](https://codeclimate.com/github/najs-framework/najs-eloquent-mongoose/maintainability)
[![Coverage Status](https://img.shields.io/coveralls/najs-framework/najs-eloquent-mongoose/master.svg?style=flat-square)](https://coveralls.io/r/najs-framework/najs-eloquent-mongoose?branch=master)
[![node version](https://img.shields.io/node/v/najs-eloquent-mongoose.svg?style=flat-square)](https://nodejs.org/en/download/)
[![npm version](https://img.shields.io/npm/v/najs-eloquent-mongoose.svg?style=flat-square)](http://badge.fury.io/js/najs-eloquent)
[![npm downloads](https://img.shields.io/npm/dm/najs-eloquent-mongoose.svg?style=flat-square)](http://badge.fury.io/js/najs-eloquent)
[![npm license](https://img.shields.io/npm/l/najs-eloquent-mongoose.svg?style=flat-square)](http://badge.fury.io/js/najs-eloquent)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Installation

Add `najs-binding`, `najs-eloquent`, `najs-eloquent-mongoose`

```bash
yarn add najs-binding najs-eloquent najs-eloquent-mongoose
```

or

```bash
npm install najs-binding najs-eloquent najs-eloquent-mongoose
```

That's it.

## Define Model runs with MongooseDriver

You can register MongooseDriver as default driver by this way

```typescript
import { DriverProvider } from 'najs-eloquent'
import { MongooseDriver } from 'najs-eloquent-mongoose'

DriverProvider.register(MongooseDriver, 'mongoose', true)
```

Or if you want to use MongooseDriver for some specific models only, you can extends from `MongooseModel` instead of `Model`

```typescript
import { MongooseModel } from 'najs-eloquent-mongoose'

export class User extends MongooseModel {
  // define a property belongs to User model
  email: string

  // define a class name which used for Dependency injection
  // (this feature provided by "najs-binding" package)
  getClassName() {
    return 'YourNamespace.User'
  }
}

// Register the User class
MongooseModel.register(User)
```

## Connect to database and provide custom mongoose instance

Because `mongoose` is a singleton, you may want to connect and provide your own instance by using `.bind()` function of the `najs-binding` package. _Note: Please ensure that this file is loaded before using najs-eloquent._

```typescript
import { bind } from 'najs-binding'
import { MongooseProviderFacade } from 'najs-eloquent-mongoose'

// Load your mongoose instance instead of mongoose dependency in "najs-eloquent-mongoose" package
const mongoose = require('mongoose')

// connect your mongoose instance to your server
mongoose.connect('mongodb://localhost:27017/your-app')

export class YourMongooseProvider {
  static className: string = 'YourNamespace.YourMongooseProvider'

  getClassName() {
    return YourMongooseProvider.className
  }

  getMongooseInstance(): Mongoose {
    return mongoose
  }

  createModelFromSchema(modelName: string, schema: any): any {
    return model<T>(modelName, schema)
  }
}

bind('NajsEloquent.Provider.MongooseProvider', YourMongooseProvider.className)

// Reload the facade, then najs-eloquent will use your mongoose instance
MongooseProviderFacade.reloadFacadeRoot()
```

## Contribute

PRs are welcomed to this project, and help is needed in order to keep up with the changes of Laravel Eloquent. If you want to improve the library, add functionality or improve the docs please feel free to submit a PR.

## Sponsors

If you want to become a sponsor please [let me know](mailto:nhat@ntworld.net).

You can buy me a beer via [Paypal](https://paypal.me/beerfornhat) or [Patreon](https://patreon.com/nhat).

Thanks in advance!

## License

MIT © Nhat Phan

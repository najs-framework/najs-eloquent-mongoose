/// <reference types="najs-eloquent" />

import { Schema, Model } from 'mongoose'
import { isObject } from 'lodash'
import { MomentProvider } from 'najs-eloquent'

// tslint:disable-next-line
const NOT_DELETED_VALUE = null
const DEFAULT_OPTIONS: NajsEloquent.Feature.ISoftDeletesSetting = { deletedAt: 'deleted_at', overrideMethods: false }

export function SoftDelete(schema: Schema, options: NajsEloquent.Feature.ISoftDeletesSetting | boolean) {
  const opts: NajsEloquent.Feature.ISoftDeletesSetting = isObject(options)
    ? Object.assign({}, DEFAULT_OPTIONS, options)
    : DEFAULT_OPTIONS

  schema.add({
    [opts.deletedAt]: { type: Date, default: NOT_DELETED_VALUE }
  })

  if (opts.overrideMethods) {
    apply_override_methods(schema, opts)
  }

  schema.methods.delete = function(...args: any[]) {
    this[opts.deletedAt] = MomentProvider.make().toDate()
    return this.save(...args)
  }

  schema.methods.restore = function(callback: any) {
    this[opts.deletedAt] = NOT_DELETED_VALUE
    return this.save(callback)
  }
}

function find_override_methods(opts: NajsEloquent.Feature.ISoftDeletesSetting): string[] {
  const overridableMethods: string[] = ['count', 'find', 'findOne']
  let finalList: string[] = []

  if (
    (typeof opts.overrideMethods === 'string' || <any>opts.overrideMethods instanceof String) &&
    opts.overrideMethods === 'all'
  ) {
    finalList = overridableMethods
  }

  if (typeof opts.overrideMethods === 'boolean' && opts.overrideMethods === true) {
    finalList = overridableMethods
  }

  if (Array.isArray(opts.overrideMethods)) {
    opts.overrideMethods.forEach(function(method) {
      if (overridableMethods.indexOf(method) !== -1) {
        finalList.push(method)
      }
    })
  }
  return finalList
}

function apply_override_methods(schema: Schema, opts: NajsEloquent.Feature.ISoftDeletesSetting) {
  find_override_methods(opts).forEach(function(method) {
    schema.statics[method] = function() {
      return Model[method]
        .apply(this, arguments)
        .where(opts.deletedAt)
        .equals(NOT_DELETED_VALUE)
    }
    schema.statics[method + 'OnlyDeleted'] = function() {
      return Model[method]
        .apply(this, arguments)
        .where(opts.deletedAt)
        .ne(NOT_DELETED_VALUE)
    }
    schema.statics[method + 'WithDeleted'] = function() {
      return Model[method].apply(this, arguments)
    }
  })
}

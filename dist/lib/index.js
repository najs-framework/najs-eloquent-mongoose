"use strict";
/// <reference types="najs-eloquent" />
/// <reference path="contracts/MongooseProvider.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var MongooseModel_1 = require("./drivers/mongoose/MongooseModel");
exports.MongooseModel = MongooseModel_1.MongooseModel;
var MongooseProviderFacade_1 = require("./facades/global/MongooseProviderFacade");
exports.MongooseProviderFacade = MongooseProviderFacade_1.MongooseProviderFacade;
exports.MongooseProvider = MongooseProviderFacade_1.MongooseProvider;

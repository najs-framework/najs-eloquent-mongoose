"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const najs_binding_1 = require("najs-binding");
const MongooseQueryLog_1 = require("../../../lib/drivers/mongoose/MongooseQueryLog");
const MongooseExecutorFactory_1 = require("../../../lib/drivers/mongoose/MongooseExecutorFactory");
const MongooseRecordExecutor_1 = require("../../../lib/drivers/mongoose/MongooseRecordExecutor");
const MongooseQueryExecutor_1 = require("../../../lib/drivers/mongoose/MongooseQueryExecutor");
const MongooseProviderFacade_1 = require("../../../lib/facades/global/MongooseProviderFacade");
describe('MongooseExecutorFactory', function () {
    it('implements IAutoload and register with singleton option = true', function () {
        const a = najs_binding_1.make(MongooseExecutorFactory_1.MongooseExecutorFactory.className);
        const b = najs_binding_1.make(MongooseExecutorFactory_1.MongooseExecutorFactory.className);
        expect(a.getClassName()).toEqual('NajsEloquent.Driver.Mongoose.MongooseExecutorFactory');
        expect(a === b).toBe(true);
    });
    describe('.makeRecordExecutor()', function () {
        it('creates new instance of MongooseRecordExecutor with model, record, collection and logger', function () {
            const model = {};
            const document = {};
            const factory = najs_binding_1.make(MongooseExecutorFactory_1.MongooseExecutorFactory.className);
            const recordExecutor = factory.makeRecordExecutor(model, document);
            expect(recordExecutor).toBeInstanceOf(MongooseRecordExecutor_1.MongooseRecordExecutor);
            expect(recordExecutor['model'] === model).toBe(true);
            expect(recordExecutor['document'] === document).toBe(true);
        });
    });
    describe('.makeQueryExecutor()', function () {
        it('creates new instance of MongooseQueryExecutor with model, record, collection and logger', function () {
            const basicQuery = {};
            const model = {
                getModelName() {
                    return 'any';
                }
            };
            const handler = {
                getQueryName() {
                    return 'test';
                },
                getBasicQuery() {
                    return basicQuery;
                },
                getModel() {
                    return model;
                }
            };
            const mongooseModel = {};
            const mongooseInstance = {
                model(name) {
                    return mongooseModel;
                }
            };
            const stub = MongooseProviderFacade_1.MongooseProvider.getFacade().createStub('getMongooseInstance');
            stub.returns(mongooseInstance);
            const factory = najs_binding_1.make(MongooseExecutorFactory_1.MongooseExecutorFactory.className);
            const queryExecutor = factory.makeQueryExecutor(handler);
            expect(queryExecutor).toBeInstanceOf(MongooseQueryExecutor_1.MongooseQueryExecutor);
            expect(queryExecutor['queryHandler'] === handler).toBe(true);
            expect(queryExecutor['mongooseModel'] === mongooseModel).toBe(true);
            stub.restore();
        });
    });
    describe('.getMongooseModel()', function () {
        it('calls and returns MongooseProviderFacade.getMongooseInstance().model()', function () {
            const model = {
                getModelName() {
                    return 'Model';
                }
            };
            const mongooseModel = { name: '' };
            const mongooseInstance = {
                model(name) {
                    mongooseModel.name = name;
                    return mongooseModel;
                }
            };
            const stub = MongooseProviderFacade_1.MongooseProvider.getFacade().createStub('getMongooseInstance');
            stub.returns(mongooseInstance);
            const result = najs_binding_1.make(MongooseExecutorFactory_1.MongooseExecutorFactory.className).getMongooseModel(model);
            expect(result === mongooseModel).toBe(true);
            expect(result.name).toEqual('Model');
            stub.restore();
        });
    });
    describe('.makeLogger()', function () {
        it('simply create new MongooseQueryLog', function () {
            const factory = najs_binding_1.make(MongooseExecutorFactory_1.MongooseExecutorFactory.className);
            expect(factory.makeLogger()).toBeInstanceOf(MongooseQueryLog_1.MongooseQueryLog);
        });
    });
});

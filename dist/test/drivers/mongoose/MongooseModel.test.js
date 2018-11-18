"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const najs_eloquent_1 = require("najs-eloquent");
const MongooseModel_1 = require("../../../lib/drivers/mongoose/MongooseModel");
const MongooseQueryBuilder_1 = require("../../../lib/drivers/mongoose/MongooseQueryBuilder");
const najs_binding_1 = require("najs-binding");
describe('MongooseModel', function () {
    class User extends MongooseModel_1.MongooseModel {
        getClassName() {
            return 'User';
        }
    }
    najs_binding_1.register(User);
    it('extends Model', function () {
        const model = new User();
        expect(model).toBeInstanceOf(MongooseModel_1.MongooseModel);
        expect(model).toBeInstanceOf(najs_eloquent_1.Model);
    });
    it('should not be discovered by RelationFinder', function () {
        expect(najs_eloquent_1.NajsEloquent.Util.PrototypeManager.shouldFindRelationsIn(MongooseModel_1.MongooseModel.prototype)).toBe(false);
    });
    describe('.newQuery()', function () {
        it('returns an instance of MongooseQueryBuilder', function () {
            const model = new User();
            expect(model.newQuery()).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
        });
    });
    describe('.getNativeModel()', function () {
        it('calls and returns .newQuery().nativeModel()', function () {
            const nativeModel = {};
            const fakeQuery = {
                nativeModel() {
                    return nativeModel;
                }
            };
            const model = new User();
            const newQueryStub = Sinon.stub(model, 'newQuery');
            newQueryStub.returns(fakeQuery);
            expect(model.getNativeModel() === nativeModel).toBe(true);
        });
    });
});

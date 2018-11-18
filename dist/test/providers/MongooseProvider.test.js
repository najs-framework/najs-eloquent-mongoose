"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const najs_facade_1 = require("najs-facade");
const MongooseProvider_1 = require("../../lib/providers/MongooseProvider");
const mongoose = require('mongoose');
describe('MongooseProvider', function () {
    it('extends Facade and implements Autoload under name "NajsEloquent.Provider.MongooseProvider"', function () {
        const instance = new MongooseProvider_1.MongooseProvider();
        expect(instance).toBeInstanceOf(najs_facade_1.Facade);
        expect(instance.getClassName()).toEqual('NajsEloquent.Provider.MongooseProvider');
    });
    describe('.getMongooseInstance()', function () {
        it('simply returns mongoose from the mongoose package', function () {
            const instance = new MongooseProvider_1.MongooseProvider();
            expect(instance.getMongooseInstance() === mongoose).toBe(true);
        });
    });
    describe('.createModelFromSchema()', function () {
        it('simply calls and returns model() from the mongoose package', function () {
            const stub = Sinon.stub(mongoose, 'model');
            stub.returns('anything');
            const schema = {};
            const instance = new MongooseProvider_1.MongooseProvider();
            expect(instance.createModelFromSchema('test', schema)).toEqual('anything');
            expect(stub.calledWith('test', schema)).toBe(true);
        });
    });
});

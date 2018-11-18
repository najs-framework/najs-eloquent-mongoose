"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const najs_eloquent_1 = require("najs-eloquent");
const MongooseDriver_1 = require("../../../lib/drivers/mongoose/MongooseDriver");
const MongooseQueryBuilderFactory_1 = require("../../../lib/drivers/mongoose/MongooseQueryBuilderFactory");
const MongooseDocumentManager_1 = require("../../../lib/drivers/mongoose/MongooseDocumentManager");
describe('MongooseDriver', function () {
    it('extends DriverBase, implements Autoload under name "NajsEloquent.Driver.MongooseDriver"', function () {
        const driver = new MongooseDriver_1.MongooseDriver();
        expect(driver).toBeInstanceOf(najs_eloquent_1.NajsEloquent.Driver.DriverBase);
        expect(driver.getClassName()).toEqual('NajsEloquent.Driver.MongooseDriver');
    });
    describe('constructor()', function () {
        it('makes RecordManager from "NajsEloquent.Driver.Mongoose.MongooseDocumentManager" class', function () {
            const makeSpy = Sinon.spy(NajsBinding, 'make');
            const driver = new MongooseDriver_1.MongooseDriver();
            expect(makeSpy.lastCall.calledWith('NajsEloquent.Driver.Mongoose.MongooseDocumentManager')).toBe(true);
            expect(driver['documentManager']).toBeInstanceOf(MongooseDocumentManager_1.MongooseDocumentManager);
            makeSpy.restore();
        });
    });
    describe('.getClassName()', function () {
        it('implements Autoload under name "NajsEloquent.Driver.MongooseDriver"', function () {
            const driver = new MongooseDriver_1.MongooseDriver();
            expect(driver.getClassName()).toEqual('NajsEloquent.Driver.MongooseDriver');
        });
    });
    describe('.getRecordManager()', function () {
        it('simply returns property "documentManager"', function () {
            const driver = new MongooseDriver_1.MongooseDriver();
            expect(driver.getRecordManager() === driver['documentManager']).toBe(true);
        });
    });
    describe('.makeQuery()', function () {
        it('creates and returns an instance of MongooseQueryBuilderFactory', function () {
            const driver = new MongooseDriver_1.MongooseDriver();
            const factory1 = driver.makeQueryBuilderFactory();
            const factory2 = driver.makeQueryBuilderFactory();
            expect(factory1 === factory2).toBe(true);
            expect(factory1).toBeInstanceOf(MongooseQueryBuilderFactory_1.MongooseQueryBuilderFactory);
        });
    });
});

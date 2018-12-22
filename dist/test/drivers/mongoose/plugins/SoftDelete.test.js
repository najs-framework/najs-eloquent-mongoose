"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const util_1 = require("../../../util");
const mongoose_1 = require("mongoose");
const SoftDelete_1 = require("../../../../lib/drivers/mongoose/plugins/SoftDelete");
const najs_eloquent_1 = require("najs-eloquent");
const mongoose = require('mongoose');
let count = 0;
function create_model(options) {
    const schema = new mongoose_1.Schema({
        name: String
    }, { collection: 'soft_deletes_' + count });
    schema.plugin(SoftDelete_1.SoftDelete, options);
    count++;
    return mongoose_1.model('SoftDelete' + count, schema);
}
function make_deletedAt_tests(Model, fieldName) {
    it('always add deleted_at = null when document is created', async function () {
        const document = new Model({
            name: 'test'
        });
        await document.save();
        expect(document[fieldName]).toBeNull();
    });
    it('defines new method called `delete()` and updates deleted_at = now', async function () {
        const now = new Date(1988, 4, 16);
        najs_eloquent_1.MomentProvider.setNow(() => now);
        const document = await Model.findOne({ name: 'test' });
        await document.delete();
        expect(document[fieldName]).toEqual(now);
    });
    it('defines new method called `restore()` and updates deleted_at = null', async function () {
        const now = new Date(2000, 0, 1);
        najs_eloquent_1.MomentProvider.setNow(() => now);
        const document = await Model.findOne({ name: 'test' });
        await document.restore();
        expect(document[fieldName]).toBeNull();
    });
}
function make_count_overridden_test(Model, isOverridden) {
    it('override count()', async function () {
        const notDeleted = await new Model({ name: 'test' }).save();
        const deleted = await new Model({ name: 'test' });
        await deleted.delete();
        if (isOverridden) {
            expect(await Model.count({ name: 'test' })).toEqual(1);
            expect(await Model.countOnlyDeleted({ name: 'test' })).toEqual(1);
            expect(await Model.countWithDeleted({ name: 'test' })).toEqual(2);
        }
        else {
            expect(await Model.count({ name: 'test' })).toEqual(2);
            expect(Model.countOnlyDeleted).toBeUndefined();
            expect(Model.countWithDeleted).toBeUndefined();
        }
        await notDeleted.remove();
        await deleted.remove();
    });
}
function make_findOne_overridden_test(Model, isOverridden) {
    it('override fineOne()', async function () {
        const notDeleted = new Model({ name: 'test' });
        await notDeleted.save();
        const deleted = await new Model({ name: 'test' });
        await deleted.delete();
        if (isOverridden) {
            expect((await Model.findOne({ name: 'test' })).toObject()).toEqual(notDeleted.toObject());
            expect((await Model.findOneOnlyDeleted({ name: 'test' })).toObject()).toEqual(deleted.toObject());
            expect((await Model.findOneWithDeleted({ name: 'test' })).toObject()).toEqual(notDeleted.toObject());
        }
        else {
            expect((await Model.findOne({ name: 'test' })).toObject()).toEqual(notDeleted.toObject());
            expect(Model.findOneOnlyDeleted).toBeUndefined();
            expect(Model.findOneWithDeleted).toBeUndefined();
        }
        await notDeleted.remove();
        await deleted.remove();
    });
}
function make_find_overridden_test(Model, isOverridden) {
    it('override fine()', async function () {
        const notDeleted = new Model({ name: 'test' });
        await notDeleted.save();
        const deleted = await new Model({ name: 'test' });
        await deleted.delete();
        if (isOverridden) {
            expect((await Model.find({ name: 'test' })).map((item) => item.toObject())).toEqual([notDeleted.toObject()]);
            expect((await Model.findOnlyDeleted({ name: 'test' })).map((item) => item.toObject())).toEqual([
                deleted.toObject()
            ]);
            expect((await Model.findWithDeleted({ name: 'test' })).map((item) => item.toObject())).toEqual([
                notDeleted.toObject(),
                deleted.toObject()
            ]);
        }
        else {
            expect((await Model.find({ name: 'test' })).map((item) => item.toObject())).toEqual([
                notDeleted.toObject(),
                deleted.toObject()
            ]);
            expect(Model.findOnlyDeleted).toBeUndefined();
            expect(Model.findWithDeleted).toBeUndefined();
        }
        await notDeleted.remove();
        await deleted.remove();
    });
}
describe('SoftDelete', function () {
    beforeAll(async function () {
        await util_1.init_mongoose(mongoose, 'soft_delete');
    });
    afterAll(async function () {
        for (let i = 0; i < count; i++) {
            await util_1.delete_collection(mongoose, 'soft_deletes_' + i);
        }
    });
    describe('Default Options', function () {
        make_deletedAt_tests(create_model(), 'deleted_at');
    });
    describe('options .deletedAt', function () {
        make_deletedAt_tests(create_model({ deletedAt: 'deletedAt' }), 'deletedAt');
        make_deletedAt_tests(create_model({ deletedAt: 'any' }), 'any');
    });
    describe('options overrideMethods', function () {
        describe('overrideMethods = false', function () {
            const Model = create_model({ overrideMethods: false });
            make_count_overridden_test(Model, false);
            make_findOne_overridden_test(Model, false);
            make_find_overridden_test(Model, false);
        });
        describe('overrideMethods = true', function () {
            const Model = create_model({ overrideMethods: true });
            make_count_overridden_test(Model, true);
            make_findOne_overridden_test(Model, true);
            make_find_overridden_test(Model, true);
        });
        describe('overrideMethods = "all"', function () {
            const Model = create_model({ overrideMethods: 'all' });
            make_count_overridden_test(Model, true);
            make_findOne_overridden_test(Model, true);
            make_find_overridden_test(Model, true);
        });
        describe('overrideMethods = ["count", "find"]', function () {
            const Model = create_model({ overrideMethods: ['count', 'find'] });
            make_count_overridden_test(Model, true);
            make_findOne_overridden_test(Model, false);
            make_find_overridden_test(Model, true);
        });
        describe('overrideMethods = ["not_found", "find"]', function () {
            const Model = create_model({ overrideMethods: ['not_found', 'find'] });
            make_count_overridden_test(Model, false);
            make_findOne_overridden_test(Model, false);
            make_find_overridden_test(Model, true);
        });
    });
});

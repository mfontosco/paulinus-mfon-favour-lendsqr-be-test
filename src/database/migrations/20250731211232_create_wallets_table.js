"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.createTable('wallets', (table) => {
            table.string("id", 36).primary().defaultTo(knex.raw("(UUID())"));
            table.uuid('user_id').notNullable()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
            table.decimal('balance', 18, 2).defaultTo(0.00);
            table.decimal('credit', 18, 2).defaultTo(0.00);
            table.decimal('debit', 18, 2).defaultTo(0.00);
            table.json('metadata');
            table.string('currency', 255).notNullable();
            table.datetime('created_at').defaultTo(knex.fn.now());
            table.datetime('updated_at').defaultTo(knex.fn.now());
        });
    });
}
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTable('wallets');
    });
}

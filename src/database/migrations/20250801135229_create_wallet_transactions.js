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
exports.down = exports.up = void 0;
const up = (knex) => __awaiter(void 0, void 0, void 0, function* () {
    yield knex.schema.createTable('wallet_transactions', (table) => {
        table.uuid('id').primary();
        table.uuid('wallet_id').notNullable()
            .references('id').inTable('wallets')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.uuid('user_id').notNullable()
            .references('id').inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.string('trx_ref', 255).notNullable();
        table.enu('transaction_type', ['credit', 'debit'], {
            useNative: false,
            enumName: 'transaction_type_enum',
        }).notNullable();
        table.string('currency', 10);
        table.decimal('previous_balance', 20, 2);
        table.decimal('balance', 20, 2);
        table.enu('transaction_status', ['pending', 'success', 'failed'], {
            useNative: false,
            enumName: 'transaction_status_enum',
        }).notNullable();
        table.string('description', 255);
        table.json('metadata');
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.datetime('updated_at').defaultTo(knex.fn.now());
    });
});
exports.up = up;
const down = (knex) => __awaiter(void 0, void 0, void 0, function* () {
    yield knex.schema.dropTableIfExists('wallet_transactions');
});
exports.down = down;

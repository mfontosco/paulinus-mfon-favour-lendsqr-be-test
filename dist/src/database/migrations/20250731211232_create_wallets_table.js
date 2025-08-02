"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
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
}
async function down(knex) {
    return knex.schema.dropTable('wallets');
}

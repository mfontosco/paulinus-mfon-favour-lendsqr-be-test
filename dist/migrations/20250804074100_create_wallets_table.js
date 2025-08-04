"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('wallets', (table) => {
        table.string("id", 36).primary();
        table.uuid('user_id').notNullable()
            .references('id').inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        table.decimal('balance', 18, 2).defaultTo(0.00);
        table.decimal('credit', 18, 2).defaultTo(0.00);
        table.decimal('debit', 18, 2).defaultTo(0.00);
        table.text("metadata");
        table.string('currency', 255).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_at').notNullable();
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('wallets');
}

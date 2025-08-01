import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('wallets', (table) => {
     table.string("id", 36).primary().defaultTo(knex.raw("(UUID())"));

    table.uuid('user_id').notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table.decimal('balance', 18, 2).defaultTo(0.00);
    table.decimal('credit', 18, 2).defaultTo(0.00);
    table.decimal('debit', 18, 2).defaultTo(0.00);

    table.text('metadata');
    table.string('currency', 255).notNullable();

    table.datetime('created_at').defaultTo(knex.fn.now());
    table.datetime('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('wallets');
}

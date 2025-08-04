import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('wallet_transactions', (table) => {
   table.string("id", 36).primary(); 

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
table.datetime('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));

  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTableIfExists('wallet_transactions');
};

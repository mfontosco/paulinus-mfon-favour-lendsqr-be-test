import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('wallets', (table) => {
    table.string("id", 36).primary(); 

    table.uuid('user_id').notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table.decimal('balance', 18, 2).defaultTo(0.00);
    table.decimal('credit', 18, 2).defaultTo(0.00);
    table.decimal('debit', 18, 2).defaultTo(0.00);

    table.json('metadata');
    table.string('currency', 255).notNullable();

  table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  table.timestamp('updated_at')
         .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
         .notNullable();

  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('wallets');
}

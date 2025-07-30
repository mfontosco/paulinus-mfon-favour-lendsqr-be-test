import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw('(UUID())'));
    table.string("email").unique().notNullable();
    table.string("full_name").notNullable();
    table.boolean("is_blacklisted").defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}

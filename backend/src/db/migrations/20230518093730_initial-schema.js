export const up = async (knex) => {
  await knex.schema.createTable("user", (table) => {
    table.increments("id"),
    table.text("firstName").notNullable(),
    table.text("lastName").notNullable(),
    table.boolean("isMentor").defaultTo(false)
  })

  await knex.schema.createTable("session", (table) => {
    table.increments("id"),
    table.text("name"),
    table.integer("idMentor").notNullable().references("id").inTable("user"),
    table.integer("idStudent").notNullable().references("id").inTable("user")
  })

  await knex.schema.createTable("sessionReview", (table) => {
    table.integer("idSession").notNullable().references("id").inTable("session"),
    table.integer("idMentor").notNullable().references("id").inTable("user"),
    table.integer("idStudent").notNullable().references("id").inTable("user")
    table.boolean("star").notNullable().defaultTo(false)
    table.primary(["idSession", "idMentor", "idStudent"]);
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("sessionReview");
  await knex.schema.dropTable("session");
  await knex.schema.dropTable("user");
}
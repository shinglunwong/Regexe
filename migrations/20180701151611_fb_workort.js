
exports.up = function(knex, Promise) {
    return knex.schema.createTable('fb_food',(table)=>{
        table.increments();
        table.text('name').notNullable();
        table.integer('quantity').notNullable();
        table.decimal('carb').notNullable();
        table.decimal('fats').notNullable();
        table.decimal('protein').notNullable();
        table.decimal('calories').notNullable();
        table.string('user_id').notNullable();
        table.timestamps(false,true); 
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('fb_food');

};

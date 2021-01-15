const xss = require('xss')

const BrewsService = {
    getBrews(knex, user_name) {
      return knex.raw(
            `SELECT 
                b.id, 
                b.name, 
                b.description,
                b.method,
                b.input,
                b.output,
                b.brew_time,
                b.grind,
                b.roast_level,
                b.user_id,
                b.date_created
            FROM brew_brews AS b
            JOIN brew_users AS u
            ON b.user_id = u.id
            WHERE user_name = '${user_name}'`
        )
    },
  
    insertBrew(knex, newBrew) {
      return knex
        .insert(newBrew)
        .into('brew_brews')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('brew_brews')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteBrew(knex, id) {
      return knex('brew_brews')
        .where({ id })
        .delete()
    },
  
    updateBrew(knex, id, newBrewFields) {
      return knex('brew_brews')
        .where({ id })
        .update(newBrewFields)
    },

    serializeBrews(brew) {
      return {
        id: brew.id,
        name: xss(brew.name),
        description: xss(brew.description),
        method: xss(brew.method),
        input: xss(brew.input),
        output: xss(brew.ouput),
        brew_time: xss(brew.brew_time),
        grind: xss(brew.grind),
        roast_level: xss(brew.roast_level)
      }
    }
  }
  
  module.exports = BrewsService
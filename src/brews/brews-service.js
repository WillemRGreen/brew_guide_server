const { should } = require('chai')
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

    makeRoastLevel(roastLevel){
      let roastNum = 0
      if(roastLevel == 'light'){
        roastNum += 1
      } else if(roastLevel == 'light/medium'){
        roastNum += 2
      }else if(roastLevel == 'medium'){
        roastNum += 3
      } else if(roastLevel == 'medium/dark'){
        roastNum += 4
      } else if(roastLevel == 'dark'){
        roastNum += 5
      }
      return roastNum
    },

    specsCalculate(roastLevel, method, output){
      let grindNum = roastLevel;
      let outputNum = parseInt(output)
      let newBrew = {
          grind: '',
          input: ''
      }
      if(method == 'automatic' || 'french-press'){
          grindNum += 1;
      } else if(method == 'kalita' || 'v60'){
          grindNum += 0;
      } else if(method == 'aeropress'){
          grindNum -= 1
      }
      if(grindNum <= 1){
          newBrew.grind = 'fine'
      } else if(grindNum == 2){
          newBrew.grind = 'medium/fine'
      } else if(grindNum == 3){
          newBrew.grind = 'medium'
      } else if(grindNum == 4){
          newBrew.grind = 'medium/coarse'
      } else if(grindNum >= 5){
          newBrew.grind = 'coarse'
      }
      if(method == 'kalita' || 'v60'){
          let inputNum = outputNum/17
          let finalInput = inputNum.toFixed(0)
          newBrew.input = finalInput.toString()
      } else if(method == 'automatic' || 'french-press'){
          let inputNum = outputNum/16
          let finalInput = inputNum.toFixed(0)
          newBrew.input = finalInput.toString()
      }else if(method == 'aeropress'){
          let inputNum = outputNum/15
          let finalInput = inputNum.toFixed(0)
          newBrew.input = finalInput.toString()
      }
      return newBrew;
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
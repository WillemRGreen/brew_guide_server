const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { default: xss } = require('xss')


function makeUsersArray() {
    return [
        {
            id:1,
            user_name: 'willemgreen',
            password: 'Willem96!'
        },
        {
            id:2,
            user_name: 'test-user2',
            password: 'password'
        },
        {
            id:3,
            user_name: 'test-user3',
            password: 'password'
        },
        {
            id:4,
            user_name: 'test-user4',
            password: 'password'
        },
    ]
}

function makeBrewsArray(users) {
    return [
        {
            id: 1,
            name: 'test brew',
            user_id: users[0].id,
            description: 'test description numero uno',
            input: '36',
            output: '596',
            method: 'kalita',
            roast_level: 'medium',
            grind: 'fine/medium',
            date_created: '2029-01-22T16:28:32.615Z'

        },
        {
            id: 2,
            name: 'test brew2',
            user_id: users[1].id,
            description: 'test description numero dos',
            input: '36',
            output: '596',
            method: 'v60',
            roast_level: 'medium',
            grind: 'fine/medium',
            date_created: '2029-01-22T16:28:32.615Z'

        },
        {
            id: 3,
            name: 'test brew3',
            user_id: users[2].id,
            description: 'test description numero tres',
            input: '36',
            output: '596',
            method: 'automatic',
            roast_level: 'medium',
            grind: 'fine/medium',
            date_created: '2029-01-22T16:28:32.615Z'

        },
        {
            id: 4,
            name: 'test brew4',
            user_id: users[3].id,
            description: 'test description numero quatro',
            input: '36',
            output: '596',
            method: 'french press',
            roast_level: 'medium',
            grind: 'fine/medium',
            date_created: '2029-01-22T16:28:32.615Z'

        },
    ]
}

function serializeBrews(brew) {
    return {
        id: brew.id,
        name: xss(brew.name),
        user_id: brew.user_id,
        description: xss(brew.description),
        input: xss(brew.input),
        output: xss(brew.output),
        method: xss(brew.method),
        roast_level: xss(brew.roast_level),
        grind: xss(brew.grind),
        date_created: brew.date_created
    }
}

function makeAllItems() {
    const testUsers = makeUsersArray()
    const testBrews = makeBrewsArray(testUsers)
    return { testUsers, testBrews }
}

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
            brew_brews,
            brew_users
            RESTART IDENTITY CASCADE`
    )
}

function seedTables(db, users, brews) {
    return db
        .into('brew_users')
        .insert(users)
        .then(() =>
            db 
                .into('brew_brews')
                .insert(brews))
}

function seedUsers(db, users){
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
      }))
      return db.into('brew_users').insert(preppedUsers)
        .then(() =>
          // update the auto sequence to stay in sync
          db.raw(
            `SELECT setval('brew_users_id_seq', ?)`,
            [users[users.length - 1].id],
          )
        )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.user_name,
      algorithm: 'HS256',
    })
    return `Bearer ${token}`
  }

module.exports = {
    makeBrewsArray,
    makeUsersArray,
    serializeBrews,
    makeAuthHeader,
    makeAllItems,
    cleanTables,
    seedTables,
    seedUsers
}
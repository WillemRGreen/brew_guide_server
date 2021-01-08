const path = require('path')
const express = require('express')
const xss = require('xss')
const BrewsService = require('./brews-service')
const { requireAuth } = require('../middleware/jwt-auth')

const brewsRouter = express.Router()
const jsonParser = express.json()

brewsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    const user_name = req.user.user_name
    BrewsService.getBrews(knexInstance, user_name)
      .then(brews => {
        res.json(brews.rows.map(BrewsService.serializeBrews))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name, description, method, input, output, brew_time, grind, roast_level } = req.body
    const newBrew = { name, description, method, input, output, brew_time, grind, roast_level }

    for (const [key, value] of Object.entries(newBrew)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    newBrew.user_id = req.user.id

    BrewsService.insertBrew(
      req.app.get('db'),
      newBrew
    )
      .then(brew => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${brew.id}`))
          .json(BrewsService.serializeBrews(brew))
      })
      .catch(next)
  })

brewsRouter
  .route('/:brew_id')
  .all(requireAuth)
  .all((req, res, next) => {
    BrewsService.getById(
      req.app.get('db'),
      req.params.brew_id
    )
      .then(brew => {
        if (!brew) {
          return res.status(404).json({
            error: { message: `Brew doesn't exist` }
          })
        }
        res.brew = brew
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(BrewsService.serializeBrews(res.brew))
  })
  .delete((req, res, next) => {
    BrewsService.deleteBrew(
      req.app.get('db'),
      req.params.brew_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { name, description, method, input, output, brew_time, grind, roast_level } = req.body
    const brewToUpdate = { name, description, method, input, output, brew_time, grind, roast_level }

    const numberOfValues = Object.values(brewToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain a 'name'`
        }
      })

    BrewsService.updateBrew(
      req.app.get('db'),
      req.params.brew_id,
      brewToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = brewsRouter
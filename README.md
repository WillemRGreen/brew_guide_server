

## Brewer's Guide
This is the server side code for my Brewer's Guide web application. It accomplishes several things for the purpose of the app. It has SQL scripts which create tables in the postgresQL database, and it seeds the database with dummy data. This server uses express with a service object/router model, utlizing this technology to tidily and efficiently create endpoints to call from client side. 

## Overview

This is a React App designed to help specialty coffee berewer's of all levels improve and keep track of their coffees. Once you enter in the starting specifications for your coffee, the app will automatically create the rest for you. Then it will save the brew for you to look at later, and if you decide its not to your preference you can always adjust it manually.

## Live Site
https://brew-guide-client.vercel.app/landing-page

## Schema

# User

{
    id: 
        type: integer,
        required: true,
        unique: true
    user_name: 
        type: String,
        required: true,
        unique: true
    password: 
        type: String,
        required: true,
}

# brew

{
    name:
        type: String
        required: true
    id:
        type: integer
        required: true
        unique: true
    user_id:
        type: integer
        required: true
    description:
        type: String
        required: true
    input:
        type: String
        required: true
    output:
        type: String
        required: true
    method:
        type: String
        required: true
    grind:
        type: String
        required: true
    roast_level:
        type: String
        required: true
    date_created
        type: date
        default: now()
}

## the users endpoint

# Post /api/users
//req.body
{
  user_name: String,
  password: String,
}
//res
{
  id: userId,
  user_name: String,]
  password: String,
}

## the auth endpoint

# Post /api/auth/login
//req.body
{ user_name: String, password: String }

//res.body
authToken: JWT

## the brews endpoint

# GET /api/brews
//req.user
{
  id: userId,
  user_name: String,
  password: Srting,
}

//  Authorization
{ Authorization: Bearer ${token}}

//res
[
    {
        id: brewId
        name: String
        description: String
        user_id: userId
        input:
            type: String
            required: true
        output:
            type: String
            required: true
        method:
            type: String
            required: true
        grind:
            type: String
            required: true
        roast_level:
            type: String
            required: true
        date_created
            type: date
            default: now()
}
    }
]

# POST /api/brews
//req.user
{
  id: userId,
  user_name: String,
  password: Srting,
}

//  Authorization
{ Authorization: Bearer ${token}}

//req.body
{ 
    name: String,
    description: String,
    output: String,
    roast_level: String,
    method: String
}

# GET /api/brews/:brewId

//req.user
{
  id: userId,
  user_name: String,
  password: String,
}

//  Authorization
{ Authorization: Bearer ${token}}

//req.params:
brew_id: brewId

# DELETE /api/brews/:brewId
//req.user
{
  id: userId,
  user_name: String,
  password: Srting
}

//  Authorization
{ Authorization: Bearer ${token}}

//req.params:
brew_id: brewId

//res.status
:204

# PATCH /api/brews/:brewId

//req.user
{
  id: userId,
  user_name: String,
  password: Srting,
}

//  Authorization
{ Authorization: Bearer ${token}}

//req.params:
brew_id: brewId

//res.status
:204

//req.body
{ 
    id: brewId
        name: String
        description: String
        user_id: userId
        input:
            type: String
            required: true
        output:
            type: String
            required: true
        method:
            type: String
            required: true
        grind:
            type: String
            required: true
        roast_level:
            type: String
            required: true
}

## technology stack

Node - Run-time environment
Express - Web application framework
PostgresQL - Database
JWT - Authentication
Mocha - Testing
Chai - Testing

## Author
Willem Green- Full Stack
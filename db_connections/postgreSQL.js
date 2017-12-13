'use strict'

const pgp = require("pg-promise")({})
const db = pgp("postgres://postgres:pgadmin123@localhost:5432/migration")

module.exports = db
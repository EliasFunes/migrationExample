'use strict'

var express = require('express')
var app = express()

const postgres_con = require('./db_connections/postgreSQL')
const MongoClient = require('mongodb').MongoClient 

app.get('/', function(req, res){
    res.send('get request to the homepage')
})

app.get('/country', function(req, res){
    postgres_con.any('select * from pais')
        .then(function(data){
            data.forEach(function(row, index){
                var row_data = {name:row.nombre, external_code:row.codigo}
                MongoClient.connect('mongodb://localhost:27017/productsfinder', (err, db) => {
                    if (err) throw err
                    db.collection("Country").insertOne(row_data, function(err, res){
                        if(err) throw err
                        console.log(`country ${row.nombre} inserted`)
                    })
                })
            })
        })
        .catch(function(error){
            console.log(error)
        })
})

module.exports = app
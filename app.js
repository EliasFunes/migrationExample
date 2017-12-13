'use strict'

var express = require('express')
var app = express()

const postgres_con = require('./db_connections/postgreSQL')
const MongoClient = require('mongodb').MongoClient 

//crear una coneccion
var db
MongoClient.connect('mongodb://localhost:27017/productsfinder', (err, _db) => {
    db = _db
})


app.get('/', function(req, res){
    res.send('get request to the homepage')
})

// =============================================================================
// MIGRACION UTILIZANDO ENPOINTS DISTINTOS PARA UN MEJOR CONTROL 
// DE LAS MIGRACIONES, PASO A PASO 
// =============================================================================
// migrar paises
 
app.get('/country', function(req, res){
    postgres_con.any('select * from pais')
        .then(function(data){
            data.forEach(function(row, index){
                var row_data = {name:row.nombre, external_code:row.codigo, status:'ok'}
                db.collection("Country").insertOne(row_data, function(err, res){
                    if(err) throw err
                    console.log(`country ${row.nombre} inserted`)
                })                
            })
        })
        .catch(function(error){
            console.log(error)
        })
})

// migrar region
app.get('/region', function(req, res){
    postgres_con.any('select * from region')
        .then(function(data){
            data.forEach(function(row, index){
                db.collection("Country").find({external_code:row.pais}).toArray(function(err, result){
                    if (err) throw err
                    var row_data = {name:row.nombre, country:result[0]._id, external_id:row.id, status:'ok'}
                    db.collection("Region").insertOne(row_data, function(err, res){
                        if(err) throw err
                        console.log(`region ${row.nombre} inserted`)
                    })
                })
            })
        })
        .catch(function(error){
            console.log(error)
        })// 
})

// migrar departamentos
app.get('/departament', function(req, res){
    postgres_con.any('select * from departamento')
        .then(function(data){
            data.forEach(function(row, index){
                db.collection("Region").find({external_id:row.region}).toArray(function(err, result){
                    if (err) throw err
                    var row_data = {name:row.nombre, region:result[0]._id, external_id:row.id, status:'ok'}
                    db.collection("Departament").insertOne(row_data, function(err, res){
                        if(err) throw err
                        console.log(`departament ${row.nombre} inserted`)
                    })
                })
            })
        })
        .catch(function(error){
            console.log(error)
        })
})

// migrar ciudades
app.get('/city', function(req, res){
    postgres_con.any('select * from ciudad')
        .then(function(data){
            data.forEach(function(row, index){
                db.collection("Departament").find({external_id:row.departamento}).toArray(function(err, result){
                    if (err) throw err
                    var row_data = {name:row.nombre, departament:result[0]._id, external_id:row.id, status:'ok'}
                    db.collection("City").insertOne(row_data, function(err, res){
                        if(err) throw err
                        console.log(`city ${row.nombre} inserted`)
                    })
                })
            })
        })
        .catch(function(error){
            console.log(error)
        })
})

// migrar barrio
app.get('/neighborhood', function(req, res){
    postgres_con.any('select * from barrio')
        .then(function(data){
            data.forEach(function(row, index){   
                db.collection("City").find({external_id:row.ciudad}).toArray(function(err, result){
                    if (err) throw err
                    var row_data = {name:row.nombre, city:result[0]._id, external_id:row.id, status:'ok'}    
                    db.collection("Neighborhood").insertOne(row_data, function(err, res){
                        if(err) throw err
                        console.log(`neighborhood ${row.nombre} inserted`)
                    })
                })
            })
        })
        .catch(function(error){
            console.log(error)
        })
})

module.exports = app
'use strict'

const MongoClient = require('mongodb').MongoClient
var _db

const local = 'mongodb://localhost:27017/productsfinder'

module.exports = {   
    connectToServer : function(callback) {
        MongoClient.connect(production, (err, db) => {
            if (err) throw err
            _db = db
        }) 
    },
    
    getDb : function(){
        return _db
    }
}




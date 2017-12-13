'use strict'

const MongoClient = require('mongodb').MongoClient
var _db

module.exports = {   
    connectToServer : function(callback) {
        MongoClient.connect('mongodb://localhost:27017/productsfinder', (err, db) => {
            if (err) throw err
            _db = db
        }) 
    },
    
    getDb : function(){
        return _db
    }
}




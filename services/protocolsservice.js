var moment = require('moment');
var mysql = require('../modules/mysql');
var config = require('../config');
var utils = require('../modules/utils');



exports.get = function(id, callback){
	if(!id){
		return callback(new Error('No ID given'));
	}

	var query = 'SELECT * FROM protocols WHERE id = ? LIMIT 1;';

	mysql.conn.query(query, id, function(err, rows, fields){
        if(err){
            return callback(err);
        }

        if(!rows[0]){
            return callback(null, false);
        }
        
		//make JS object from JSON
		rows[0].attendants = JSON.parse(rows[0].attendants);


        return callback(null, rows[0]);
    });
}






exports.add = function(data, callback){
	
	//allowed attributes
	var attrs = [
		'title',
		'recorder',
		'title',
		'start',
		'end',
		'attendants',
		'text',
		'comment'
	];
	
	var add = {};
	for(var key in data){
		//check whether attribute is allowed to add
		if(!attrs.indexOf(key) < 0) continue;
		
		//insert add key
		add[key] = data[key];
	}

	
	//error if there are no attributes left
	if(!Object.keys(add).length){
		return callback(new Error('No attributes to add'));
	}

	//make JSON from JS object
	add.attendants = JSON.stringify(add.attendants);


	//add new ID
	add.id = utils.uid(32);

	
	//build query
	var query = 'INSERT INTO protocols SET ?;';

	mysql.conn.query(query, add, function(err, result){
        if(err){
            return callback(err);
        }

		return callback(null, add.id);
    });
}
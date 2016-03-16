var express = require('express');
var route = express();

var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'root',
	database : 'dheeraj',
});

var users = {
		"status":1,
		"user":""
};

route.get('/users', function(req, res) {

	connection.query("select * from user1", function(err, rows, fields) {
		if (rows.length !== 0) {
			users.status = 200;
			users.user = rows;
			res.json(users);
		} else {
			users.status = 200;
			users.user = "No User found....";
			res.json(users);
		}
	});
});

route.get('/users/:id', function(req, res) {

	console.log(isNaN(req.params.id));
	if(isNaN(req.params.id)){
		users.status = 400;
		users.user = "Invalid URL request";
		res.json(users);

	}else {
		var id= parseInt(req.params.id);

		connection.query("select * from user1 where id=?",[id], function(err, rows, fields) {
			if (rows.length !== 0) {
				users.status = 200;
				users.user = rows;
				res.json(users);
			}else { 
				res.status(404);
				users.status = 404;
				users.user = "No user found with requested id....";
				res.json(users);
			}	 
		});
	}

});

route.post('/users',function(req,res){
	var Firstname = req.body.firstname;
	var Lastname = req.body.lastname;
	var Email = req.body.email;
	var id = parseInt(req.body.id);

	if(!!Firstname && !!Lastname && !!Email && !!id){

		if(typeof Firstname === 'string' && typeof Lastname === 'string' && typeof Email === 'string' && typeof id === 'number'){


			connection.query("INSERT INTO user1 VALUES(?,?,?,?)",[Firstname,Lastname,Email,id],function(err, rows, fields){
				if(!!err){  
					// console.error('There was an error',err);
					res.status(500);
					users.status = 500;
					users.user = "Internal Server Problem";

				}else{
					res.status(201);
					users.status = 201;
					users.user = "User inserted into database";
				} 
				res.json(users);	

			});
		}else{
			res.status(400);
			users.status = 400;
			users.user = "Incorrect Json Structure";
			res.json(users);
		}
	}else{
		res.status(422);
		users.status = 422;
		users.user = "Missing data in Json....";
		res.json(users);
	}


});

route.put('/users',function(req,res){ 

	var Firstname = req.body.firstname;
	var Lastname = req.body.lastname;
	var Email = req.body.email;
	var id = parseInt(req.body.id);
	connection.query("select * from user1 where id=?",[id],function (err, rows, fields) {    	
		if (rows.length == 0) {
			res.status(404);
			users.status = 404;
			users.user = "No data found...";
			res.json(users);

		}
		else{
			if(!!Firstname && !!Lastname && !!Email && !!id){    	    	
				if(typeof Firstname === 'string' && typeof Lastname === 'string' && typeof Email === 'string' && typeof id === 'number'){   	    		
					connection.query("UPDATE user1 SET ?,?,? WHERE ?",[{firstname: Firstname},{lastname: Lastname},{email: Email},{id: id}],function(err, rows, fields){
						if(err){
							res.status(500);
							users.status = 500;
							users.user = "Internal error occured...";
							res.json(users);
						}else{            	
							users.status = 200;
							users.user = "User updated into database";
							res.json(users);
						}

					});

				}else{
					res.status(400);
					users.status = 400;
					users.user = "Incorrect Json Structure";
					res.json(users);
				}
			}else{
				res.status(422);
				users.status = 422;
				users.user = "Missing data in json";
				res.json(users);
			}
		}
	});
});

route.delete('/users/:id',function(req,res){

	if(isNaN(req.params.id)){
		users.status = 400;
		users.user = "Invalid URL request";
		res.json(users);

	}else {

		var id = parseInt(req.params.id);
		connection.query("select * from user1 where id=?",[id],function (err, rows, fields) {    	
			if (rows.length == 0) {
				res.status(404);
				users.status = 404;
				users.user = "No data found...";
				res.json(users);

			}else{

				connection.query("DELETE FROM user1 WHERE id=?",[id],function(err, rows, fields){
					if(err){   
						res.status(404);
						users.status = 404;
						users.user = "No user found...";
						res.json(users);
					}else{           
						users.status = 200;
						users.user = "User deleted successfully";
						res.json(users);
					}           
				});
			}
		});
	}
});

route.all('*', function(req, res) {
	users.status = 400;
	users.user = "Invalid URL request";
	res.json(users);
});

module.exports = route;

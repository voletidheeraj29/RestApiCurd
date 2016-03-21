var express = require('express');
var route = express();

var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'root',
	database : 'pixtr',
});

var data = {
		"status":0,
		"description":null,		
		"data":null,
		"error":[{"msg":null}]	
};

//Alphabetical String Checking
function allLetter(inputtxt)  
{  
	var letters = /^[A-Za-z]+$/; 
	var mail =/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/;
	
	if(letters.test(inputtxt) || mail.test(inputtxt))  
	{  
		return true;  
	}  
	else  
	{  		
		return false;  
	}  
}  

//GET ALL USERS
route.get('/users', function(req, res) {

	connection.query("select * from user1", function(err, rows, fields) {
		if (err) {
			data.status = 500;			
			data.description="Error ocuured : " + err.code;
			data.data=null;
			data.error[0].msg=err;		
		}
		else if (rows.length !== 0) {			
			data.status = 200;			
			data.description="Returning all Users";
			data.data=rows;							
		} 
		else {
			data.status = 200;			
			data.description="No User exists into database.";
			data.data=null;
			data.error[0].msg=null;
		}
		res.json(data);
	});
});

//GET USER BY ID
route.get('/users/:id', function(req, res) {

	if(isNaN(req.params.id)){

		res.status(400);
		data.status = 400;			
		data.description="Bad Request";
		data.error[0].msg="Invalid service URI";
		res.json(data);
	}else {
		var id= parseInt(req.params.id);

		connection.query("select * from user1 where id=?",[id], function(err, rows, fields) {
			if (err) {
				res.status(500);
				data.status = 500;			
				data.description="Error ocuured : " + err.code;
				data.error[0].msg=err;							
			}
			else if (rows.length !== 0) {			
				data.status = 200;			
				data.description="Returning requested user with id = "+id;
				data.data=rows;					
				data.error[0].msg=null;
			} 
			else {
				data.status = 200;			
				data.description="No user found with requested id";	
				data.data=null;
				data.error[0].msg=null;
			}	
			res.json(data);
		});
	}

});

//INSERT USER INTO DATABASE
route.post('/users',function(req,res){

	var Firstname = req.body.firstname;
	var Lastname = req.body.lastname;
	var Email = req.body.email;
	var id=null;

	if(!!Firstname && !!Lastname && !!Email){

		if(allLetter(Firstname) && allLetter(Lastname) && allLetter(Email)){


			connection.query("INSERT INTO user1 VALUES(?,?,?,?)",[Firstname,Lastname,Email,id],function(err, rows, fields){
				if(!!err){  
					res.status(500);
					data.status = 500;			
					data.description="Error ocuured : " + err.code;
					data.data=null;					
					data.error[0].msg=err;			

				}else{
					res.status(201);
					data.status = 201;			
					data.description="User inserted into database";
					data.data=null;								
					data.error[0].msg=null;
				} 
				res.json(data);	
			});
		}else{
			res.status(200);
			data.status = 200;			
			data.description="Firstname, Lastname or email are not correct";
			data.data=null;			
			data.error[0].msg="Invalid firstname or lastname or email";
			res.json(data);
		}
	}else{
		res.status(422);
		data.status = 422;			
		data.description="Missing data in JSON";
		data.data=null;		
		data.error[0].msg="Missing a required param in Json. Please check your JSON request";
		res.json(data);	
	}


});

//UPDATE USER
route.put('/users',function(req,res){ 

	var Firstname = req.body.firstname;
	var Lastname = req.body.lastname;
	var Email = req.body.email;
	var id = parseInt(req.body.id);

	if(!!Firstname && !!Lastname && !!Email && !!id){    	    	
		if(allLetter(Firstname) && allLetter(Lastname) && allLetter(Email) && typeof id === 'number'){   	    		
			connection.query("UPDATE user1 SET ?,?,? WHERE ?",[{firstname: Firstname},{lastname: Lastname},{email: Email},{id: id}],function(err, rows, fields){
				if(err){
					res.status(500);
					data.status = 500;			
					data.description="Error ocuured : " + err.code;
					data.data=null;							
					data.error[0].msg=err;								
				}
				else if (rows.affectedRows == 0) {
					res.status(200);
					data.status = 200;			
					data.description="No user exists with id = " + id;	
					data.data=null;
					data.error[0].msg=null;
				}
				else{            	
					res.status(200);
					data.status = 200;			
					data.description="User updated into database";
					data.data=null;								
					data.error[0].msg=null;
				}
				res.json(data);
			});

		}else{
			res.status(200);
			data.status = 200;			
			data.description="Firstname, Lastname or email are not correct";
			data.data=null;			
			data.error[0].msg="Invalid firstname or lastname or email";
			res.json(data);
		}
	}else{
		res.status(422);
		data.status = 422;			
		data.description="Missing data in JSON";
		data.data=null;				
		data.error[0].msg="Missing a required param in Json. Please check your JSON request";
		res.json(data);
	}
});

//DELETE USER BY ID
route.delete('/users/:id',function(req,res){

	if(isNaN(req.params.id)){
		res.status(400);
		data.status = 400;			
		data.description="type of requested id is not a number";
		data.data=null;		
		data.error[0].msg="Bad Request";			
		res.json(data);

	}else {

		var id = parseInt(req.params.id);		
		connection.query("DELETE FROM user1 WHERE id=?",[id],function(err, rows, fields){
			if(err){   
				res.status(500);
				data.status = 500;			
				data.description="Error ocuured : " + err.code;
				data.data=null;				
				data.error[0].msg=err;
			}
			else if (rows.affectedRows == 0) {
				res.status(200);
				data.status = 200;			
				data.description="No user exists with id = " + id;	
				data.data=null;
				data.error[0].msg=null;
			}
			else{           
				data.status = 200;			
				data.description="User deleted with id = "+id;	
				data.data=null;
				data.error[0].msg=null;
			}        
			res.json(data);
		});			
	}	
});

//INVALID URI REQUEST
route.all('*', function(req, res) {
	res.status(400);
	data.status = 400;			
	data.description="Bad Request";
	data.data=null;	
	data.error[0].msg="Invalid service URI";
	res.json(data);
});

module.exports = route;

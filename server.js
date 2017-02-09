var express = require('express');
var app = express();


app.use('/', express.static(__dirname+'/'));

var server = app.listen(8081,function(){
	console.log(__dirname);
	console.log("Connected & Listen to port 8081");
});
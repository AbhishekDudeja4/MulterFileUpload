var express = require('express');
var app = express();
var path = require('path');
var ejs = require('ejs');
var multer = require('multer');

var storage = multer.diskStorage({
	destination:'./public',
	filename: function(req, file, callback){
		callback( null,file.fieldname + '-' + Date.now() + path.extname(file.originalname) );
	}
});


var upload = multer({
	storage: storage,
	limits: {fileSize: 1000000}, //in bytes
	fileFilter: function(req, file, callback){
		checkFileType(file,callback);
	}
}).single('myImage');


function checkFileType(file,callback){
	var filetypes = /jpeg|jpg|png|gif/;
	var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	var mimetype = filetypes.test(file.mimetype);  //attribute obtained in info

	if(mimetype && extname){            // if they are mentioned in above var
		return callback(null,true);
	}
	else{
		callback('Error: Wrong Format!');
	}
};

app.set('view engine','ejs');

app.get('/',function(req,res){
	res.render('index');
});

app.listen(3000, function(){
	console.log("server running");
});

app.use(express.static('./public'));

app.post('/upload',function(req,res){
	upload(req,res, function(err){
		
		if(err){
			res.render('index',{        //pass an object to index (ejs) and then display it
				msg:err
			});
		}
		else{

			if(req.file == undefined){
				res.render('index',{        //pass an object to index (ejs) and then display it
				msg: 'No Selected File'
			  });
			}

			else{
			console.log(req.file);
			res.render('index',{
				msg:'File Uploaded',
				file: `uploads/${req.file.filename}`
			});
		 }

		}
	});
});

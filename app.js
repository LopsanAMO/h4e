var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var store = require('./routes/store');
var app = express();
var mysql = require('mysql');
var session = require('express-session');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'ssshhhhh'}));
var aidis = [];
function databaseInstance(){
  var connection = mysql.createConnection({
    host     : 'localhost',
    password : 'n0m3l0',
    user     : 'root',
    database : 'hack4edb'
  });
  return connection;
}
var insert = function(req,res){
  var Establecimiento = [];

  var request = require('request');
  var fbResponse;
  var hey;
  var database = new databaseInstance();
  var cosa = req.body.cosa;
  var lugar = req.body.lugar;
  var suma = "+";
  var real = cosa+suma+lugar; 
  var ur_1 = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=";
  var ur_2 = "&key=AIzaSyDkNr-v2Ricwr_U6vOJeFWLBreZLnKzM_A";

  var url = ur_1+real+ur_2;
  console.log(url);
   request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      fbResponse = JSON.parse(body);
      for (i = 0; i < fbResponse.results.length; i++) {  
        for (j = 0; j < fbResponse.results[i].name.length; j++) {
          if(fbResponse.results[i].name[j]=="'"){
            console.log("hola");

            //no vales verga lopsan
            fbResponse.results[i].name= fbResponse.results[i].name.replace("'","");
          }
        }
        //console.log("Got a response: ", fbResponse.results[i].name);
        if (aidis.length==0) {
          aidis.push(fbResponse.results[i].id);
        };
        console.log(aidis.length);
        for (j = 0; j < aidis.length; j++) {
          if (aidis[i]==fbResponse.results[j].id) {
            console.log("ESTAS MANDANDO ALGO REPETIDO");
          }
          else{
            aidis.push(fbResponse.results[i].id);
          }
        }
        Establecimiento.push({name: fbResponse.results[i].name,id: fbResponse.results[i].id,lng:fbResponse.results[i].geometry.location.lng,lat: fbResponse.results[i].geometry.location.lat,vicinity: fbResponse.results[i].formatted_address});
      
      console.log(Establecimiento[0].Name);
      //console.log("Got a response: ", fbResponse.results);
      hey = fbResponse.results[0].id;
      console.log(fbResponse.results.length);
      var database = new databaseInstance();
      for (i = 0; i < Establecimiento.length; i++) {

        };
        var queries = 'insert into establecimiento values('+"'" + Establecimiento[i].id + "'" + ',' + "'" + Establecimiento[i].name + "'" + ',' + "'" + Establecimiento[i].lng + "'" +','+ "'" +Establecimiento[i].lat+ "'" +','+ "'" +Establecimiento[i].vicinity+ "'" +');';
        //console.log(queries);
        //console.log(Establecimiento[i].name);
        database.query(queries);
      };
    }
    else {
      console.log("Got an error: ", error, ", status code: ", response.statusCode);
    }
    });
}
var mete = function(req, res){
    
    var database = new databaseInstance();
  var queri = 'select * from establecimiento;';
  database.query(queri,function(error,result,row){
    if(!error){
              if(true){
                req.session.datos=result;
                console.log("hey"+ result[0].name);
                res.redirect('/cosas');
              }
              else{
                
                res.redirect('/equis');
              }
            }
            else{
              res.redirect('/error');
            }
  });
  
}
var hacer = function(req,res){
 var id = req.body.id;
 var database = new databaseInstance();
 var frase = 'La dvd es muy mala como establecimiento para la recreacion familiar, y no tiene rampita para los discapacitados';
 var usuarito = 'Juanito el que te ama';
 var id = '00c3d9a2cb2c7e3b4de73189eca4e3961bef9031';
 var doit = 'insert into establecimiento values('+"'" + frase + "'" + ',' + "'" + usuarito + "'" + ',' + "'" + id+ "'" +');';
  console.log(doit);
  database.query(doit)
  var queri = 'select * from valoraciones where id = = "'+ id +'";';
  database.query(queri,function(error,result,row){
    if(!error){
              if(true){
                req.session.datos=result;
                res.redirect('/local');
              }
              else{
                
                res.redirect('/equis');
              }
            }
            else{
              res.redirect('/error');
            }
  });
}
// view engine setup

app.get('/', store.index);
app.get('/index', store.index);
app.get('/mapa', store.mapa);
app.get('/cosas', store.cosas);
app.get('/equis', store.equis);
app.get('/local', store.local);
app.post('/mete', mete);
app.post('/insert', insert); 
app.post('/hacer', hacer); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

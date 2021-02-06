const express = require("express");
const app = express();
const bodyParser = require('body-parser');

var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/bewglePractical';
mongoose.connect(mongoDB,{ useUnifiedTopology : true , useNewUrlParser : true});
var db = mongoose.connection;

var requestJsonData = require('./model/requestJsonData');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));

app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('App listening on port '+ port));

app.all('/process',async function(req, res, err){
  let duration = randomDuration(15,30);
  let reqjson = {
    date : new Date().toISOString(),
    method : req.method,
    headers : req.headers,
    path : req.route.path,
    query : req.query,
    body : req.body,
    duration : duration
  }
  const resdata = await requestJsonData.create(reqjson);
  setTimeout(()=>{
    res.json({});
  },duration*1000);

  // console.log("process Date",new Date().toISOString());
  // console.log("process method",req.method);
  // console.log("process headers",req.headers);
  // console.log("process path",req.route.path);
  // console.log("process query",req.query);
  // console.log("process body",req.body);
  // console.log("process duration",duration);

});

app.get('/stats',async function(req, res, err){
  const resdata = await requestJsonData.aggregate([
    { "$match" : { date : { $gte : new Date(req.query.fromdate) , $lte : new Date(req.query.todate)}}},
    {  "$group" : { _id:"$method", count:{$sum:1} , Avg :  { $avg : "$duration"} } }
  ]);
  console.log(resdata);
  res.json(resdata);
});

function randomDuration(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

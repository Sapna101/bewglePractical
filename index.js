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
});

app.get('/stats',async function(req, res, err){
  try{
    const resdata = await requestJsonData.aggregate([
      { "$match" : { date : { $gte : new Date(req.query.fromdate) , $lte : new Date(req.query.todate)}}},
      {  "$group" : { _id:"$method", count:{$sum:1} , Avg :  { $avg : "$duration"} } }
    ]);
    console.log(resdata);
    res.json(resdata);
  } catch(err){
    console.log(err);
  }
});

function randomDuration(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

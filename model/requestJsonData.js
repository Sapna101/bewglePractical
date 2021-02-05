let mongoose = require('mongoose');
const Schema = mongoose.Schema;

let requestJsonDataSchema = new Schema({
  date : {type : Date, default: Date.now},
  method : {type : String},
  headers : {type : Schema.Types.Mixed },
  path : {type : String},
  query : {type : Schema.Types.Mixed},
  body : {type : Schema.Types.Mixed},
  duration : {type : Number}
});

module.exports = mongoose.model('requestJsonDatas',requestJsonDataSchema)

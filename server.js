//modules used
const express = require('express');
var cors = require('cors');
const app = express();
const mongoose = require('mongoose');
app.use(cors())

//mongodb connection
mongoose.connect('mongodb://127.0.0.1:27017/oRc',{useNewUrlParser: true,useCreateIndex: true,useUnifiedTopology: true});

//data schema
const dataModel = mongoose.model('datas',{
        id: {
                type: String
        },
        name: {
                type: String
        },
        msg: {
                type: String
        }
});

//used to create or update store details
async function updateStore(uid,name,message){
  try{
    var returnOutput = {};
    var countData = await dataModel.countDocuments({id:uid,name:name}).exec();
    if(countData <= 0){
      await dataModel.create({id:uid,name:name,msg:message});
      returnOutput.response = "created";
      return returnOutput;
    }
    else{
      await dataModel.updateOne({id:uid,name:name},{"msg":message});
      returnOutput.response = "updated";
      return returnOutput;
    }
  }
  catch(e){
    returnOutput.response = "error";
    return returnOutput;
  }
}

//used to get store status
async function getStore(uid,name){
  try{
    var returnOutput = {};
    const data = await dataModel.findOne({id:uid,name:name},{_id:0,name:0,id:0,__v:0});
    returnOutput.response = data["msg"];
    return returnOutput;
  }
  catch(e){
    returnOutput.response = "error";
    return returnOutput;
  }
}

//used to delete status
async function cutStore(uid,name){
  try{
    var returnOutput = {};
    await dataModel.deleteOne({id:uid,name:name});
    returnOutput.response = "deleted";
    return returnOutput;
  }
  catch(e){
    returnOutput.response = "error";
    return returnOutput;
  }
}

//rest api
app.get('/cutStore',async (req,res) => {
  const uid = req.query.uid;
  const name = req.query.name;
  cutStore(uid,name).then(x => res.json(x));
})

app.get('/getStore',async (req,res) => {
  const uid = req.query.uid;
  const name = req.query.name;
  getStore(uid,name).then(x => res.json(x));
})

app.get('/updateStore',async (req,res) => {
  const uid = req.query.uid;
  const name = req.query.name;
  const msg = req.query.msg;
  updateStore(uid,name,msg).then(x => res.json(x));
})

//listening on port 80
app.listen(80)

const mongoose = require("mongoose");
//schema defines the structure (field,type,rules) of documents inside a MongoDB collection.
const Schema = mongoose.Schema;
const PostSchema = new Schema({
  title: {
    type: String,
    //cannot insert a document without title
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

//model is a constructor function created from schema.It represents a MongoDB collection and give you the methods to create,read,update and delete documents inside that collection.
module.exports = mongoose.model("POST", PostSchema);

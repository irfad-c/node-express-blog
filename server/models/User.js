const mongoose = require("mongoose");
//schema defines the structure (field,type,rules) of documents inside a MongoDB collection.
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//model is a constructor function created from schema.It represents a MongoDB collection and give you the methods to create,read,update and delete documents inside that collection.
module.exports = mongoose.model("User", UserSchema);

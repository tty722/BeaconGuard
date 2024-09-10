//导入mongoose
const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  salt: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
    require: true,
  },
  birthday: {
    type: Date,
  },
  personalityTag: {
    type: String,
  },
  messageId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "AlphaIDS",
  }],
});

let Users = mongoose.model("Users", UserSchema);
//todo 对外暴露
module.exports = Users;
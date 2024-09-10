const mongoose = require("mongoose");

let HistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users", //关联的用户ID
  },
  restoreType: {
    type: String,
    required: true,
    enum: ["online", "offline"],
  },
  restoreId: {
    type: mongoose.Schema.Types.ObjectId, // todo 不添加ref，根据restoreType动态查询相应的模型
    required: true,
  },
  time: {
    type: Date,
    required: true, // 必填字段
  },
});

let History = mongoose.model("History", HistorySchema);
//todo 对外暴露
module.exports = History;

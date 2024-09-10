const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

let gfs;

module.exports = function (success, error) {
  const { DBHOST, DBPORT, DBNAME } = require("../config/config");

  // 设置 strictQuery 为 true
  mongoose.set("strictQuery", true);

  // 创建数据库连接
  mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);

  const conn = mongoose.connection;

  conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("restoredFiles"); // 设置 GridFS 集合名称
    success(); // 在成功回调中通知连接成功
  });

  conn.on("error", (err) => {
    error(err);
  });

  conn.on("close", () => {
    console.log("链接关闭");
  });
};

module.exports.getGFS = () => gfs;

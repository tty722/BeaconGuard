const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { verifyTokenMiddleware } = require("../../middlewares/auth.js");



router.get(
  "/api/offline/restore/ftp/protocol",
  verifyTokenMiddleware,
  (req, res) => {
    const filePath = path.join(__dirname, "../../mock/protocol.json");

    // 读取 protocol.json 文件内容
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("读取 protocol.json 文件时出错:", err);
        return res.status(500).json({
          code: 10016,
          message: "内部服务器错误",
        });
      }

      try {
        const parsedData = JSON.parse(data).data; // 解析 JSON 数据并提取 data 数组
        const ftpData = parsedData.filter((item) => item.protocol === "FTP"); // 过滤出 protocol 为 FTP 的数据

        return res.status(200).json({
          code: 200,
          json: ftpData,
        });
      } catch (parseError) {
        console.error("解析 protocol.json 数据时出错:", parseError);
        res.status(500).json({
          code: 10016,
          message: "内部服务器错误",
        });
      }
    });
  }
);

router.get("/api/offline/restore/ftp", verifyTokenMiddleware, (req, res) => {
  const filePath = path.join(__dirname, "../../mock/restore.json");

  // 读取 restore.json 文件内容
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("读取 restore.json 文件时出错:", err);
      return res.status(500).json({
        code: 10016,
        message: "内部服务器错误",
      });
    }

    try {
      const parsedData = JSON.parse(data); // 解析 JSON 数据

      return res.status(200).json({
        code: 200,
        json: parsedData.FTP,
      });
    } catch (parseError) {
      console.error("解析 restore.json 数据时出错:", parseError);
      res.status(500).json({
        code: 10016,
        message: "内部服务器错误",
      });
    }
  });
});

module.exports = router;

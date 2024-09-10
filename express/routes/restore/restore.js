const express = require("express");
const fs = require("fs");
const path = require("path");
const { verifyTokenMiddleware } = require("../../middlewares/auth");
const router = express.Router();

//restore中的数据
router.get("/api/offline/restore", async (req, res) => {
  const filePath = path.join(__dirname, "../../mock/restore.json");

  // 读取 restore.json 文件内容
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("读取 restore.json 文件时出错:", err);
      return res.status(500).json({
        code: 10002,
        error: "内部服务器错误",
      });
    }

    try {
      const parsedData = JSON.parse(data); // 解析 JSON 数据并提取 data 数组

      // 发送响应数据
      res.status(200).json({
        code: 200,
        startTime: parsedData.startTime,
        processedResults: parsedData.processedResults,
        statistics: parsedData.statistics,
        uploadedFile: {
          fileId: "1",
          filename: "ftp",
          contentType: "pcap",
          length: 4941545,
        },
        restoredFiles: [
          {
            fileId: "1",
            filename: "1",
            contentType: "html",
            length: 367,
          },
          {
            fileId: "2",
            filename: "2",
            contentType: "html",
            length: 334,
          },
          {
            fileId: "3",
            filename: "3",
            contentType: "js",
            length: 153,
          },
          {
            fileId: "4",
            filename: "4",
            contentType: "gif",
            length: 289082,
          },
          {
            fileId: "5",
            filename: "5",
            contentType: "gif",
            length: 682943,
          },
          {
            fileId: "6",
            filename: "6",
            contentType: "png",
            length: 110138,
          },
          {
            fileId: "7",
            filename: "7",
            contentType: "png",
            length: 862783,
          },
          {
            fileId: "8",
            filename: "8",
            contentType: "png",
            length: 623891,
          },
         
        ],
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

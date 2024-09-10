const express = require("express");
const fs = require("fs");
const path = require("path");
const {
  verifyTokenMiddleware
} = require("../../../../middlewares/auth");
const router = express.Router();
const geoip = require("geoip-lite");

router.get(
  "/api/offline/overview/flow/circle1",
  verifyTokenMiddleware,
  (req, res) => {
    const filePath = path.join(__dirname, "../../../../mock/protocol.json");

    // 读取 protocol.json 文件内容
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("读取 protocol.json 文件时出错:", err);
        return res.status(500).json({
          error: "内部服务器错误"
        });
      }

      try {
        const parsedData = JSON.parse(data).data; // 解析 JSON 数据并提取 data 数组


        const sourceIPCount = {};

        // 统计每个 sourceIP 出现的次数
        parsedData.forEach((item) => {
          const sourceIP = item.sourceIP;
          if (sourceIPCount[sourceIP]) {
            sourceIPCount[sourceIP]++;
          } else {
            sourceIPCount[sourceIP] = 1;
          }
        });

        // 转换为数组并按出现次数降序排序
        const sortedSourceIPs = Object.entries(sourceIPCount).sort(
          (a, b) => b[1] - a[1]
        );

        // 获取出现次数最多的前四个 sourceIP，并计算剩余的数量
        const top4 = sortedSourceIPs.slice(0, 4);
        const top4Count = top4.reduce((sum, [, count]) => sum + count, 0);
        const remainingCount = parsedData.length - top4Count;

        // 准备响应数据
        const responseData = {
          top4: top4.map(([sourceIP, count]) => ({
            sourceIP,
            count
          })),
          remaining: remainingCount,
        };

        // 发送响应数据
        res.status(200).json({
          code: 200,
          responseData,
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

router.get(
  "/api/offline/overview/flow/circle2",
  verifyTokenMiddleware,
  (req, res) => {
    const filePath = path.join(__dirname, "../../../../mock/protocol.json");

    // 读取 protocol.json 文件内容
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("读取 protocol.json 文件时出错:", err);
        return res.status(500).json({
          error: "内部服务器错误"
        });
      }

      try {
        const parsedData = JSON.parse(data).data; // 解析 JSON 数据并提取 data 数组
        const destIPCount = {};

        // 统计每个 destIP 出现的次数
        parsedData.forEach((item) => {
          const destIP = item.destinationIP;
          if (destIPCount[destIP]) {
            destIPCount[destIP]++;
          } else {
            destIPCount[destIP] = 1;
          }
        });

        // 转换为数组并按出现次数降序排序
        const sorteddestIPs = Object.entries(destIPCount).sort(
          (a, b) => b[1] - a[1]
        );

        // 获取出现次数最多的前四个 sourceIP，并计算剩余的数量
        const top4 = sorteddestIPs.slice(0, 4);
        const top4Count = top4.reduce((sum, [, count]) => sum + count, 0);
        const remainingCount = parsedData.length - top4Count;

        // 准备响应数据
        const responseData = {
          top4: top4.map(([destIP, count]) => ({
            destIP,
            count
          })),
          remaining: remainingCount,
        };

        // 发送响应数据
        res.status(200).json({
          code: 200,
          responseData,
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

router.get(
  "/api/offline/overview/flow/circle3",
  verifyTokenMiddleware,
  (req, res) => {
    const filePath = path.join(__dirname, "../../../../mock/protocol.json");

    // 读取 protocol.json 文件内容
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("读取 protocol.json 文件时出错:", err);
        return res.status(500).json({
          error: "内部服务器错误"
        });
      }

      try {
        const parsedData = JSON.parse(data).data; // 解析 JSON 数据并提取 data 数组
        const sourcePortCount = {};

        // 统计每个 sourcePort 出现的次数
        parsedData.forEach((item) => {
          const sourcePort = item.sourcePort;
          if (sourcePortCount[sourcePort]) {
            sourcePortCount[sourcePort]++;
          } else {
            sourcePortCount[sourcePort] = 1;
          }
        });

        // 转换为数组并按出现次数降序排序
        const sortedSourcePorts = Object.entries(sourcePortCount).sort(
          (a, b) => b[1] - a[1]
        );

        // 获取出现次数最多的前四个 sourceIP，并计算剩余的数量
        const top4 = sortedSourcePorts.slice(0, 4);
        const top4Count = top4.reduce((sum, [, count]) => sum + count, 0);
        const remainingCount = parsedData.length - top4Count;

        // 准备响应数据
        const responseData = {
          top4: top4.map(([sourcePort, count]) => ({
            sourcePort,
            count
          })),
          remaining: remainingCount,
        };

        // 发送响应数据
        res.status(200).json({
          code: 200,
          responseData,
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

router.get(
  "/api/offline/overview/flow/circle4",
  verifyTokenMiddleware,
  (req, res) => {
    const filePath = path.join(__dirname, "../../../../mock/protocol.json");

    // 读取 protocol.json 文件内容
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("读取 protocol.json 文件时出错:", err);
        return res.status(500).json({
          error: "内部服务器错误"
        });
      }

      try {
        const parsedData = JSON.parse(data).data; // 解析 JSON 数据并提取 data 数组
        const destPortCount = {};

        // 统计每个 destPort 出现的次数
        parsedData.forEach((item) => {
          const destPort = item.destinationPort;
          if (destPortCount[destPort]) {
            destPortCount[destPort]++;
          } else {
            destPortCount[destPort] = 1;
          }
        });

        // 转换为数组并按出现次数降序排序
        const sorteddestPorts = Object.entries(destPortCount).sort(
          (a, b) => b[1] - a[1]
        );

        // 获取出现次数最多的前四个 destPort，并计算剩余的数量
        const top4 = sorteddestPorts.slice(0, 4);
        const top4Count = top4.reduce((sum, [, count]) => sum + count, 0);
        const remainingCount = parsedData.length - top4Count;

        // 准备响应数据
        const responseData = {
          top4: top4.map(([destPort, count]) => ({
            destPort,
            count
          })),
          remaining: remainingCount,
        };

        // 发送响应数据
        res.status(200).json({
          code: 200,
          responseData,
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

router.get(
  "/api/offline/overview/flow/time",
  verifyTokenMiddleware,
  (req, res) => {
    const filePath = path.join(__dirname, "../../../../mock/protocol.json");

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

        return res.status(200).json({
          code: 200,
          json: parsedData,
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

router.get(
  "/api/offline/overview/map/coordinates",
  verifyTokenMiddleware,
  (req, res) => {
    const filePath = path.join(__dirname, "../../../../mock/protocol.json");

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
        const jsonData = JSON.parse(data);

        // 处理 jsonData 数据
        const jsonDataWithCoords = jsonData.data.map((entry) => {
          const sourceGeo = geoip.lookup(entry.sourceIP);
          const destinationGeo = geoip.lookup(entry.destinationIP);

          return {
            ...entry,
            sourceLatitude: sourceGeo ? sourceGeo.ll[0] : null,
            sourceLongitude: sourceGeo ? sourceGeo.ll[1] : null,
            sourceCity: sourceGeo ? sourceGeo.city : null,
            destinationLatitude: destinationGeo ? destinationGeo.ll[0] : null,
            destinationLongitude: destinationGeo ? destinationGeo.ll[1] : null,
            destinationCity: destinationGeo ? destinationGeo.city : null,
          };
        });

        // 合并结果并返回
        return res.status(200).json({
          code: 200,
          json: jsonDataWithCoords,
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

module.exports = router;
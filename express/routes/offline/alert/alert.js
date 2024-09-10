const express = require("express");
const fs = require("fs");
const path = require("path");
const {
    verifyTokenMiddleware
} = require("../../../middlewares/auth");
const router = express.Router();
const geoip = require("geoip-lite");

router.get("/api/offline/alert/circle1", verifyTokenMiddleware, (req, res) => {
    const filePath = path.join(__dirname, "../../../mock/attack.json");

    // 读取 attack.json 文件内容
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("读取 attack.json 文件时出错:", err);
            return res.status(500).json({
                error: "内部服务器错误"
            });
        }

        try {
            const parsedData = JSON.parse(data).data; // 解析 JSON 数据并提取 data 数组

            const sourceIPCount = {};

            // 统计每个 sourceIP 出现的次数
            parsedData.forEach((item) => {
                if (item.label !== "Benign") { // 只计算 label 不是 Benign 的数据
                    const sourceIP = item.sourceIP;
                    if (sourceIPCount[sourceIP]) {
                        sourceIPCount[sourceIP]++;
                    } else {
                        sourceIPCount[sourceIP] = 1;
                    }
                }
            });

            // 转换为数组并按出现次数降序排序
            const sortedSourceIPs = Object.entries(sourceIPCount).sort(
                (a, b) => b[1] - a[1]
            );

            // 获取出现次数最多的前四个 sourceIP，并计算剩余的数量
            const top4 = sortedSourceIPs.slice(0, 4);
            const top4Count = top4.reduce((sum, [, count]) => sum + count, 0);
            const remainingCount = Object.values(sourceIPCount).reduce((sum, count) => sum + count, 0) - top4Count;

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
            console.error("解析 attack.json 数据时出错:", parseError);
            res.status(500).json({
                code: 10016,
                message: "内部服务器错误",
            });
        }
    });
});

router.get("/api/offline/alert/circle2", verifyTokenMiddleware, (req, res) => {
    const filePath = path.join(__dirname, "../../../mock/attack.json");

    // 读取 attack.json 文件内容
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("读取 attack.json 文件时出错:", err);
            return res.status(500).json({
                error: "内部服务器错误"
            });
        }

        try {
            const parsedData = JSON.parse(data).data; // 解析 JSON 数据并提取 data 数组
            const destIPCount = {};

            // 统计每个 destIP 出现的次数
            parsedData.forEach((item) => {
                if (item.label !== "Benign") { // 只计算 label 不是 Benign 的数据
                    const destIP = item.destinationIP;
                    if (destIPCount[destIP]) {
                        destIPCount[destIP]++;
                    } else {
                        destIPCount[destIP] = 1;
                    }
                }
            });

            // 转换为数组并按出现次数降序排序
            const sortedDestIPs = Object.entries(destIPCount).sort(
                (a, b) => b[1] - a[1]
            );

            // 获取出现次数最多的前四个 destIP，并计算剩余的数量
            const top4 = sortedDestIPs.slice(0, 4);
            const top4Count = top4.reduce((sum, [, count]) => sum + count, 0);
            const remainingCount = Object.values(destIPCount).reduce((sum, count) => sum + count, 0) - top4Count;

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
});

router.get("/api/offline/alert/circle3", verifyTokenMiddleware, (req, res) => {
    const filePath = path.join(__dirname, "../../../mock/attack.json");

    // 读取 attack.json 文件内容
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("读取 attack.json 文件时出错:", err);
            return res.status(500).json({
                error: "内部服务器错误"
            });
        }

        try {
            const parsedData = JSON.parse(data).data; // 解析 JSON 数据并提取 data 数组
            const sourcePortCount = {};

            // 统计每个 sourcePort 出现的次数，过滤掉 label 为 Benign 的数据
            parsedData.forEach((item) => {
                if (item.label !== "Benign") {
                    const sourcePort = item.sourcePort;
                    if (sourcePortCount[sourcePort]) {
                        sourcePortCount[sourcePort]++;
                    } else {
                        sourcePortCount[sourcePort] = 1;
                    }
                }
            });

            // 转换为数组并按出现次数降序排序
            const sortedSourcePorts = Object.entries(sourcePortCount).sort(
                (a, b) => b[1] - a[1]
            );

            // 获取出现次数最多的前四个 sourcePort，并计算剩余的数量
            const top4 = sortedSourcePorts.slice(0, 4);
            const top4Count = top4.reduce((sum, [, count]) => sum + count, 0);
            const remainingCount = Object.values(sourcePortCount).reduce((sum, count) => sum + count, 0) - top4Count;

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
});


router.get("/api/offline/alert/circle4", verifyTokenMiddleware, (req, res) => {
    const filePath = path.join(__dirname, "../../../mock/attack.json");

    // 读取 attack.json 文件内容
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("读取 attack.json 文件时出错:", err);
            return res.status(500).json({
                error: "内部服务器错误"
            });
        }

        try {
            const parsedData = JSON.parse(data).data; // 解析 JSON 数据并提取 data 数组
            const destPortCount = {};

            // 统计每个 destPort 出现的次数，过滤掉 label 为 Benign 的数据
            parsedData.forEach((item) => {
                if (item.label !== "Benign") {
                    const destPort = item.destinationPort;
                    if (destPortCount[destPort]) {
                        destPortCount[destPort]++;
                    } else {
                        destPortCount[destPort] = 1;
                    }
                }
            });

            // 转换为数组并按出现次数降序排序
            const sortedDestPorts = Object.entries(destPortCount).sort(
                (a, b) => b[1] - a[1]
            );

            // 获取出现次数最多的前四个 destPort，并计算剩余的数量
            const top4 = sortedDestPorts.slice(0, 4);
            const top4Count = top4.reduce((sum, [, count]) => sum + count, 0);
            const remainingCount = Object.values(destPortCount).reduce((sum, count) => sum + count, 0) - top4Count;

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
});

router.get("/api/offline/alert/time", verifyTokenMiddleware,
    (req, res) => {
        const filePath = path.join(__dirname, "../../../mock/attack.json");

        // 读取 attack.json 文件内容
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                console.error("读取 attack.json 文件时出错:", err);
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

router.get("/api/offline/alert/attack", verifyTokenMiddleware,
    (req, res) => {
        const filePath = path.join(__dirname, "../../../mock/attack.json");

        // 读取 attack.json 文件内容
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                console.error("读取 attack.json 文件时出错:", err);
                return res.status(500).json({
                    code: 10016,
                    message: "内部服务器错误",
                });
            }

            try {
                const parsedData = JSON.parse(data).data; // 解析 JSON 数据并提取 data 数组

                // 过滤出 label 不是 Benign 的数据
                const filteredData = parsedData.filter(item => item.label !== "Benign");

                // 发送响应数据
                res.status(200).json({
                    code: 200,
                    data: filteredData,
                });
            } catch (parseError) {
                console.error("解析 attack.json 数据时出错:", parseError);
                res.status(500).json({
                    code: 10016,
                    message: "内部服务器错误",
                });
            }
        });
    }
);

router.get("/api/offline/alert/coordinates", verifyTokenMiddleware,
    (req, res) => {
        const filePath = path.join(__dirname, "../../../mock/map.json");

        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                console.error("读取 attack.json 文件时出错:", err);
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
                console.error("解析 attack.json 数据时出错:", parseError);
                res.status(500).json({
                    code: 10016,
                    message: "内部服务器错误",
                });
            }
        });
    }
);

module.exports = router;
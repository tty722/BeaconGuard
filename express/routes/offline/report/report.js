const express = require("express");
const fs = require("fs");
const path = require("path");
const {
    verifyTokenMiddleware
} = require("../../../middlewares/auth");
const router = express.Router();
const geoip = require("geoip-lite");
const axios = require('axios');

router.post("/api/offline/report", verifyTokenMiddleware, async (req, res) => {
    const {
        destinationIP,
        sourceIP,
        destinationPort,
        time,
        total_time,
        label,
    } = req.body;

    try {
        // 构建要发送到 Python Flask 的请求体

        const sourceCity = geoip.lookup(sourceIP)

        const requestBody = {
            destinationIP: destinationIP,
            source: {
                sourceIP: sourceIP,
                sourceCity: sourceCity
            },
            destinationPort: destinationPort,
            time: time,
            total_time: total_time,
            label: label
        };

        // // 要写入的字符串内容
        // const data = '## ok你好**我是**谁';
        // const filePath = path.join(__dirname, "../../../generated_reports/report_1723976601405.md");

        // // 写入字符串到 markdown 文件
        // fs.readFile(filePath, "utf8", (err, data) => {
        //     if (err) {
        //         res.status(200).json({
        //             code: 200,
        //             data: data,
        //             message: '2323'
        //         });
        //         console.error('Error writing to file', err);
        //     } else {
        //         console.log('Markdown content written to output.md');
        //         res.status(200).json({
        //             code: 200,
        //             data: data,
        //             message: '2323'
        //         });
        //     }
        // });




        // 向 Python Flask API 发送请求
        const response = await axios.post('http://127.0.0.1:5000/generate_report', requestBody);

        // 获取从 Flask API 接收到的报告内容
        const report = response.data.report;

        // 将报告内容写入 .md 文件
        const filePath = `C:/Users/30883/Desktop/generated_reports/report_${Date.now()}.md`;
        fs.writeFile(filePath, report, (err) => {
            if (err) {
                console.error('Error writing report to file:', err);
                return res.status(500).json({
                    message: 'Failed to save report as file',
                    error: err.message
                });
            }
            console.log('Report saved to file:', filePath);
            // 返回报告和文件路径
            res.status(200).json({
                code: 200,
                data: report,
                message: filePath
            });
        });

    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({
            code: 500,
            message: 'Failed to generate report',
            error: error.message
        });
    }
});


router.post("/api/offline/suggest", verifyTokenMiddleware, async (req, res) => {
    const {
        destinationIP,
        sourceIP,
        destinationPort,
        time,
        total_time,
        label,
    } = req.body;

    try {
        // 构建要发送到 Python Flask 的请求体


        const requestBody = {
            destinationIP: destinationIP,
            sourceIP: sourceIP,
            destinationPort: destinationPort,
            time: time,
            total_time: total_time,
            label: label
        };

        // // 要写入的字符串内容
        // const data = '## ok你好**我是**谁';
        // const filePath = path.join(__dirname, "../../../generated_reports/report_1723976601405.md");

        // // 写入字符串到 markdown 文件
        // fs.readFile(filePath, "utf8", (err, data) => {
        //     if (err) {
        //         res.status(200).json({
        //             code: 200,
        //             data: data,
        //             message: '2323'
        //         });
        //         console.error('Error writing to file', err);
        //     } else {
        //         console.log('Markdown content written to output.md');
        //         res.status(200).json({
        //             code: 200,
        //             data: data,
        //             message: '2323'
        //         });
        //     }
        // });




        // 向 Python Flask API 发送请求
        const response = await axios.post('http://127.0.0.1:5000/generate_suggest', requestBody);

        // 获取从 Flask API 接收到的报告内容
        const suggest = response.data.suggest;

        // 将报告内容写入 .md 文件
        const filePath = `C:/Users/30883/Desktop/generated_suggests/suggest_${Date.now()}.md`;
        fs.writeFile(filePath, suggest, (err) => {
            if (err) {
                console.error('Error writing suggest to file:', err);
                return res.status(500).json({
                    message: 'Failed to save suggest as file',
                    error: err.message
                });
            }
            console.log('suggest saved to file:', filePath);
            // 返回报告和文件路径
            res.status(200).json({
                code: 200,
                data: suggest,
                message: filePath
            });
        });

    } catch (error) {
        console.error('Error generating suggest:', error);
        res.status(500).json({
            code: 500,
            message: 'Failed to generate suggest',
            error: error.message
        });
    }
});

module.exports = router;
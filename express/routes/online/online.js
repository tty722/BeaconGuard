const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const { verifyTokenMiddleware } = require("../../middlewares/auth");

let pythonProcess; // 全局变量用于存储Python进程引用

router.get("/api/onlineSniff", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  pythonProcess = spawn("python", [__dirname + "/main.py"]);

  pythonProcess.stdout.on("data", (data) => {
    const lines = data
      .toString()
      .split("\n")
      .filter((line) => line.trim());
    lines.forEach((line) => {
      try {
        const jsonData = JSON.parse(line);
        res.write(`data: ${JSON.stringify(jsonData)}\n\n`);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
      }
    });
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data.toString()}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
    res.write(`event: end\n`);
    res.write(`data: {"message": "Process exited with code ${code}"}\n\n`);
    res.end();
  });

  req.on("close", () => {
    if (pythonProcess) {
      pythonProcess.kill();
    }
  });
});

// 停止Python脚本的接口
router.get("/api/stopSniff", (req, res) => {
  if (pythonProcess) {
    pythonProcess.kill("SIGINT"); // 发送SIGINT信号以停止Python进程
    pythonProcess = null;
    res.status(200).json({
      code: 200,
      data: {
        message: "Sniffing stopped",
      },
    });
  } else {
    res.status(400).json({
      code: 10001,
      data: {
        message: "No sniffing process running",
      },
    });
  }
});

//源IP分布图数据
router.get("/api/online/source", verifyTokenMiddleware, (req, res) => {});

//目的IP分布图数据
router.get(".api.online/destination", verifyTokenMiddleware, (req, res) => {});

module.exports = router;

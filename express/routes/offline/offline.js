const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const {
  exec
} = require('child_process');

// 创建 pcap 和 csv 文件夹（如果不存在）
const pcapDir = path.join(__dirname, '../../pcap');
const csvDir = path.join(__dirname, '../../csv');
fs.mkdirSync(pcapDir, {
  recursive: true
});
fs.mkdirSync(csvDir, {
  recursive: true
});

// 配置 multer 存储设置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pcapDir); // 将文件保存到 pcap 文件夹
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // 使用时间戳作为文件名，避免重复
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024
  } // 限制文件大小为50MB
});

// 中间方法：发送文件到虚拟机并保存 CSV
async function sendFileToVM(filePath) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  const vmResponse = await axios.post('http://192.168.226.128:6000/upload', formData, {
    headers: formData.getHeaders(),
    responseType: 'stream' // 接收文件流
  });

  // 保存 CSV 文件
  const csvFileName = `${Date.now()}.csv`;
  const csvFilePath = path.join(csvDir, csvFileName);
  const writer = fs.createWriteStream(csvFilePath);
  vmResponse.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(csvFilePath));
    writer.on('error', reject);
  });
}

const jsonDir = path.join(__dirname, '../../mock/attack.json');

// 中间方法：发送 CSV 文件到威胁分析 API 并将返回的 JSON 写入文件
async function analyzeThreat(csvFilePath) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(csvFilePath));

  try {
    const response = await axios.post('http://127.0.0.1:5000/threat', formData, {
      headers: formData.getHeaders(),
    });

    // 将返回的 JSON 数据写入到 jsonDir 文件中，清空文件内容
    fs.writeFileSync(jsonDir, JSON.stringify(response.data, null, 2), 'utf-8');

    console.log('JSON 数据成功写入到', jsonDir);
    return response.data;
  } catch (error) {
    console.error('威胁分析请求失败:', error.message);
    throw error;
  }
}

// 设置路径
const jsonRstoreDirStore = path.join(__dirname, '../../mock/restore.json');

async function sendFileToVMCPP(filePath) {
  console.log('发送文件中...');

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  try {
    // 发送文件到虚拟机的接口
    const response = await axios.post('http://192.168.226.128:5000/process', formData, {
      headers: {
        ...formData.getHeaders(),
        'Accept': 'application/json' // 确保接收 JSON
      },
      responseType: 'stream', // 接收返回的文件
      timeout: 280000 // 设置超时时间，避免超时
    });

    // 创建写入流
    const writer = fs.createWriteStream(jsonRstoreDirStore);
    
    response.data.pipe(writer);

    // 等待写入完成
    writer.on('finish', () => {
      console.log('返回的文件已保存为', jsonRstoreDirStore);
    });

    writer.on('error', (error) => {
      console.error('写入文件失败:', error.message);
    });

    // 确保写入流完成后返回
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    return 'ok';
  } catch (error) {
    console.error('请求失败:', error.message);
    throw error;
  }
}

// 路由：处理文件上传
router.post('/api/offline/pcapRestore', (req, res) => {
  upload.single('file')(req, res, async function (err) {

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: '文件大小超出限制，最大为50MB'
        });
      }
      return res.status(500).json({
        message: '文件上传失败',
        error: err.message
      });
    } else if (err) {
      return res.status(500).json({
        message: '文件上传失败',
        error: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: '未上传文件'
      });
    }

    try {
      // 调用中间方法发送文件到虚拟机并获取 CSV 路径
      const csvFilePath = await sendFileToVM(req.file.path);
      console.log(csvFilePath);

      // 调用中间方法发送 CSV 文件进行威胁分析
      const threatResponse = await analyzeThreat(csvFilePath);

      console.log('restore');

      // restore
      // await sendFileToVMCPP(req.file.path);
      console.log('cppok')

      // // 执行 Python 脚本
      const pythonScriptPath = path.join(__dirname, 'main.py');
      exec(` ${pythonScriptPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`执行 Python 脚本时出错: ${error.message}`);
          return res.status(500).json({
            message: '执行 Python 脚本时出错',
            error: error.message
          });
        }
        if (stderr) {
          console.error(`Python 脚本错误输出: ${stderr}`);
          return res.status(500).json({
            message: 'Python 脚本错误',
            error: stderr
          });
        }

        console.log(`Python 脚本输出: ${stdout}`);
      })

      // 返回最终的响应
      res.status(200).json({
        message: '文件上传并成功转换为CSV，威胁分析已完成',
        csvFilePath,
        threatResponse
      });

    } catch (error) {
      res.status(500).json({
        message: '处理请求时出错',
        error: error.message
      });
    }
  });
});

module.exports = router;
const axios = require('axios'); // 引入 axios 用于发送 HTTP 请求
const { GridFSBucket } = require("mongodb");
const connectDB = require("./connectDB"); // 确保这个文件包含了连接数据库和获取 gfs 的逻辑

// 获取 gfs 实例
const gfs = connectDB.getGFS();

// 示例函数：根据 fileId 还原 pcap 文件
async function restorePcap(fileId) {
  try {
    if (!gfs) {
      throw new Error("GridFS not initialized");
    }


    // todo 将 fileId 发送到本机的 3000 端口进行分析
    const response = await axios.post('http://localhost:3000/api/analyze', { fileId });

    // 获取返回的分析结果数据
    const analysisResult = response.data;

    // 在这里可以对分析结果进行进一步处理或存储
    console.log("Analysis result:", analysisResult);

    return analysisResult; // 返回分析结果
  } catch (error) {
    console.error("Error in restorePcap function:", error);
    throw error; // 抛出异常以便在调用函数处进行错误处理
  }
}

module.exports = { restorePcap };

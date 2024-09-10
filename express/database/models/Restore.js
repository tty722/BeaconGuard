const mongoose = require("mongoose");

let RestoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users", //关联的用户ID
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  processedResults: {
    // 是否进行了IP分片重组
    ipReassembly: {
      type: Boolean,
      default: false,
    },
    // 是否进行了TCP流重组
    tcpStreamReassembly: {
      type: Boolean,
      default: false,
    },
    // 是否提取了应用层协议内容
    applicationLayerExtraction: {
      type: Boolean,
      default: false,
    },
    // 是否存储到数据库
    storedInDatabase: {
      type: Boolean,
      default: false,
    },
  },
  //流量包总体信息
  statistics: {
    //总包数
    totalPackets: {
      type: Number,
      default: 0,
    },
    //总字节数
    totalBytes: {
      type: Number,
      default: 0,
    },
    protocolAnalysis: {
      tcp: {
        totalPackets: Number,
        totalBytes: Number,
      },
      udp: {
        totalPackets: Number,
        totalBytes: Number,
      },
      dns: {
        totalPackets: Number,
        totalBytes: Number,
      },
      http: {
        totalPackets: Number,
        totalBytes: Number,
      },
      ftp: {
        totalPackets: Number,
        totalBytes: Number,
      },
    },
  },
  DNS: [
    {
      number: {
        type: Number,
        required: true,
      },
      sourceIP: {
        type: String,
        required: true,
      },
      destinationIP: {
        type: String,
        required: true,
      },
      sourcePort: {
        type: Number,
        required: true,
      },
      destinationPort: {
        type: Number,
        required: true,
      },
    },
  ],
  HTTP: [
    {
      number: {
        type: Number,
        required: true,
      },
      head: {
        type: String,
        required: true,
      },
    },
  ],
  FTP: {
    type: String,
    rquired: false,
  },
  //流量包详细信息
  packages: [
    {
      sourceIP: {
        type: String,
        required: true,
      },
      destinationIP: {
        type: String,
        required: true,
      },
      sourcePort: {
        type: Number,
        required: true,
      },
      destinationPort: {
        type: Number,
        required: true,
      },
      protocol: {
        type: String,
        required: true,
      },
      time: {
        type: Date,
        required: true,
      },
      message: {
        type: String,
        require: true,
      },
    },
  ],
  // 上传的文件信息
  uploadedFile: {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    }, // GridFS 中的文件ID
    filename: {
      type: String,
      required: true,
    }, // 文件名
    contentType: {
      type: String,
      required: true,
    }, // 文件类型
    length: {
      type: Number,
      required: true,
    }, // 文件大小
  },
  // 还原的文件集合
  restoredFiles: [
    {
      fileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      }, // GridFS 中的文件ID
      filename: {
        type: String,
        required: true,
      }, // 文件名
      contentType: {
        type: String,
        required: true,
      }, // 文件类型
      length: {
        type: Number,
        required: true,
      }, // 文件大小
    },
  ],
});

let Restore = mongoose.model("Restore", RestoreSchema);

module.exports = Restore;

// todo 统一管理restore信息相关的数据类型

// 单个协议分析的接口
interface ProtocolAnalysis {
  totalPackets: number;
  totalBytes: number;
}

// 处理结果的接口
interface ProcessedResults {
  ipReassembly: boolean;
  tcpStreamReassembly: boolean;
  applicationLayerExtraction: boolean;
  storedInDatabase: boolean;
}

// 统计信息的接口
interface Statistics {
  total_packets: number;
  total_bytes: number;
  protocolAnalysis: {
    tcp: ProtocolAnalysis;
    udp: ProtocolAnalysis;
    http: ProtocolAnalysis;
    ftp: ProtocolAnalysis;
    dns: ProtocolAnalysis;
  };
}

// 上传文件的接口
interface UploadedFile {
  fileId: string;
  filename: string;
  contentType: string;
  length: number;
}

// 恢复文件的接口
interface RestoredFile {
  fileId: string;
  filename: string;
  contentType: string;
  length: number;
}

// 恢复属性数据的接口
export interface restoreAttributesData {
  code: number;
  message?: string;
  startTime?: string;
  processedResults?: ProcessedResults;
  statistics?: Statistics;
  uploadedFile?: UploadedFile;
  restoredFiles?: RestoredFile[];
}

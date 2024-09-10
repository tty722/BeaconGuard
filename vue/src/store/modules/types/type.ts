import { RouteRecordRaw } from "vue-router";

//定义小仓库state数据类型
export interface UserState {
    _id: string,
    username: string,
    token: string | null,
    email: string,
    menuRoutes: RouteRecordRaw[],//路由数组，存储路由信息
    phoneNumber: number,
    birthday: string,
    gender: string,
    personalityTag: string,
}

export interface circle1Type {
    top4: {
        sourceIP: string,
        count: number,
    }[],
    remaining: number,
}

export interface circle2Type {
    top4: {
        destIP: string,
        count: number,
    }[],
    remaining: number,
}

export interface circle3Type {
    top4: {
        sourcePort: string,
        count: number,
    }[],
    remaining: number,
}

export interface circle4Type {
    top4: {
        destPort: string,
        count: number,
    }[],
    remaining: number,
}

export interface dataType {
    time: string,
    protocol: string,
    sourceIP: string,
    sourcePort: number,
    destinationIP: string,
    destinationPort: number
}[]

export interface ChartState {
    circle1: circle1Type,
    circle2: circle2Type,
    circle3: circle3Type,
    circle4: circle4Type,
    data: {
        time: string,
        protocol: string,
        sourceIP: string,
        sourcePort: number,
        destinationIP: string,
        destinationPort: number,
        message: string
    }[],
    coordinates: {
        time: string,
        protocol: string,
        sourceIP: string,
        sourcePort: number,
        destinationIP: string,
        destinationPort: number,
        message: string,
        destinationLatitude: string,
        destinationLongitude: string,
        destinationCity: string,
        sourceLatitude: string,
        sourceLongitude: string,
        sourceCity: string
    }[],
}

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


export interface DNSmessage {
    number: number
    sourceIP: string,
    sourcePort: number,
    destinationIP: string,
    destinationPort: number,
}

export interface HTTPMessage {
    number: number,
    head: string
}

export interface dataTypeWithMessage {
    time: string,
    protocol: string,
    sourceIP: string,
    sourcePort: number,
    destinationIP: string,
    destinationPort: number,
    message: string
}[]

export interface RestoreState {
    startTime: string;
    processedResults: ProcessedResults;
    statistics: Statistics;
    uploadedFile: UploadedFile;
    restoredFiles: RestoredFile[];
    DNS_protocol: dataTypeWithMessage[];
    DNS_message: DNSmessage[],
    HTTP_protocol: dataTypeWithMessage[];
    HTTP_message: HTTPMessage[],
    ICMP_protocol: dataTypeWithMessage[];
    FTP_protocol: dataTypeWithMessage[];
    FTP_message: string
}

export interface TrafficData {
    time: string;
    protocol: string;
    sourceIP: string;
    sourcePort: number;
    destinationIP: string;
    destinationPort: number;
}

export interface CircleData {
    top4: { key: string; count: number }[];
    remaining: number;
}

export interface onlineDataState {
    trafficData: TrafficData[];
    circle1: CircleData;
    circle2: CircleData;
    circle3: CircleData;
    circle4: CircleData;
    sourceIPCounts: { [key: string]: number };
    destIPCounts: { [key: string]: number };
    sourcePortCounts: { [key: string]: number };
    destPortCounts: { [key: string]: number };
}
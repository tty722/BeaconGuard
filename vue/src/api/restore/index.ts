// todo 统一管理restore信息相关的接口
import request from "@/utils/request";

enum API {
  OFFLINE_RESTORE_ATTRIBUTES_URL = "/api/offline/restore",
  DNS_PROTOCOL_URL="/api/offline/restore/dns/protocol",
  DNS_MESSAGE_URL="/api/offline/restore/dns",
  HTTP_PROTOCOL_URL="/api/offline/restore/http/protocol",
  HTTP_MESSAGE_URL="/api/offline/restore/http",
  FTP_MESSAGE_URL="/api/offline/restore/ftp",
  ICMP_PROTOCOL_URL='/api/offline/restore/icmp/protocol',
  FTP_PROTOCOL_URL='/api/offline/restore/ftp/protocol',
}

//restore中文件属性信息接口
export const reqRestoreAttributes = () => request.get<any, any>(API.OFFLINE_RESTORE_ATTRIBUTES_URL);

//dns协议数据
export const reqDNSProtocol=()=>request.get<any,any>(API.DNS_PROTOCOL_URL);

//dns数据获取
export const reqDNSMessage=()=>request.get<any,any>(API.DNS_MESSAGE_URL);

//http协议数据
export const reqHTTPProtocol=()=>request.get<any,any>(API.HTTP_PROTOCOL_URL);

//http数据获取
export const reqHTTPMessage=()=>request.get<any,any>(API.HTTP_MESSAGE_URL);

//icmp协议获取
export const reqICMPProtocol=()=>request.get<any,any>(API.ICMP_PROTOCOL_URL);

//ftp协议获取
export const reqFTPProtocol=()=>request.get<any,any>(API.FTP_PROTOCOL_URL)

//ftp协议信息获取
export const reqFTPMessage=()=>request.get<any,any>(API.FTP_MESSAGE_URL)
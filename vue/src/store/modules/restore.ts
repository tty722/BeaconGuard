// todo 定义restore有关小仓库

import { defineStore } from "pinia";
import { RestoreState } from "./types/type";
import { restoreAttributesData } from "@/api/restore/type";
import { reqFTPMessage, reqFTPProtocol, reqICMPProtocol, reqRestoreAttributes } from "@/api/restore";
import { reqDNSMessage, reqDNSProtocol, reqHTTPMessage, reqHTTPProtocol } from "@/api/restore";

let useRestoreStore = defineStore('Restore', {
  state: (): RestoreState => {
    return {
      startTime: '',
      processedResults: {
        ipReassembly: false,
        tcpStreamReassembly: false,
        applicationLayerExtraction: false,
        storedInDatabase: false,
      },
      statistics: {
        total_packets: 0,
        total_bytes: 0,
        protocolAnalysis: {
          tcp: { totalPackets: 0, totalBytes: 0 },
          udp: { totalPackets: 0, totalBytes: 0 },
          http: { totalPackets: 0, totalBytes: 0 },
          ftp: { totalPackets: 0, totalBytes: 0 },
          dns: { totalPackets: 0, totalBytes: 0 },
        },
      },
      uploadedFile: {
        fileId: '',
        filename: '',
        contentType: '',
        length: 0,
      },
      restoredFiles: [],
      DNS_protocol: [],
      DNS_message: [],
      HTTP_protocol: [],
      HTTP_message: [],
      ICMP_protocol: [],
      FTP_protocol: [],
      FTP_message: '',
    }
  },

  actions: {
    async restoreAttributesGetData() {
      //判断仓库是否已经有数据
      if (this.startTime !== "") {
        return "ok"
      }
      try {
        const result: restoreAttributesData = await reqRestoreAttributes(); // 等待请求响应

        if (result.code === 200) {
          this.startTime = result.startTime || '';
          this.processedResults = result.processedResults || {
            ipReassembly: false,
            tcpStreamReassembly: false,
            applicationLayerExtraction: false,
            storedInDatabase: false,
          };
          this.statistics = result.statistics || {
            total_packets: 0,
            total_bytes: 0,
            protocolAnalysis: {
              tcp: { totalPackets: 0, totalBytes: 0 },
              udp: { totalPackets: 0, totalBytes: 0 },
              http: { totalPackets: 0, totalBytes: 0 },
              ftp: { totalPackets: 0, totalBytes: 0 },
              dns: { totalPackets: 0, totalBytes: 0 },
            },
          };
          this.uploadedFile = result.uploadedFile || {
            fileId: '',
            filename: '',
            contentType: '',
            length: 0,
          };
          this.restoredFiles = result.restoredFiles || [];

          return "ok";
        } else {
          return Promise.reject(new Error(result.message || "Failed to fetch data"));
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },


    //获取DNSprotocol
    async DNSProtocolData() {
      //判断仓库是否为空
      if (this.DNS_protocol.length !== 0) {
        return 'ok';
      }

      try {
        const result = await reqDNSProtocol();

        if (result.code === 200) {
          this.DNS_protocol = result.json;

          return 'ok';
        } else {
          return Promise.reject(new Error(result.message || "Failed to fetch data"));
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },


    //获取DNS 的数据
    async DNSMessageData() {
      //判断仓库是否为空
      if (this.DNS_protocol.length !== 0) {
        return 'ok';
      }

      try {
        const result = await reqDNSMessage();

        if (result.code === 200) {
          this.DNS_message = result.json;

          return 'ok';
        } else {
          return Promise.reject(new Error(result.message || "Failed to fetch data"));
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },


    //获取HTTPprotocol
    async HTTPProtocolData() {
      //判断仓库是否为空
      if (this.HTTP_protocol.length !== 0) {
        return 'ok';
      }

      try {
        const result = await reqHTTPProtocol();

        if (result.code === 200) {
          this.HTTP_protocol = result.json;

          return 'ok';
        } else {
          return Promise.reject(new Error(result.message || "Failed to fetch data"));
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },


    //获取HTTP 的数据
    async HTTPMessageData() {
      //判断仓库是否为空
      if (this.HTTP_protocol.length !== 0) {
        return 'ok';
      }

      try {
        const result = await reqHTTPMessage();

        if (result.code === 200) {
          this.HTTP_message = result.json;

          return 'ok';
        } else {
          return Promise.reject(new Error(result.message || "Failed to fetch data"));
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },

    //获取ICMPprotocol
    async ICMPProtocolData() {
      //判断仓库是否为空
      if (this.ICMP_protocol.length !== 0) {
        return 'ok';
      }

      try {
        const result = await reqICMPProtocol();

        if (result.code === 200) {
          this.ICMP_protocol = result.json;

          return 'ok';
        } else {
          return Promise.reject(new Error(result.message || "Failed to fetch data"));
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },

    //获取FTPprotocol
    async FTPProtocolData() {
      //判断仓库是否为空
      if (this.FTP_protocol.length !== 0) {
        return 'ok';
      }

      try {
        const result = await reqFTPProtocol();

        if (result.code === 200) {
          this.FTP_protocol = result.json;

          return 'ok';
        } else {
          return Promise.reject(new Error(result.message || "Failed to fetch data"));
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },

    //获取FTPprotocol
    async FTPMessageData() {
      //判断仓库是否为空
      if (this.FTP_message !== '') {
        return 'ok';
      }

      try {
        const result = await reqFTPMessage();

        if (result.code === 200) {
          this.FTP_message = result.json;

          return 'ok';
        } else {
          return Promise.reject(new Error(result.message || "Failed to fetch data"));
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },
  }
})

export default useRestoreStore;
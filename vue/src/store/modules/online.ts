import { defineStore } from "pinia";
import { onlineDataState, TrafficData, CircleData } from "./types/type";
import { reqStopSniff } from "@/api/online";

const getOnlineTrafficStore = defineStore('online', {
  state: (): onlineDataState => ({
    trafficData: [], // 存储 JSON 数据的数组
    circle1: {
      top4: [
        { key: "", count: 0 },
        { key: "", count: 0 },
        { key: "", count: 0 },
        { key: "", count: 0 }
      ],
      remaining: 0,
    },
    circle2: {
      top4: [
        { key: "", count: 0 },
        { key: "", count: 0 },
        { key: "", count: 0 },
        { key: "", count: 0 }
      ],
      remaining: 0,
    },
    circle3: {
      top4: [
        { key: "", count: 0 },
        { key: "", count: 0 },
        { key: "", count: 0 },
        { key: "", count: 0 }
      ],
      remaining: 0,
    },
    circle4: {
      top4: [
        { key: "", count: 0 },
        { key: "", count: 0 },
        { key: "", count: 0 },
        { key: "", count: 0 }
      ],
      remaining: 0,
    },
    sourceIPCounts: {}, // 记录所有 IP 出现次数的对象
    destIPCounts: {}, // 记录所有目的IP出现次数的对象
    sourcePortCounts: {}, // 记录所有源端口出现次数的对象
    destPortCounts: {}, // 记录所有目的端口出现次数的对象
  }),
  actions: {
    async startSniff() {
      const eventSource = new EventSource("http://127.0.0.1:3000/api/onlineSniff");

      eventSource.onmessage = (event: MessageEvent) => {
        const packet: TrafficData = JSON.parse(event.data);
        // 将接收到的 JSON 对象存储到数组中
        this.trafficData.push(packet);
        console.log(packet);

        // 更新 circle1 数据
        this.updateCircleData(packet.sourceIP, 'sourceIPCounts', 'circle1');
        // 更新 circle2 数据
        this.updateCircleData(packet.destinationIP, 'destIPCounts', 'circle2');
        // 更新 circle3 数据
        this.updateCircleData(packet.sourcePort.toString(), 'sourcePortCounts', 'circle3');
        // 更新 circle4 数据
        this.updateCircleData(packet.destinationPort.toString(), 'destPortCounts', 'circle4');

        console.log(this.sourceIPCounts,this.sourcePortCounts,this.destIPCounts,this.destPortCounts);
        
      };

      eventSource.onerror = (error: Event) => {
        console.error("Error occurred while receiving data:", error);
        eventSource.close();
      };
    },

    async stopSniff() {
      try {
        const result = await reqStopSniff();
        if (result.code === 200) {
          console.log(this.trafficData);
          return 'ok';
        } else {
          return Promise.reject(new Error(result.data.message));
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },

    updateCircleData(key: string, countObjKey: keyof onlineDataState, circleKey: keyof onlineDataState) {
      const counts = this[countObjKey] as { [key: string]: number };
      const circleData = this[circleKey] as CircleData;

      // 更新计数对象
      if (counts[key]) {
        counts[key]++;
      } else {
        counts[key] = 1;
      }

      const top4 = circleData.top4;
      const keyCount = counts[key];

      // 检查是否在 top4 中
      const top4Index = top4.findIndex(item => item.key === key);

      if (top4Index !== -1) {
        // 如果在 top4 中，更新计数
        top4[top4Index].count = keyCount;
      } else {
        // 查找计数最小的元素
        let minCount = Math.min(...top4.map(item => item.count));
        let minIndex = top4.findIndex(item => item.count === minCount);

        if (keyCount > minCount) {
          // 更新 remaining 的计数
          circleData.remaining += top4[minIndex].count;

          // 替换最小的元素
          top4[minIndex] = { key, count: keyCount };
        } else {
          // 更新 remaining 的计数
          circleData.remaining += keyCount;
        }
      }
    }
  },
  getters: {},
});

export default getOnlineTrafficStore;

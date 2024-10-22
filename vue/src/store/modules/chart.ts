// todo 定义图表有关小仓库

import { reqFlowCircle1, reqFlowCircle2, reqFlowCircle3, reqFlowCircle4, reqFlowTime, reqMapCoordinates } from "@/api/chart";
import { flowCircl1Data, flowCircl2Data, flowCircl3Data, flowCircl4Data } from "@/api/chart/type";
import { defineStore } from "pinia";
import { ChartState, circle1Type, circle2Type, circle3Type, circle4Type } from "./types/type";


let useChartStore = defineStore('Chart', {
  state: (): ChartState => {
    return {
      circle1: {
        top4: [
          { sourceIP: "", count: 0 },
          { sourceIP: "", count: 0 },
          { sourceIP: "", count: 0 },
          { sourceIP: "", count: 0 }
        ],
        remaining: 0,
      },
      circle2: {
        top4: [
          { destIP: "", count: 0 },
          { destIP: "", count: 0 },
          { destIP: "", count: 0 },
          { destIP: "", count: 0 }
        ],
        remaining: 0,
      },
      circle3: {
        top4: [
          { sourcePort: "", count: 0 },
          { sourcePort: "", count: 0 },
          { sourcePort: "", count: 0 },
          { sourcePort: "", count: 0 }
        ],
        remaining: 0,
      },
      circle4: {
        top4: [
          { destPort: "", count: 0 },
          { destPort: "", count: 0 },
          { destPort: "", count: 0 },
          { destPort: "", count: 0 }
        ],
        remaining: 0,
      },
      data: [], // 初始化为空数组
      coordinates: [],//经纬度
    }
  },

  actions: {
    //circle1
    async chartFlowCircle1() {

      //判断circle1是否为空
      if (!(this.circle1.top4.every(item => item.sourceIP === "" && item.count === 0) && this.circle1.remaining === 0)) {
        return 'ok'
      }

      const result: flowCircl1Data = await reqFlowCircle1();//等待请求响应

      if (result.code === 200) {
        this.circle1 = result.responseData as circle1Type;

        return 'ok';
      } else {
        return Promise.reject(new Error(result.message));
      }
    },

    //circle2
    async chartFlowCircle2() {

      //判断circle2是否为空
      if (!(this.circle2.top4.every(item => item.destIP === "" && item.count === 0) && this.circle2.remaining === 0)) {
        return 'ok'
      }

      const result: flowCircl2Data = await reqFlowCircle2();//等待请求响应

      if (result.code === 200) {
        this.circle2 = result.responseData as circle2Type;


        return 'ok';
      } else {
        return Promise.reject(new Error(result.message));
      }
    },


    //circle3
    async chartFlowCircle3() {

      //判断circle3是否为空
      if (!(this.circle3.top4.every(item => item.sourcePort === "" && item.count === 0) && this.circle3.remaining === 0)) {
        return 'ok'
      }

      const result: flowCircl3Data = await reqFlowCircle3();//等待请求响应

      if (result.code === 200) {
        this.circle3 = result.responseData as circle3Type;

        return 'ok';
      } else {
        return Promise.reject(new Error(result.message));
      }
    },

    //circle4
    async chartFlowCircle4() {

      //判断circle4是否为空
      if (!(this.circle4.top4.every(item => item.destPort === "" && item.count === 0) && this.circle4.remaining === 0)) {
        return 'ok'
      }

      const result: flowCircl4Data = await reqFlowCircle4();//等待请求响应

      if (result.code === 200) {
        this.circle4 = result.responseData as circle4Type;

        return 'ok';
      } else {
        return Promise.reject(new Error(result.message));
      }
    },

    //time
    async chartFlowTime() {
      if (this.data.length !== 0) {
        return 'ok';
      }

      const result = await reqFlowTime();

      if (result.code === 200) {
        this.data = result.json;

        
        return 'ok';
      } else {

        return Promise.reject(new Error(result.message));
      }
    },

    //map
    async chartMap() {
      if (this.coordinates.length !== 0) {
        return 'ok';
      }

      const result = await reqMapCoordinates();

      if (result.code === 200) {
        this.coordinates = result.json;
        

        return 'ok';
      } else {

        return Promise.reject(new Error(result.message));
      }
    }
  }
})

//对外暴露
export default useChartStore;
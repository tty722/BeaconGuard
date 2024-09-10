//小仓库：关于offline威胁分析相关配置的仓库
import { defineStore } from "pinia";
import General from '@/views/offlineTraffic/trafficAnalysis/General/inde.vue'
import generalOverview from '@/views/offlineTraffic/trafficAnalysis/General/overview/index.vue'
import alertOverview from '@/views/offlineTraffic/trafficAnalysis/Alert/overview/index.vue'
import flowSankey from '@/views/offlineTraffic/trafficAnalysis/Flows/Sankey/index.vue'
import IP from '@/views/offlineTraffic/trafficAnalysis/General/overview/ip/index.vue'
import IPAlert from '@/views/offlineTraffic/trafficAnalysis/Alert/overview/ip/index.vue'




let useOfflineStore = defineStore('OfflineStore', {
    state: () => {
        return {
            toExitAnalysis: true,
            offline: General,
            offlineString: 'General',
            general: generalOverview,
            generalString: 'generalOverview',
            alert: alertOverview,
            alertString: 'alertOverview',
            flows: flowSankey,
            flowsString: 'flowSankey',
            IP:IP,
            IPString:"IP",
            IPAlert:IPAlert,
            IPAlertString:"IPAlert",
        }
    }
})

//对外暴露
export default useOfflineStore;
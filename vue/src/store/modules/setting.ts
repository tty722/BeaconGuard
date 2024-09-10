//小仓库：关于layout组件相关配置的仓库
import { defineStore } from "pinia";
import General from "../../views/restore/restore/general/index.vue"
import IP from "../../views/trafficAnalysis/overview/Flow/ip/index.vue"
import Protocol from "../../views/restore/restore/HTTP/chart/table.vue"

let useLayoutSettingStore = defineStore('SettingStore', {
    state: () => {
        return {
            refresh: false,//用于控制刷新效果
            restore: General,
            restoreString: "General",
            IP: IP,
            IPString: "IP",
            HTTP: Protocol,
            HTTPstring: 'Protocol',
        }
    }
})

export default useLayoutSettingStore;
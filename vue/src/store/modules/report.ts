// todo 定义report相关小仓库

import { defineStore } from "pinia";
import { ReportState } from "./types/report";
import { reportReponseData } from "@/api/report/type";
import { reqReport, reqSuggest } from "@/api/report";


let useReportStore = defineStore('Report', {
    state: (): ReportState => {
        return {
            destinationIP: '',
            sourceIP: '',
            destinationPort: 0,
            time: '',
            total_time: '',
            label: '',
            num: 0,
            report: '',
            file1: '',
            file2: '',
            suggest: '',
        }
    },
    actions: {
        async reportGet() {
            const data = {
                destinationIP: this.destinationIP,
                sourceIP: this.sourceIP,
                destinationPort: this.destinationPort,
                time: this.time,
                total_time: this.total_time,
                label: this.label,
                num: this.num,
            }

            const result: reportReponseData = await reqReport(data)
            if (result.code == 200 && result.data) {
                this.report = result.data
                // console.log(this.report);
                this.file1 = result.message
                return 'ok';
            } else {
                return Promise.reject(new Error(result.message));
            }
        },

        async suggestGet() {
            const data = {
                destinationIP: this.destinationIP,
                sourceIP: this.sourceIP,
                destinationPort: this.destinationPort,
                time: this.time,
                total_time: this.total_time,
                label: this.label,
                num: this.num,
            }

            const result: reportReponseData = await reqSuggest(data)
            if (result.code == 200 && result.data) {
                this.suggest = result.data
                this.file2 = result.message
                return 'ok';
            } else {
                return Promise.reject(new Error(result.message));
            }
        }
    }
})



//对外暴露
export default useReportStore;
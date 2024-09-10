// todo 定义获取report相关仓库的方法

import offlineChartStore from "@/store/modules/offline-chart";
import useReportStore from "@/store/modules/report";

export async function getReportData() {
    const reportStore = useReportStore();
    if (reportStore.destinationIP == '' && reportStore.destinationPort == 0 &&
        reportStore.label == '' && reportStore.sourceIP == '' && reportStore.time == '' &&
        reportStore.total_time == '' && reportStore.num == 0
    ) {
        let response =await getMostFrequentPair()
        console.log(response?.data);


    } else {
        return 'ok'
    }
}


async function getMostFrequentPair(){
    const OfflineChart = offlineChartStore();
    await OfflineChart.alertTable(); // 确保数据加载

    const attackData: Attack[] = OfflineChart.attack; // 假设这包含攻击数据
    if (!attackData || attackData.length === 0) return null; // 没有数据

    // 统计每对源IP和目标IP的交互次数
    const ipPairCount: { [key: string]: { count: number; attacks: Attack[] } } = {};
    attackData.forEach(attack => {
        const pairKey = `${attack.sourceIP}-${attack.destinationIP}`;
        if (ipPairCount[pairKey]) {
            ipPairCount[pairKey].count++;
            ipPairCount[pairKey].attacks.push(attack);
        } else {
            ipPairCount[pairKey] = { count: 1, attacks: [attack] };
        }
    });

    // 找出交互次数最多的源IP和目标IP对
    let mostFrequentPair: string | null = null;
    let maxCount = 0;
    for (const pair in ipPairCount) {
        if (ipPairCount[pair].count > maxCount) {
            maxCount = ipPairCount[pair].count;
            mostFrequentPair = pair;
        }
    }

    if (!mostFrequentPair) return null; // 没有找到交互最多的一对

    // 获取交互次数最多的那对的攻击详情
    const mostFrequentAttacks = ipPairCount[mostFrequentPair].attacks;
    const [sourceIP, destinationIP] = mostFrequentPair.split('-');

    let earliestTime = mostFrequentAttacks[0].time;
    let latestTime = mostFrequentAttacks[0].time;
    const portCount: { [key: number]: number } = {};

    mostFrequentAttacks.forEach(attack => {
        const destPort = attack.destinationPort;
        if (portCount[destPort]) {
            portCount[destPort]++;
        } else {
            portCount[destPort] = 1;
        }

        // 更新最早和最晚时间
        if (attack.time < earliestTime) earliestTime = attack.time;
        if (attack.time > latestTime) latestTime = attack.time;
    });

    // 找出使用最多的目标端口
    const mostFrequentPort = Object.entries(portCount).sort((a, b) => b[1] - a[1])[0][0];


    let reportStore=useReportStore()
    reportStore.destinationIP=destinationIP
    reportStore.destinationPort=Number(mostFrequentPort)
    reportStore.sourceIP=sourceIP
    reportStore.time=earliestTime
    reportStore.total_time=(new Date(latestTime).getTime() - new Date(earliestTime).getTime()).toString()
    reportStore.label=mostFrequentAttacks[0].label
    reportStore.num=maxCount

    console.log({
        sourceIP: sourceIP,
        destinationIP: destinationIP,
        destinationPort: Number(mostFrequentPort),
        time: earliestTime,
        total_time: new Date(latestTime).getTime() - new Date(earliestTime).getTime(),
        label: mostFrequentAttacks[0].label,
        num: maxCount
    });
    

    return {
        data:{
            sourceIP: sourceIP,
            destinationIP: destinationIP,
            destinationPort: Number(mostFrequentPort),
            time: earliestTime,
            total_time: new Date(latestTime).getTime() - new Date(earliestTime).getTime(),
            label: mostFrequentAttacks[0].label,
            num: maxCount
        }
    };
}

interface Attack {
    sourceIP: string;
    destinationIP: string;
    sourcePort: number;
    destinationPort: number;
    protocol: string;
    time: string;
    label: string;
}



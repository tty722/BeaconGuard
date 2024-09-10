//定义小offlinechartstate数据类型

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

export interface OfflineChartState  {
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
        label: string
    }[],
    attack: {
        time: string,
        protocol: string,
        sourceIP: string,
        sourcePort: number,
        destinationIP: string,
        destinationPort: number,
        label: string
    }[],
    coordinates: {
        time: string,
        protocol: string,
        sourceIP: string,
        sourcePort: number,
        destinationIP: string,
        destinationPort: number,
        label: string,
        destinationLatitude: string,
        destinationLongitude: string,
        destinationCity: string,
        sourceLatitude: string,
        sourceLongitude: string,
        sourceCity: string
    }[],
}

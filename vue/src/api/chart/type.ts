// todo 定义图表相关的数据类型

//circle1
export interface flowCircl1Data {
  code: number,
  message?: string,
  responseData?: {
    top4:
    {
      sourceIP: string,
      count: number,
    }[],
    remaining: number,
  }
}

//circle2
export interface flowCircl2Data {
  code: number,
  message?: string,
  responseData?: {
    top4:
    {
      destIP: string,
      count: number,
    }[],
    remaining: number,
  }
}

//circle3
export interface flowCircl3Data {
  code: number,
  message?: string,
  responseData?: {
    top4:
    {
      sourcePort: string,
      count: number,
    }[],
    remaining: number,
  }
}

//circle4
export interface flowCircl4Data {
  code: number,
  message?: string,
  responseData?: {
    top4:
    {
      destPort: string,
      count: number,
    }[],
    remaining: number,
  }
}



export interface ChannelMetrics{
    name: string
    WeeklyMetrics:{
        [isoYearWeek: number]:weekBucket
    }
}

export interface weekBucket{
    sum: number
    count: number
}

export function ToPayload(wb:weekBucket){
    return {
        ...wb,
        average:wb.sum/wb.count
    }
}

//TODO: make it to promises
export interface DatabaseService {
    GetChannelMetric(channelName: string):ChannelMetrics|null
    AddMetric(channelName:string,timestamp: Date,count:number):boolean
    GetChannelList():string[]
}
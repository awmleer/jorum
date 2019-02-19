export interface StreamStatus {
  waitingCount: number
}

export let sharedData = {
  streamStatus: null as StreamStatus
}

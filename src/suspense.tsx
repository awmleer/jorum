import * as React from 'react'
import {ReactNode, useRef} from 'react'
import {ReactElement} from 'react'

export class StreamNotInitialized {}

interface StreamStatus {
  waitingCount: number
}

export let streamStatus: StreamStatus = null

export function suspense<P = {}>(
  render: (props: P & { children?: ReactNode }) => ReactElement<any> | null
): React.FC<P & {children?: ReactNode}> {
  return function (props) {
    const statusRef = useRef<StreamStatus>({
      waitingCount: 0
    })
    streamStatus = statusRef.current
    try {
      const ret = render(props)
      streamStatus = null
      return ret
    } catch (e) {
      streamStatus = null
      if (e instanceof StreamNotInitialized) {
        return null
      } else {
        throw e
      }
    }
  }
}

export function checkStream() {
  if (streamStatus.waitingCount !== 0) {
    throw new StreamNotInitialized()
  }
}

import * as React from 'react'
import {FC, ReactElement, ReactNode, useRef} from 'react'

interface StreamStatus {
  waitingCount: number
}

export let streamStatus: StreamStatus = null

export function suspense<P = {}>(
  init: (props: P & { children?: ReactNode }) => () => ReactElement<any> | null
): FC<P & {children?: ReactNode}> {
  let render: ReturnType<typeof init>
  const InnerComponent: FC = () => {
    return render()
  }
  return function (props) {
    const statusRef = useRef<StreamStatus>({
      waitingCount: 0
    })
    streamStatus = statusRef.current
    render = init(props)
    if (streamStatus.waitingCount !== 0) {
      return null
    }
    return (
      <InnerComponent />
    )
  }
}

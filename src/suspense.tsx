import * as React from 'react'
import {FC, ReactElement, ReactNode, useRef} from 'react'
import {sharedData, StreamStatus} from './shared-data'

type Render = () => ReactElement<any> | null

export function suspense<P = {}>(
  init: (props: P & { children?: ReactNode }) => Render | null
) {
  const InnerComponent: FC<{render: Render}> = (props) => {
    return props.render()
  }
  InnerComponent.displayName = `Suspense(${init.name})`
  
  const Component: FC<P> = function (props) {
    const {current: streamStatus} = useRef<StreamStatus>({
      isFirstRun: true,
      waitingCount: 0,
    })
    sharedData.streamStatus = streamStatus
    const render = init(props)
    streamStatus.isFirstRun = false
    sharedData.streamStatus = null
    if (streamStatus.waitingCount !== 0) return null
    if (render === null) return null
    return (
      <InnerComponent render={render} />
    )
  }
  Component.displayName = init.name
  return Component
}

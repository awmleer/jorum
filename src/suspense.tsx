import * as React from 'react'
import {FC, ReactElement, ReactNode, useRef} from 'react'
import {sharedData, StreamStatus} from './shared-data'


export function suspense<P = {}>(
  init: (props: P & { children?: ReactNode }) => (() => ReactElement<any> | null) | null
) {
  let render: ReturnType<typeof init> = null
  const InnerComponent: FC = () => {
    return render()
  }
  InnerComponent.displayName = `Suspense(${init.name})`
  const Component: FC<P & {children?: ReactNode}> = function (props) {
    const {current: streamStatus} = useRef<StreamStatus>({
      isFirstRun: true,
      waitingCount: 0,
    })
    sharedData.streamStatus = streamStatus
    render = init(props)
    streamStatus.isFirstRun = false
    sharedData.streamStatus = null
    if (streamStatus.waitingCount !== 0) return null
    if (render === null) return null
    return (
      <InnerComponent />
    )
  }
  Component.displayName = init.name
  return Component
}

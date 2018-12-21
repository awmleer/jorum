import * as React from 'react'
import {ReactNode} from 'react'
import {ReactElement} from 'react'

export class StreamNotInitialized {}

export function suspense<P = {}>(
  render: (props: P & { children?: ReactNode }) => ReactElement<any> | null
): React.FC<P & {children?: ReactNode}> {
  return function (props) {
    try {
      return render(props)
    } catch (e) {
      if (e instanceof StreamNotInitialized) {
        return null
      } else {
        throw e
      }
    }
  }
}

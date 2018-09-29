import React from "react"
import {CounterBloc} from './bloc/counter-bloc'
import {Subscribe} from '../index'

const counterBloc = new CounterBloc()

export class App extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <Subscribe to={counterBloc.count$}>
          {data => (
            <p>{data}</p>
          )}
        </Subscribe>
      </div>
    )
  }
}


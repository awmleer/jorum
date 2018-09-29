import React from "react"
import {CounterBloc} from './bloc/counter-bloc'
import {Subscribe} from '../index'

const counterBloc = new CounterBloc()

export class App extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        counter
        <Subscribe to={counterBloc.count$}>
          {data => (
            <p>{data}</p>
          )}
        </Subscribe>
        <Subscribe to={counterBloc.shouldShowResetButton$}>
          {data => (
            data && <button onClick={counterBloc.resetCounter}>reset</button>
          )}
        </Subscribe>
      </div>
    )
  }
}


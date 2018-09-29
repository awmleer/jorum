import * as React from "react"
import {CounterBloc} from './bloc/counter-bloc'
import {Subscription} from '../index'

const counterBloc = new CounterBloc()

export class App extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <Subscription to={counterBloc.count$}>
          {data => (
            <p>{data}</p>
          )}
        </Subscription>
      </div>
    )
  }
}


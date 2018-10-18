import * as React from 'react'
import {Consumer} from '../../lib'
import {CounterBloc} from './bloc/counter.bloc'
import {Subscribe} from '../../lib'

export class Counter extends React.Component {
  render() {
    return (
      <Consumer of={CounterBloc}>
        {(counterBloc:CounterBloc) => (
          <React.Fragment>
            <Subscribe to={[counterBloc.count$, counterBloc.countAnother$]}>
              {(count, countAnother) => (
                <div>
                  <p>{count}</p>
                  <p>{countAnother}</p>
                </div>
              )}
            </Subscribe>
            <Subscribe to={counterBloc.shouldShowResetButton$}>
              {data => {
                console.log(data)
                return data && <button onClick={counterBloc.resetCounter}>reset</button>
              }}
            </Subscribe>
          </React.Fragment>
        )}
      </Consumer>
    )
  }
}

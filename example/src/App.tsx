import React from "react"
import {CounterBloc} from './bloc/counter-bloc'
import {Subscribe} from '../../lib'

// const counterBloc = new CounterBloc()

export class App extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        counter
        <CounterBloc.Provider>
          <CounterBloc.Consumer>
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
          </CounterBloc.Consumer>
          <CounterBloc.Provider>
            <CounterBloc.Consumer>
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
            </CounterBloc.Consumer>
          </CounterBloc.Provider>
        </CounterBloc.Provider>
      </div>
    )
  }
}


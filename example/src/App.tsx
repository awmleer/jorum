import React from "react"
import {CounterBloc, TestBloc} from './bloc/counter.bloc'
import {Consumer, Provider, Subscribe} from 'jorum'
import {Counter} from './Counter'

const counterBloc = new CounterBloc(100)

interface State {
  switcher: boolean
}

export class OldApp extends React.Component<{}, State> {
  state = {
    switcher: true
  }

  changeText = () => {
    this.setState(prevState => ({
      switcher: !prevState.switcher
    }))
  }

  render() {
    return (
      <div>
        {this.state.switcher}
        <button onClick={this.changeText}>switch bloc</button>
        {this.state.switcher ? (
          <Provider of={CounterBloc} use={counterBloc}>
            <p>This one bloc:</p>
            <Counter/>
            <Provider of={CounterBloc} use={counterBloc}>
              <p>This the same bloc of the above one:</p>
              <Counter/>
            </Provider>
            <Provider of={CounterBloc}>
              <p>This is another bloc:</p>
              <Counter/>
            </Provider>
          </Provider>
        ) : (
          <Provider of={TestBloc}>
            <Consumer of={TestBloc}>
              {testBloc => (
                <Subscribe to={testBloc.a$}>
                  {a => (
                    <p>{a}</p>
                  )}
                </Subscribe>
              )}
            </Consumer>
          </Provider>
        )}
      </div>
    )
  }
}

export function App() {
  const [count, setCount] = React.useState(1)
  return (
    <Provider of={CounterBloc}>
      <p>This is another bloc:</p>
      <Counter/>
    </Provider>
  )
}
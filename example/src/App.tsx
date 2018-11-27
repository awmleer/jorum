import React, {FC} from 'react'
import {CounterBloc, TestBloc} from './bloc/counter.bloc'
import {Consumer, Provider, Subscribe, withProvider} from 'jorum'
import {Counter} from './Counter'

const counterBloc = new CounterBloc(100)

const Test: React.ComponentType = withProvider({
  of: TestBloc
})(() => {
  return (
    <>
      <h2>Test</h2>
      <Consumer of={TestBloc}>
        {(testBloc: TestBloc) => (
          <Subscribe to={testBloc.a$}>
            {(a:any) => {
              console.log('a is', a)
              return a && (
                <p>{a}</p>
              )
            }}
          </Subscribe>
        )}
      </Consumer>
    </>
  )
})


interface State {
  switcher: boolean
}

export class App extends React.Component<{}, State> {
  state = {
    switcher: true
  }
  
  testBlocRef = React.createRef<TestBloc>()
  
  changeText = () => {
    this.setState(prevState => ({
      switcher: !prevState.switcher
    }))
  }
  
  componentDidUpdate() {
    console.log(this.testBlocRef.current)
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
          <Test />
        )}
      </div>
    )
  }
}

// export function App() {
//   const [count, setCount] = React.useState(1)
//   return (
//     <Provider of={CounterBloc}>
//       <p>This is another bloc:</p>
//       <Counter/>
//     </Provider>
//   )
// }
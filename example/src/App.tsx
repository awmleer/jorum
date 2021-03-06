import React, {FC} from 'react'
import {CounterBloc, TestBloc} from './bloc/counter.bloc'
import {Consumer, Provider, Subscribe, useBloc, useStream, withProvider, suspense} from 'jorum'
import {Counter} from './Counter'

const counterBloc = new CounterBloc(100)

interface TestProps {
  initial: number
}

const Test = withProvider<TestProps>((props) => ({
  of: TestBloc,
  args: [props.initial]
}))(suspense((props) => {
  const testBloc = useBloc(TestBloc)
  const b = useStream(testBloc.b$)
  return (
    <>
      <h2>Test{props.initial}</h2>
      <p>b is: {b}</p>
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
}))


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
          <Provider of={CounterBloc}>
            <p>This one bloc:</p>
            <Counter/>
            <Provider of={CounterBloc}>
              <p>This is another bloc:</p>
              <Counter/>
            </Provider>
          </Provider>
        ) : (
          <Test initial={123} />
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

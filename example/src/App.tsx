import React from "react"
import {CounterBloc, TestBloc} from './bloc/counter-bloc'
import {Subscribe} from '../../lib'
import {Consumer, Provider} from '../../lib/context'
import {Counter} from './Counter'

// const counterBloc = new CounterBloc()

export class App extends React.Component<{}, any> {
  state = {
    text: 'hello'
  }

  changeText = () => {
    this.setState({
      text: 'hi'
    })
  }

  render() {
    return (
      <div>
        {this.state.text}
        <button onClick={this.changeText}>change text</button>
        <Provider of={CounterBloc}>
          <Counter/>
          <Provider of={CounterBloc}>
            <Counter/>
          </Provider>
        </Provider>
        {/*<CounterBloc.Provider>*/}

          {/*<CounterBloc.Provider>*/}
            {/*<CounterBloc.Consumer>*/}
              {/*{(counterBloc:CounterBloc) => (*/}
                {/*<React.Fragment>*/}
                  {/*<Subscribe to={[counterBloc.count$, counterBloc.countAnother$]}>*/}
                    {/*{(count, countAnother) => (*/}
                      {/*<div>*/}
                        {/*<p>{count}</p>*/}
                        {/*<p>{countAnother}</p>*/}
                      {/*</div>*/}
                    {/*)}*/}
                  {/*</Subscribe>*/}
                  {/*<Subscribe to={counterBloc.shouldShowResetButton$}>*/}
                    {/*{data => {*/}
                      {/*console.log(data)*/}
                      {/*return data && <button onClick={counterBloc.resetCounter}>reset</button>*/}
                    {/*}}*/}
                  {/*</Subscribe>*/}
                {/*</React.Fragment>*/}
              {/*)}*/}
            {/*</CounterBloc.Consumer>*/}
          {/*</CounterBloc.Provider>*/}
          {/*<TestBloc.Provider>*/}
            {/*<TestBloc.Consumer>*/}
              {/*{(testBloc) => (*/}
                {/*<Subscribe to={testBloc.a$}>*/}
                  {/*{a => (*/}
                    {/*<p>{a}</p>*/}
                  {/*)}*/}
                {/*</Subscribe>*/}
              {/*)}*/}
            {/*</TestBloc.Consumer>*/}
          {/*</TestBloc.Provider>*/}
        {/*</CounterBloc.Provider>*/}
      </div>
    )
  }
}


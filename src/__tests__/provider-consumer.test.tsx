import * as TestRenderer from 'react-test-renderer'
import * as React from 'react'
import {Bloc, bloc, Provider, useBloc, withProvider} from '..'
import {BarBloc, FaaBloc, FooBloc} from './blocs/foo.bloc'
import {ShowBar, ShowFaa, ShowFoo} from './components/show-foo'



it('provider initialize', function () {
  const renderer = TestRenderer.create(
    <Provider of={FooBloc}>
      <ShowFoo />
    </Provider>
  )
  expect(renderer.toJSON()).toMatchSnapshot()
})


it('provider of prop change', function () {
  interface State {
    switcher: boolean
  }
  class Container extends React.Component<{}, State> {
    state = {
      switcher: true
    }
    
    change() {
      this.setState((preState) => ({
        switcher: !preState.switcher
      }))
    }
    
    render() {
      if (this.state.switcher) {
        return (
          <Provider of={FooBloc}>
            <ShowFoo />
          </Provider>
        )
      } else {
        return (
          <Provider of={FaaBloc}>
            <ShowFaa />
          </Provider>
        )
      }
    }
  }
  
  const renderer = TestRenderer.create(
    <Container/>
  )
  expect(renderer.toJSON()).toMatchSnapshot()
  renderer.root.instance.change()
  expect(renderer.toJSON()).toMatchSnapshot()
})


it('provider with args', function() {
  interface State {
    args: any[]
  }
  class Container extends React.Component<{}, State> {
    state = {
      args: ['this is faa one']
    }
    
    change() {
      this.setState({
        args: ['this is faa two']
      })
    }
    
    render() {
      return (
        <Provider of={FaaBloc} args={this.state.args} key={this.state.args[0]}>
          <ShowFaa />
        </Provider>
      )
    }
  }
  
  const renderer = TestRenderer.create(
    <Container/>
  )
  expect(renderer.toJSON()).toMatchSnapshot()
  renderer.root.instance.change()
  expect(renderer.toJSON()).toMatchSnapshot()
})


it('provider with auto-injected dependencies', function () {
  const renderer = TestRenderer.create(
    <Provider of={FooBloc}>
      <Provider of={BarBloc}>
        <ShowBar />
      </Provider>
    </Provider>
  )
  expect(renderer.toJSON()).toMatchSnapshot()
})


it('blocWillDestroy is called', function () {
  const mockBlocWillDestroy = jest.fn(() => null)
  
  @bloc
  class TestDestroyBloc implements Bloc {
    blocWillDestroy = mockBlocWillDestroy
  }
  
  expect(mockBlocWillDestroy.mock.calls.length).toBe(0)
  const renderer = TestRenderer.create(
    <Provider of={TestDestroyBloc}>
      <div>123</div>
    </Provider>
  )
  renderer.unmount()
  
  expect(mockBlocWillDestroy.mock.calls.length).toBe(1)
})

it('withProvider HOC', function() {
  const Container = withProvider({
    of: FooBloc
  })(() => {
    const bloc = useBloc(FooBloc)
    return (
      <div>
        {bloc.foo}
      </div>
    )
  })
  const renderer = TestRenderer.create(
    <Container />
  )
  expect(renderer.toJSON()).toMatchSnapshot()
})


it('withProvider HOC with args param', function() {
  const Container = withProvider({
    of: FaaBloc,
    args: ['this is another faa']
  })(() => {
    return (
      <ShowFaa />
    )
  })
  const renderer = TestRenderer.create(
    <Container />
  )
  expect(renderer.toJSON()).toMatchSnapshot()
})


it('withProvider with function as param', function() {
  const App = withProvider<{
    text: string
  }>((props) => ({
    of: FaaBloc,
    args: [props.text]
  }))(() => {
    return (
      <ShowFaa />
    )
  })
  const renderer = TestRenderer.create(
    <App text="this is from text prop" />
  )
  expect(renderer.toJSON()).toMatchSnapshot()
  const rendererB = TestRenderer.create(
    <App text="this is some other text" />
  )
  expect(rendererB.toJSON()).toMatchSnapshot()
})


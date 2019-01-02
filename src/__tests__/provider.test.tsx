import * as TestRenderer from 'react-test-renderer'
import {FC} from 'react'
import * as React from 'react'
import {bloc, inject, Provider, useBloc} from '..'


@bloc
class FooBloc {
  foo: string = 'this is foo'
}

@bloc
class FaaBloc {
  faa: string = 'this is faa'
}

@bloc
class BarBloc {
  constructor(
    @inject public fooBloc: FooBloc
  ) {}
}

const ShowFoo: FC = () => {
  const fooBloc = useBloc(FooBloc)
  return (
    <div>
      {fooBloc.foo}
    </div>
  )
}

const ShowFaa: FC = () => {
  const faaBloc = useBloc(FaaBloc)
  return (
    <div>
      {faaBloc.faa}
    </div>
  )
}

const ShowBar: FC = () => {
  const barBloc = useBloc(BarBloc)
  return (
    <div>
      {barBloc.fooBloc.foo}
    </div>
  )
}


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

import * as TestRenderer from 'react-test-renderer'
import {FC} from 'react'
import * as React from 'react'
import {bloc, inject, Provider, useBloc} from '..'


@bloc
class FooBloc {
  foo: string = 'this is foo'
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


it('provider with use', function () {
  class Container extends React.Component<{}, any> {
    state = {
      bloc: new FooBloc()
    }
    
    changeUse() {
      const anotherFooBloc = new FooBloc()
      anotherFooBloc.foo = 'bbb'
      this.setState({
        bloc: anotherFooBloc
      })
    }
    
    render() {
      return (
        <Provider of={FooBloc} use={this.state.bloc}>
          <ShowFoo />
        </Provider>
      )
    }
  }
  
  const testBloc = new FooBloc()
  testBloc.foo = 'bbb'
  const renderer = TestRenderer.create(
    <Container/>
  )
  expect(renderer.toJSON()).toMatchSnapshot()
  renderer.root.instance.changeUse()
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

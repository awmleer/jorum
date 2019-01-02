import * as TestRenderer from 'react-test-renderer'
import {ProviderFC} from '../context/provider'
import {FC} from 'react'
import {bloc} from '../bloc'
import * as React from 'react'
import {useBloc} from '..'
import {inject} from '../di/inject'


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
    <ProviderFC of={FooBloc}>
      <ShowFoo />
    </ProviderFC>
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
        <ProviderFC of={FooBloc} use={this.state.bloc}>
          <ShowFoo />
        </ProviderFC>
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
    <ProviderFC of={FooBloc}>
      <ProviderFC of={BarBloc}>
        <ShowBar />
      </ProviderFC>
    </ProviderFC>
  )
  expect(renderer.toJSON()).toMatchSnapshot()
})

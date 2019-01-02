import * as TestRenderer from 'react-test-renderer'
import {ProviderFC} from '../context/provider'
import {FC} from 'react'
import {injectable} from '../di/injectable'
import {bloc} from '../bloc'
import * as React from 'react'
import {useBloc} from '..'

@injectable
@bloc
class TestBloc {
  test: string = 'aaa'
}

const TestData: FC = () => {
  const testBloc = useBloc(TestBloc)
  return (
    <div>
      {testBloc.test}
    </div>
  )
}

it('provider initialize', function () {
  const renderer = TestRenderer.create(
    <ProviderFC of={TestBloc}>
      <TestData />
    </ProviderFC>
  )
  expect(renderer.toJSON()).toMatchSnapshot()
})

it('provider with use', function () {
  class Container extends React.Component<{}, any> {
    state = {
      bloc: new TestBloc()
    }
    
    changeUse() {
      const anotherTestBloc = new TestBloc()
      anotherTestBloc.test = 'bbb'
      this.setState({
        bloc: anotherTestBloc
      })
    }
    
    render() {
      return (
        <ProviderFC of={TestBloc} use={this.state.bloc}>
          <TestData />
        </ProviderFC>
      )
    }
  }
  
  const testBloc = new TestBloc()
  testBloc.test = 'bbb'
  const renderer = TestRenderer.create(
    <Container/>
  )
  expect(renderer.toJSON()).toMatchSnapshot()
  renderer.root.instance.changeUse()
  expect(renderer.toJSON()).toMatchSnapshot()
});


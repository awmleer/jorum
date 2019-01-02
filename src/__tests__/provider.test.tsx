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
  const testBloc = new TestBloc()
  testBloc.test = 'bbb'
  const renderer = TestRenderer.create(
    <ProviderFC of={TestBloc} use={testBloc}>
      <TestData />
    </ProviderFC>
  )
  expect(renderer.toJSON()).toMatchSnapshot()
});

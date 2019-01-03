import * as TestRenderer from 'react-test-renderer'
import * as React from 'react'
import {bloc, Consumer, Provider, Subscribe, suspense, useBloc, useStream} from '..'
import {BehaviorSubject} from 'rxjs'
import {sleep} from './utils'
import {FC} from 'react'


@bloc
class BehaviorSubjectBloc {
  data$ = new BehaviorSubject('this is data')
}

it('subscribe component', function () {
  const renderer = TestRenderer.create(
    <Provider of={BehaviorSubjectBloc}>
      <Consumer of={BehaviorSubjectBloc}>
        {(bloc) => (
          <Subscribe to={bloc.data$}>
            {data => (
              <div>
                {data}
              </div>
            )}
          </Subscribe>
        )}
      </Consumer>
    </Provider>
  )
  expect(renderer.toJSON()).toMatchSnapshot()
})


it('useStream HOC with suspense and no initialValue', async function () {
  const App = suspense(() => {
    const bloc = useBloc(BehaviorSubjectBloc)
    const data = useStream(bloc.data$)
    return (
      <div>
        {data}
      </div>
    )
  })
  
  const renderer = TestRenderer.create(
    <Provider of={BehaviorSubjectBloc}>
      <App />
    </Provider>
  )
  
  await sleep(300)
  expect(renderer.toJSON()).toMatchSnapshot()
})

it('useStream HOC without suspense and with initialValue', async function () {
  const App: FC = () => {
    const bloc = useBloc(BehaviorSubjectBloc)
    const data = useStream(bloc.data$, 'this is initial value')
    return (
      <div>
        {data}
      </div>
    )
  }
  
  const renderer = TestRenderer.create(
    <Provider of={BehaviorSubjectBloc}>
      <App />
    </Provider>
  )
  
  expect(renderer.toJSON()).toMatchSnapshot()
  await sleep(300)
  expect(renderer.toJSON()).toMatchSnapshot()
})


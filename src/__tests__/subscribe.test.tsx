import * as TestRenderer from 'react-test-renderer'
import * as React from 'react'
import {bloc, Consumer, Provider, Subscribe, suspense, useBloc, useObservable, useStream} from '..'
import {BehaviorSubject, Observable} from 'rxjs'
import {sleep} from './utils'
import {FC, useEffect, useState} from 'react'


@bloc
class BehaviorSubjectBloc {
  data$ = new BehaviorSubject('this is data')
  anotherData$ = new BehaviorSubject('this is another data')
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
  renderer.unmount()
})

it('subscribe component with changed stream', async function () {
  const Container: FC = () => {
    const bloc = useBloc(BehaviorSubjectBloc)
    const [stream$, setStream$] = useState(bloc.data$)
    useEffect(() => {
      setTimeout(() => {
        setStream$(bloc.anotherData$)
      }, 400)
    }, [])
    return (
      <Subscribe to={stream$}>
        {data => (
          <div>
            {data}
          </div>
        )}
      </Subscribe>
    )
  }
  
  const renderer = TestRenderer.create(
    <Provider of={BehaviorSubjectBloc}>
      <Container />
    </Provider>
  )
  
  await sleep(200)
  expect(renderer.toJSON()).toMatchSnapshot()
  
  await sleep(400)
  expect(renderer.toJSON()).toMatchSnapshot()
  renderer.unmount()
})


it('useObservable hook with suspense and no initialValue', async function () {
  const App = suspense(() => {
    const bloc = useBloc(BehaviorSubjectBloc)
    const data = useObservable(bloc.data$)
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
  
  await sleep(200)
  expect(renderer.toJSON()).toMatchSnapshot()
  renderer.unmount()
})


it('useStream hook with suspense and no initialValue', async function () {
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
  
  await sleep(200)
  expect(renderer.toJSON()).toMatchSnapshot()
  renderer.unmount()
})


it('useStream hook without suspense and with initialValue', async function () {
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
  await sleep(200)
  expect(renderer.toJSON()).toMatchSnapshot()
  renderer.unmount()
})


it('useStream hook with changed stream', async function () {
  const App = suspense<{stream$: Observable<any>}>((props) => {
    const data = useStream(props.stream$)
    return (
      <div>
        {data}
      </div>
    )
  })
  
  const Container: FC = () => {
    const bloc = useBloc(BehaviorSubjectBloc)
    const [stream$, setStream$] = useState(bloc.data$)
    useEffect(() => {
      setTimeout(() => {
        setStream$(bloc.anotherData$)
      }, 200)
    }, [])
    return (
      <App stream$={stream$}/>
    )
  }
  
  const renderer = TestRenderer.create(
    <Provider of={BehaviorSubjectBloc}>
      <Container />
    </Provider>
  )
  
  await sleep(200)
  expect(renderer.toJSON()).toMatchSnapshot()
  
  await sleep(400)
  expect(renderer.toJSON()).toMatchSnapshot()
  renderer.unmount()
})


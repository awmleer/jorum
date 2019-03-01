import * as TestRenderer from 'react-test-renderer'
import * as React from 'react'
import {bloc, Consumer, Provider, Subscribe, suspense, useBloc, useStream} from '..'
import {BehaviorSubject, interval, Observable, Subject} from 'rxjs'
import {sleep} from './utils'
import {FC, useEffect, useState} from 'react'
import {useSubscription} from '../subscribe'
import {act} from 'react-dom/test-utils'
import {render} from 'react-testing-library'
import 'jest-dom/extend-expect'


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
        act(() => {
          setStream$(bloc.anotherData$)
        })
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


it('useStream hook with suspense and no initialValue', async function () {
  const App = suspense(() => {
    const bloc = useBloc(BehaviorSubjectBloc)
    const data = useStream(bloc.data$)
    return () => {
      return (
        <div>
          {data}
        </div>
      )
    }
  })
  
  const renderer = render(
    <Provider of={BehaviorSubjectBloc}>
      <App />
    </Provider>
  )
  
  expect(renderer.asFragment()).toMatchSnapshot()
  renderer.unmount()
})


it('useStream hook without suspense and with initialValue', async function () {
  const App: FC = () => {
    const bloc = useBloc(BehaviorSubjectBloc)
    const data = useStream(bloc.data$, 'this is initial value')
    expect(data).toMatchSnapshot()
    return (
      <div>
        {data}
      </div>
    )
  }

  const renderer = render(
    <Provider of={BehaviorSubjectBloc}>
      <App />
    </Provider>
  )

  expect(renderer.asFragment()).toMatchSnapshot()
  renderer.unmount()
})


it('useStream hook with changed stream', async function () {
  const App = suspense<{stream$: Observable<any>}>((props) => {
    const data = useStream(props.stream$)
    return () => {
      return (
        <div>
          {data}
        </div>
      )
    }
  })
  
  const Container: FC = () => {
    const bloc = useBloc(BehaviorSubjectBloc)
    const [stream$, setStream$] = useState(bloc.data$)
    useEffect(() => {
      setTimeout(() => {
        act(() => {
          setStream$(bloc.anotherData$)
        })
      }, 100)
    }, [])
    return (
      <App stream$={stream$}/>
    )
  }
  
  const renderer = render(
    <Provider of={BehaviorSubjectBloc}>
      <Container />
    </Provider>
  )
  
  expect(renderer.asFragment()).toMatchSnapshot()
  
  await sleep(200)
  expect(renderer.asFragment()).toMatchSnapshot()
  renderer.unmount()
})


it('useSubscription', async function() {
  const foo$ = new Subject()
  const App = suspense(() => {
    const [changed, setChanged] = useState(false)
    useSubscription(foo$, () => {
      act(() => {
        setChanged(true)
      })
    })
    return () => {
      return (
        <div>
          {changed ? 'yes' : 'no'}
        </div>
      )
    }
  })

  const renderer = render(
    <App />
  )
  await sleep(100)
  foo$.next(1)
  await sleep(100)
  expect(renderer.asFragment()).toMatchSnapshot()
  renderer.unmount()
})


it('useSubscription with inputs comparision', async function() {
  const mockHandlers: any[] = []
  mockHandlers[0] = jest.fn(() => null)
  mockHandlers[1] = jest.fn(() => null)

  const foo$ = new Subject()
  const App: FC = () => {
    const [handlerIndex, setHandlerIndex] = useState(0)

    useEffect(() => {
      setTimeout(() => {
        act(() => {
          setHandlerIndex(1)
        })
      }, 200)
    }, [])
    useSubscription(foo$, (value) => {
      mockHandlers[handlerIndex](value)
    }, [handlerIndex])
    return null
  }

  const renderer = render(
    <App />
  )
  await sleep(100)
  foo$.next(1)
  await sleep(200)
  foo$.next(2)
  await sleep(100)
  expect(mockHandlers[0].mock.calls.length).toBe(1)
  expect(mockHandlers[1].mock.calls.length).toBe(1)
  renderer.unmount()
})


it('multiple useStream hooks', async function () {
  const App = suspense(() => {
    const bloc = useBloc(BehaviorSubjectBloc)
    const data = useStream(bloc.data$)
    const anotherData = useStream(bloc.anotherData$)
    
    return () => {
      return (
        <div>
          {data}
          <br/>
          {anotherData}
        </div>
      )
    }
  })
  
  const renderer = render(
    <Provider of={BehaviorSubjectBloc}>
      <App />
    </Provider>
  )
  
  expect(renderer.asFragment()).toMatchSnapshot()
  renderer.unmount()
})

it('useEffect in innerComponent should be called only once', async function () {
  const mockFn = jest.fn(() => null)
  
  const App = suspense(() => {
    const bloc = useBloc(BehaviorSubjectBloc)
    const data = useStream(bloc.data$)
    
    return () => {
      expect(data).not.toBeUndefined()
      useEffect(() => {
        mockFn()
      }, [])
      return (
        <div>
          {data}
        </div>
      )
    }
  })
  
  const renderer = render(
    <Provider of={BehaviorSubjectBloc}>
      <App />
    </Provider>
  )
  
  await sleep(100)
  
  expect(mockFn.mock.calls.length).toBe(1)
  renderer.unmount()
})

it('multiple suspense component', async function() {
  interface Props {
    text: string
  }
  const App = suspense<Props>(function C(props) {
    return () => {
      const [s, setS] = useState(1)
      useEffect(() => {
        setTimeout(() => {
          setS(2)
        }, 50)
      }, [])
      return (
        <div>{props.text}</div>
      )
    }
  })
  
  const renderer = render(
    <>
      <App text="a" />
      <App text="b" />
    </>
  )
  
  await sleep(100)
  expect(renderer.asFragment()).toMatchSnapshot()
})

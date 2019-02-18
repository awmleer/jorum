import * as React from 'react'
import {BehaviorSubject, interval} from 'rxjs'
import {bloc, checkStream, effect, Provider, suspense, useBloc, useStream} from '..'
import {sleep} from './utils'
import {map} from 'rxjs/operators'
import {render} from 'react-testing-library'

it('effect is executed', async function () {
  @bloc
  class TestBloc {
    readonly data$ = interval(50)
    readonly test$ = new BehaviorSubject('no')
    
    @effect
    private readonly handleDataChange$ = this.data$.pipe(
      map(() => {
        this.test$.next('yes')
      })
    )
  }
  
  const Show = suspense(() => {
    const testBloc = useBloc(TestBloc)
    const test = useStream(testBloc.test$)
    checkStream()
    return (
      <div>
        {test}
      </div>
    )
  })
  
  const renderer = render(
    <Provider of={TestBloc}>
      <Show />
    </Provider>
  )
  
  await sleep(100)
  expect(renderer.asFragment()).toMatchSnapshot()
  renderer.unmount()
})

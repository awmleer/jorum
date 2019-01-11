import * as TestRenderer from 'react-test-renderer'
import * as React from 'react'
import {BehaviorSubject, interval} from 'rxjs'
import {bloc, effect, Provider, suspense, useBloc, useStream} from '..'
import {sleep} from './utils'
import {map} from 'rxjs/operators'

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
    return (
      <div>
        {test}
      </div>
    )
  })
  
  const renderer = TestRenderer.create(
    <Provider of={TestBloc}>
      <Show />
    </Provider>
  )
  
  await sleep(100)
  expect(renderer.toJSON()).toMatchSnapshot()
  renderer.unmount()
})

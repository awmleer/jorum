import * as TestRenderer from 'react-test-renderer'
import * as React from 'react'
import {bloc} from '../bloc'
import {BehaviorSubject, interval} from 'rxjs'
import {effect} from '../effect'
import {Provider, useBloc, useStream} from '..'
import {FC} from 'react'
import {sleep} from './utils'

it('effect is executed', async function () {
  @bloc
  class TestBloc {
    data$ = interval(50)
    test$ = new BehaviorSubject('no')
    @effect(this.data$)
    handleDataChange(value: number) {
      this.test$.next('yes')
    }
  }
  
  const Show: FC = () => {
    const testBloc = useBloc(TestBloc)
    const test = useStream(testBloc.test$)
    return (
      <div>
        {test}
      </div>
    )
  }
  
  const renderer = TestRenderer.create(
    <Provider of={TestBloc}>
      <Show />
    </Provider>
  )
  
  await sleep(100)
  expect(renderer.toJSON()).toMatchSnapshot()
  renderer.unmount()
})

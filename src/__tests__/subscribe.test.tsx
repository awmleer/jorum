import * as TestRenderer from 'react-test-renderer'
import * as React from 'react'
import {bloc, Consumer, Provider, Subscribe} from '..'
import {BehaviorSubject} from 'rxjs'


@bloc
class BehaviorSubjectBloc {
  data$ = new BehaviorSubject('this is initial value')
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

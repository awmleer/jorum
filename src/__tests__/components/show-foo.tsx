import * as React from 'react'
import {FC} from 'react'
import {useBloc} from '../..'
import {BarBloc, FaaBloc, FooBloc} from '../blocs/foo.bloc'

export const ShowFoo: FC = () => {
  const fooBloc = useBloc(FooBloc)
  return (
    <div>
      {fooBloc.foo}
    </div>
  )
}

export const ShowFaa: FC = () => {
  const faaBloc = useBloc(FaaBloc)
  return (
    <div>
      {faaBloc.faa}
    </div>
  )
}

export const ShowBar: FC = () => {
  const barBloc = useBloc(BarBloc)
  return (
    <div>
      {barBloc.fooBloc.foo}
    </div>
  )
}

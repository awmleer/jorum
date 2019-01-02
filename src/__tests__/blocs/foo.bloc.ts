import {bloc, inject} from '../..'

@bloc
export class FooBloc {
  foo: string = 'this is foo'
}

@bloc
export class FaaBloc {
  constructor(
    public faa: string = 'this is faa'
  ) {}
}

@bloc
export class BarBloc {
  constructor(
    @inject public fooBloc: FooBloc
  ) {}
}


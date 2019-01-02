import {bloc, Bloc} from '../'
import {injector} from '../di/injector'
import {injectable} from '../di/injectable'

it('should register to injector', function () {
  @injectable
  @bloc
  class A {
    test: string = 'aaa'
  }
  
  // const x = injector.resolve('123')
  // const y = new x
  // expect(Reflect.has(y, 'test')).toBe(true)
  // const B = injector.resolve(A)
  // expect(A).toBe(B)
  
  // expect(x).toBe(A)
})

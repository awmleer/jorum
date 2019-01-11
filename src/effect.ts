import {Subscribable} from 'rxjs'

export const effectsMetadataKey = Symbol()

export interface Effect<T = any> {
  propertyKey: string
  stream$: Subscribable<T>
}

export function effect<T>(stream$: Subscribable<T>) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let effects: Effect[] = Reflect.getMetadata(effectsMetadataKey, target) || []
    effects.push({
      propertyKey,
      stream$
    })
    Reflect.defineMetadata(effectsMetadataKey, effects, target)
  }
}

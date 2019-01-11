export const effectsMetadataKey = Symbol()

export function effect<T>(target: any, propertyKey: string) {
  const effects: string[] = Reflect.getMetadata(effectsMetadataKey, target) || []
  effects.push(propertyKey)
  Reflect.defineMetadata(effectsMetadataKey, effects, target)
}

class Injector {
  private readonly injectableMetadataSymbol = Symbol('injectableId')
  private injectables: any = {}
  register(Injectable: any) {
    const symbol = Symbol()
    Reflect.defineMetadata(this.injectableMetadataSymbol, symbol, Injectable)
    this.injectables[symbol] = Injectable
    // this.map[typeof Injectable] = Injectable
  }
  resolve(target: any): any {
    const symbol = Reflect.getMetadata(this.injectableMetadataSymbol, target)
    return this.injectables[symbol]
  }
}

export const injector = new Injector()

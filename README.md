#  Jorum

![GitHub](https://img.shields.io/github/license/awmleer/jorum.svg)
[![npm](https://img.shields.io/npm/v/jorum.svg)](https://www.npmjs.com/package/jorum)
![npm](https://img.shields.io/npm/dw/jorum.svg)
![GitHub repo size in bytes](https://img.shields.io/github/repo-size/awmleer/jorum.svg)

Make your react application reactive using rxjs.

## Feature

- Lightweight.
- Strongly typed.
- No magic, just straightforward streams.

## Installation

```bash
yarn add rxjs jorum
# or
npm install rxjs jorum --save
```

## Guide

### Define a BLoC

BLoC stands for "Business Logic Component".

```typescript
export class CounterBloc extends Bloc {
  constructor() {
    setInterval(() => {
      this.count$.next(this.count$.value + 1)
      this.countAnother$.next(this.countAnother$.value + 2)
    }, 1000)
  }

  count$ = new BehaviorSubject(0)

  countAnother$ = new BehaviorSubject(10)

  shouldShowResetButton$ = this.count$
    .pipe(map(val => val > 10))
    .pipe(distinctUntilChanged())

  resetCounter = () => {
    this.count$.next(0)
  }
}
```

### Provider

Basic usage:

```tsx
<Provider of={CounterBloc}>
  {/*...*/}
</Provider>
```

Pass args to BLoC constructor:

```tsx
<Provider of={CounterBloc} args={[13]}>
  {/*...*/}
</Provider>
```

Use the given BLoC instance:

```tsx
<Provider of={CounterBloc} use={counterBloc}>
  {/*...*/}
</Provider>
```

### Consumer

```tsx
<Consumer of={CounterBloc}>
  {(counterBloc) => (
    /*...*/
  )}
</Consumer>
```

### Subscribe

Subscribe to a single observable:

```tsx
<Subscribe to={counterBloc.shouldShowResetButton$}>
  {shouldShowResetButton => (
    shouldShowResetButton && <button onClick={counterBloc.resetCounter}>reset</button>
  )}
</Subscribe>
```

Subscribe to multiple observables:

```tsx
<Subscribe to={[counterBloc.count$, counterBloc.countAnother$]}>
  {(count, countAnother) => (
    <div>
      <p>{count}</p>
      <p>{countAnother}</p>
    </div>
  )}
</Subscribe>
```

## Example

Full example is available [here](https://github.com/awmleer/jorum/tree/master/example).

## Development

### Build

```bash
yarn install
yarn build
```

### Run example app

```bash
yarn install
yarn build
cd example
yarn install
yarn start
```


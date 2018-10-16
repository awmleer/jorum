#  jorum

![GitHub](https://img.shields.io/github/license/awmleer/jorum.svg)
[![npm](https://img.shields.io/npm/v/jorum.svg)](https://www.npmjs.com/package/jorum)
![npm](https://img.shields.io/npm/dw/jorum.svg)
![GitHub repo size in bytes](https://img.shields.io/github/repo-size/awmleer/jorum.svg)

Make your react application reactive using rxjs.

**Warning: This framework is still in development.**

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
export class CounterBloc {
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

### Instantiate a BLoC

```typescript
const counterBloc = new CounterBloc()
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


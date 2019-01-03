Pass args to BLoC constructor:

```tsx
<Provider of={CounterBloc} args={[13]}>
  {/*...*/}
</Provider>
```



Use the `withProvider` HOC:

```jsx
const Counter = withProvider({
  of: CounterBloc,
  args: [13]
})(() => {
  return (
    /*...*/
  )
})
```

### Consumer

Use `Consumer` component with render props pattern:

```tsx
<Consumer of={CounterBloc}>
  {(counterBloc) => (
    /*...*/
  )}
</Consumer>
```

Or use custom hook:

```js
const counterBloc = useBloc(CounterBloc)
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

Or use custom hook:

```js
const count = useStream(counterBloc.count$)
```

## 
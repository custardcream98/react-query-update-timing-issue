import { createContext, useContext, useMemo, useState } from 'react'

const CounterContext = createContext<{
  count: number
  setCount: (count: number) => void
} | null>(null)

const useCounter = () => {
  const context = useContext(CounterContext)
  if (!context) {
    throw new Error('useCounter must be used within a CounterProvider')
  }
  return context
}

export const Counter = ({ children }: React.PropsWithChildren) => {
  const [count, setCount] = useState(0)

  return (
    <CounterContext.Provider value={useMemo(() => ({ count, setCount }), [count, setCount])}>
      <div>
        {children}
        <p>Count: {count}</p>
      </div>
    </CounterContext.Provider>
  )
}

const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { count, setCount } = useCounter()

  return (
    <button onClick={() => setCount(count + 1)} {...props}>
      카운터 증가
    </button>
  )
}

Counter.Button = Button

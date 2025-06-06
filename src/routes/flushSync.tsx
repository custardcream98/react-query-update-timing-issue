import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { flushSync } from 'react-dom'

export const Route = createFileRoute('/flushSync')({
  component: ReactStateTest,
})

function ReactStateTest() {
  const [count, setCount] = useState(0)
  const [isPending, setIsPending] = useState(false)

  return (
    <div className="p-2">
      <div>
        <button
          className="bg-blue-500 text-white p-2 rounded-md disabled:bg-gray-300"
          disabled={isPending}
          onClick={() => {
            flushSync(() => {
              setIsPending(true)
            })
            setTimeout(() => {
              setCount(prev => ++prev)
              setIsPending(false)
            }, 500)
          }}
        >
          Click me
        </button>
        <p>Count: {count}</p>
      </div>
    </div>
  )
}

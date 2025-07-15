import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

const getTimestamp = () => `[${performance.now().toFixed(4)}ms]`

const fakeApi = () => {
  console.log(`%c🚀 API CALL ${getTimestamp()}%c`, logStyles.api, logStyles.timestamp)
  return new Promise(res => setTimeout(res, 300))
}

const useReRenderLogger = () => {
  const isMountedRef = useRef(false)
  const renderCountRef = useRef(0)

  useEffect(() => {
    isMountedRef.current = true
  }, [])

  if (isMountedRef.current) {
    renderCountRef.current++
    console.log(`%c🔄 RE-RENDER #${renderCountRef.current} ${getTimestamp()}`, logStyles.render)
  }
}

export const Demo = () => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const mutation = useMutation({ mutationFn: fakeApi })

  useReRenderLogger()

  return (
    <div>
      <p>콘솔 로그를 확인해주세요.</p>
      <div>
        <button ref={buttonRef} disabled={mutation.isPending} onClick={() => mutation.mutate()}>
          {mutation.isPending ? '🔄 Loading...' : '🚀 Click me'}
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            console.group(`%c⚡ TRIPLE CLICK DEMO ${getTimestamp()}`, logStyles.click)
            console.log(`%c📍 onClick Start`, logStyles.click)

            // ① 첫 번째 클릭: 바로 mutate
            console.log(`%c1️⃣ 첫 번째 클릭 (동기 실행)`, logStyles.click)
            buttonRef.current?.click()

            // ② 같은 tick 내에서 micro-task로 두 번째 클릭 시도
            queueMicrotask(() => {
              console.log(
                `%c2️⃣ 두 번째 클릭 (마이크로태스크) ${getTimestamp()}%c\n   button.disabled: ${
                  buttonRef.current?.disabled
                }`,
                logStyles.microtask,
                logStyles.timestamp,
              )
              buttonRef.current?.click()
            })

            // ③ macro-task로 세 번째 클릭 시도
            setTimeout(() => {
              console.log(
                `%c3️⃣ 세 번째 클릭 (매크로태스크) ${getTimestamp()}%c\n   button.disabled: ${
                  buttonRef.current?.disabled
                }`,
                logStyles.macrotask,
                logStyles.timestamp,
              )
              buttonRef.current?.click()

              console.groupCollapsed(`%c💡 React Query 타이밍 원리 설명`, 'color: #6366f1; font-weight: bold;')
              console.log('• React Query는 내부적으로 notifyManager에서 setTimeout(..., 0)을 사용해 배치 처리')
              console.log('• 마이크로태스크가 React Query의 매크로태스크 notification보다 먼저 실행됨')
              console.log(
                '• 즉, 실제로 사용자의 버튼 클릭과 매크로태스크의 notification 사이 시간 갭으로 인해 중복 mutation이 발생할 수 있음',
              )
              console.log(`• 참고: https://tanstack.com/query/latest/docs/reference/
             notifyManager#:~:text=By%20default%2C%20the%20batch%20is%20run%20with%20a%20setTi
             meout%2C`)
              console.groupEnd()

              console.groupEnd() // Close triple click demo group
            }, 0)

            console.log(`%c📍 onClick End`, logStyles.click)
          }}
        >
          ⚡ Trigger Triple Click
        </button>
      </div>

      <p>Triple Click 핵심 코드</p>
      <pre>
        <code>{`
const tripleClick = () => {
  // ① 첫 번째 클릭: 바로 mutate
  buttonRef.current?.click()

  // ② 같은 tick 내에서 micro-task로 두 번째 클릭 시도
  queueMicrotask(() => {
    buttonRef.current?.click()
  })

  // ③ macro-task로 세 번째 클릭 시도
  setTimeout(() => {
    buttonRef.current?.click()
  }, 0)
}
`}</code>
      </pre>
    </div>
  )
}

const logStyles = {
  api: 'color: #007acc; font-weight: bold; background: rgba(0, 122, 204, 0.1); padding: 2px 4px; border-radius: 3px;',
  render:
    'color: #22c55e; font-weight: bold; background: rgba(34, 197, 94, 0.1); padding: 2px 4px; border-radius: 3px;',
  click:
    'color: #f97316; font-weight: bold; background: rgba(249, 115, 22, 0.1); padding: 2px 4px; border-radius: 3px;',
  microtask:
    'color: #8b5cf6; font-weight: bold; background: rgba(139, 92, 246, 0.1); padding: 2px 4px; border-radius: 3px;',
  macrotask:
    'color: #ef4444; font-weight: bold; background: rgba(239, 68, 68, 0.1); padding: 2px 4px; border-radius: 3px;',
  timestamp: 'color: #6b7280; font-size: 11px;',
}

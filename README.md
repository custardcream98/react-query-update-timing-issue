# React Query Update Timing Issue

[데모 링크](https://custardcream98.github.io/react-query-update-timing-issue/)

## 문제 상황

- React Query는 내부적으로 `notifyManager`에서 `setTimeout(..., 0)`을 사용해 배치 처리
- 즉, 마이크로태스크가 React Query의 매크로태스크 notification보다 먼저 실행됨
- 이 사이 시간 갭으로 인해 드물게 중복 mutation이 발생할 수 있음

## 참고

- [React Query 공식 문서](https://tanstack.com/query/latest/docs/reference/notifyManager#:~:text=By%20default%2C%20the%20batch%20is%20run%20with%20a%20setTimeout%2C)

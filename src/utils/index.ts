export function throttle<T extends (...args: any[]) => any>(
  this: any,
  func: T,
  delay: number,
  ...args: Parameters<T>
) {
  // 这里可以直接调用传进来的函数
  let timeoutId: any
  return () => {
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        // eslint-disable-next-line prefer-rest-params
        func.apply(self, args)
        timeoutId = null
      }, delay)
    }
  }
}

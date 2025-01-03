// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const debounce = async (fn: Function, _wait: number) => await fn()

export default debounce

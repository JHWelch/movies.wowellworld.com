export default abstract class Factory<T extends object> {
  protected abstract state: T

  public build = (overrides?: Partial<T>): T => ({
    ...this.state,
    ...overrides,
  })
}

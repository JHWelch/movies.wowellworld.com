export default abstract class Factory<Constructor, Model> {
  protected abstract _state: Constructor
  protected abstract _make (): Model

  constructor (state?: Partial<Constructor>) {
    if (state) {
      this.state(state)
    }
  }

  state (state: Partial<Constructor>): this {
    this._state = { ...this._state, ...state }

    return this
  }

  make (state?: Partial<Constructor>): Model  {
    if (state) {
      this.state(state)
    }

    return this._make()
  }
}

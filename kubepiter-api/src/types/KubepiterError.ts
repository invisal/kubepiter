class KubepiterErrorNoPermission extends Error {
  public readonly httpCode: number

  constructor () {
    super('You have no permission')
    this.name = 'No permission'
    this.httpCode = 500
  }
}

const KubepiterError = Object.freeze({
  NoPermission: KubepiterErrorNoPermission
})

export default KubepiterError

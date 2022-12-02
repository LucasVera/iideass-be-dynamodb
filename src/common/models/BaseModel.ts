export default abstract class Model {
  toDto = (): object => {
    throw new Error('Models must implement "toDto" method')
  }
}

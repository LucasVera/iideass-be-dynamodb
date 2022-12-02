export default abstract class Repository {
  save(_dto: any): any {
    throw new Error('Repositories must implement "save" method')
  }

  findAll(_filterDto: any): any {
    throw new Error('Repositories must implement "findAll" method')
  }
}

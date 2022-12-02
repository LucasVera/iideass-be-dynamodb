export default abstract class Repository {
  save(_entityDto: any): any {
    throw new Error('Repositories must implement "save" method')
  }

  findAll(_filterAllDto: any): any {
    throw new Error('Repositories must implement "findAll" method')
  }

  findByPk(_findByPkDto: any): any {
    throw new Error('Repositories must implement "findOne" method')
  }

  updateOne(_updateOneDto: any): any {
    throw new Error('Repositories must implement "updateOne" method')
  }

  deleteOne(_deleteOneDto: any): any {
    throw new Error('Repositories must implement "deleteOne" method')
  }
}

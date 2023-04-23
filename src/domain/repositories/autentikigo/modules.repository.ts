import {IModule, Module} from '../../entities'

export interface IModuleRepository {
  create(module: IModule): Promise<Module>
  findAll(filters: any, limit: number, page: number): Promise<Module[]>
  findById(id: string): Promise<Module>
  updateById(id: string, moduleToUpdate: Partial<IModule>): Promise<Module>
  replaceById(id: string, moduleToUpdate: IModule): Promise<Module>
  deleteById(id: string): Promise<void>
}

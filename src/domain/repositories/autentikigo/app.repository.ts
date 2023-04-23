import {App, IApp} from '../../entities'

export interface IAppRepository {
  create(app: IApp): Promise<App>
  findAll(filters: any, limit: number, page: number): Promise<App[]>
  findById(id: string): Promise<App>
  updateById(id: string, appToUpdate: Partial<IApp>): Promise<App>
  replaceById(id: string, appToUpdate: IApp): Promise<App>
  deleteById(id: string): Promise<void>
}

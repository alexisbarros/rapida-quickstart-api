import {IPermission, Permission} from '../../entities'

export interface IPermissionRepository {
  create(permission: IPermission): Promise<Permission>
  findAll(filters: any, limit: number, page: number): Promise<Permission[]>
  findById(id: string): Promise<Permission>
  updateById(id: string, permissionToUpdate: Partial<IPermission>): Promise<Permission>
  replaceById(id: string, permissionToUpdate: IPermission): Promise<Permission>
  deleteById(id: string): Promise<void>
}

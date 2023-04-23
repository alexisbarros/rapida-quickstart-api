import {IPermissionGroup, PermissionGroup} from '../../entities'

export interface IPermissionGroupRepository {
  create(permissionGroup: IPermissionGroup): Promise<PermissionGroup>
  findAll(filters: any, limit: number, page: number): Promise<PermissionGroup[]>
  findById(id: string): Promise<PermissionGroup>
  updateById(id: string, permissionGroupToUpdate: Partial<IPermissionGroup>): Promise<PermissionGroup>
  replaceById(id: string, permissionGroupToUpdate: IPermissionGroup): Promise<PermissionGroup>
  deleteById(id: string): Promise<void>
}

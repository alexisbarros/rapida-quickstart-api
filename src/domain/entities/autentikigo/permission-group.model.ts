import {IApp, IModule} from '.'

export enum MethodsEnum {
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
}

export interface IPermissionGroupPermission {
  module: string | IModule,
  actions: MethodsEnum[],
}

export interface IPermissionGroup {
  _id?: string
  name: string
  description?: string
  app: string | IApp
  permissions: IPermissionGroupPermission[]
  _createdBy: string
  _ownerId: string
}

export class PermissionGroup {
  public _id?: string;
  public name: string;
  public description?: string;
  public app: string | IApp;
  public permissions: IPermissionGroupPermission[];
  public _createdBy: string;
  public _ownerId: string;

  constructor(permissionGroup: IPermissionGroup) {
    this._id = permissionGroup._id;
    this.name = permissionGroup.name;
    this.description = permissionGroup.description;
    this.app = permissionGroup.app;
    this.permissions = permissionGroup.permissions;
    this._createdBy = permissionGroup._createdBy;
    this._ownerId = permissionGroup._ownerId;
  }
}

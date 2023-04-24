import {IPermissionGroup} from './permission-group.model';

export interface IPermission {
  user: string
  permissionGroup: string | IPermissionGroup
  _createdBy: string
  _ownerId: string
}

export class Permission {
  public user: string;
  public permissionGroup: string | IPermissionGroup;
  public _createdBy: string;
  public _ownerId: string;

  constructor(permission: IPermission) {
    this.user = permission.user;
    this.permissionGroup = permission.permissionGroup;
    this._createdBy = permission._createdBy;
    this._ownerId = permission._ownerId;
  }
}

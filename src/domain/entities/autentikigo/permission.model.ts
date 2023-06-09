import {IPermissionGroup} from './permission-group.model';

export interface IPermission {
  _id?: string
  user: string
  permissionGroup: string | IPermissionGroup
  _createdBy: string
  _ownerId: string
}

export class Permission {
  public _id?: string;
  public user: string;
  public permissionGroup: string | IPermissionGroup;
  public _createdBy: string;
  public _ownerId: string;

  constructor(permission: IPermission) {
    this._id = permission._id;
    this.user = permission.user;
    this.permissionGroup = permission.permissionGroup;
    this._createdBy = permission._createdBy;
    this._ownerId = permission._ownerId;
  }
}

import {IPermissionGroup} from './permission-group.model';

export interface IInvitation {
  _id?: string
  email: string
  permissionGroup: string | IPermissionGroup
  disabled?: boolean
  _createdBy: string
  _ownerId: string
}

export class Invitation {
  public _id?: string;
  public email: string;
  public permissionGroup: string | IPermissionGroup;
  public disabled?: boolean
  public _createdBy: string;
  public _ownerId: string;

  constructor(permission: IInvitation) {
    this._id = permission._id;
    this.email = permission.email;
    this.permissionGroup = permission.permissionGroup;
    this.disabled = permission.disabled ?? false;
    this._createdBy = permission._createdBy;
    this._ownerId = permission._ownerId;
  }
}

export interface IUser {
  _id?: string
  email?: string
  phoneNumber?: string
  googleId?: string
  appleId?: string
}

export class User {

  public _id?: string;
  public email?: string;
  public phoneNumber?: string;
  public googleId?: string;
  public appleId?: string;

  constructor(user: IUser) {
    this._id = user._id;
    this.email = user.email;
    this.phoneNumber = user.phoneNumber;
    this.googleId = user.googleId;
    this.appleId = user.appleId;
  }
}

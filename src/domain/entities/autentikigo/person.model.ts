import {IUser} from './user.model'

export interface IPerson {
  _id?: string
  name: string
  uniqueId?: string
  birthday?: number
  gender?: string
  mother?: string
  country?: string
  username?: string
  nickname?: string
  genderIdentity?: string
  userId?: string | IUser
}

export class Person {

  public _id?: string;
  public name: string;
  public uniqueId?: string;
  public birthday?: number;
  public gender?: string;
  public mother?: string;
  public country?: string;
  public username?: string;
  public nickname?: string
  public genderIdentity?: string
  public userId?: string | IUser;

  constructor(person: IPerson) {
    this._id = person._id;
    this.name = person.name;
    this.uniqueId = person.uniqueId;
    this.birthday = person.birthday;
    this.gender = person.gender;
    this.mother = person.mother;
    this.country = person.country;
    this.username = person.username;
    this.nickname = person.nickname;
    this.genderIdentity = person.genderIdentity;
    this.userId = person.userId;
  }
}

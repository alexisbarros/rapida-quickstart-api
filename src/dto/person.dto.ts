import {AnyObject} from '@loopback/repository';
import {AdditionalInfoModel} from '../entities/signup.entity';
import {IPersonFromAPI} from '../interfaces/person.interface';
import {Person} from '../models';

export class PersonDTO implements Person {
  _id?: string | undefined;
  name: string;
  uniqueId: string;
  birthday: Date;
  gender: string;
  mother: string;
  country: string;
  username?: string | undefined;
  nickname?: string | undefined;
  genderIdentity?: string | undefined;

  constructor({dataFromApi, additionalInfo}: {dataFromApi: IPersonFromAPI, additionalInfo: AdditionalInfoModel}) {
    this.name = dataFromApi.name;
    this.uniqueId = dataFromApi.uniqueId;
    this.birthday = dataFromApi.birthday;
    this.gender = dataFromApi.gender;
    this.mother = dataFromApi.mother;
    this.country = dataFromApi.country;
    this.nickname = additionalInfo?.personInfo?.nickname;
    this.genderIdentity = additionalInfo?.personInfo?.genderIdentity;
  }

  getId() {
    return this._id;
  }
  getIdObject(): Object {
    return {_id: this._id};
  }
  toJSON(): Object {
    return {
      _id: this._id,
      name: this.name,
      uniqueId: this.uniqueId,
      birthday: this.birthday,
      gender: this.gender,
      mother: this.mother,
      country: this.country,
      username: this.username,
      nickname: this.nickname,
      genderIdentity: this.genderIdentity,
    }
  }
  toObject(options?: AnyObject): Object {
    return {
      _id: this._id,
      name: this.name,
      uniqueId: this.uniqueId,
      birthday: this.birthday,
      gender: this.gender,
      mother: this.mother,
      country: this.country,
      username: this.username,
      nickname: this.nickname,
      genderIdentity: this.genderIdentity,
    }
  }

}

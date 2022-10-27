import {AnyObject} from '@loopback/repository';
import {AdditionalInfoModel} from '../entities/signup.entity';
import {IBusinessActivityCode, ICompanyFromAPI} from '../interfaces/company.interface';
import {Company} from '../models';

export class CompanyDTO implements Company {
  _id?: string | undefined;
  corporateName: string;
  tradeName: string;
  uniqueId: string;
  birthday: Date;
  email: string;
  responsible: string;
  businessActivityCode: IBusinessActivityCode[];


  constructor({dataFromApi, additionalInfo}: {dataFromApi: ICompanyFromAPI, additionalInfo: AdditionalInfoModel}) {
    this.corporateName = dataFromApi.corporateName;
    this.tradeName = dataFromApi.tradeName;
    this.uniqueId = dataFromApi.uniqueId;
    this.birthday = dataFromApi.birthday;
    this.email = dataFromApi.email;
    this.responsible = dataFromApi.responsible;
    this.businessActivityCode = dataFromApi.businessActivityCode;
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
      corporateName: this.corporateName,
      tradeName: this.tradeName,
      uniqueId: this.uniqueId,
      birthday: this.birthday,
      email: this.email,
      responsible: this.responsible,
      businessActivityCode: this.businessActivityCode,
    }
  }
  toObject(options?: AnyObject): Object {
    return {
      _id: this._id,
      corporateName: this.corporateName,
      tradeName: this.tradeName,
      uniqueId: this.uniqueId,
      birthday: this.birthday,
      email: this.email,
      responsible: this.responsible,
      businessActivityCode: this.businessActivityCode,
    }
  }

}

import {AnyObject} from '@loopback/repository';
import {AdditionalInfoModel} from '../entities/signup.entity';
import {IBusinessActivityCode, ICompanyFromAPI} from '../interfaces/company.interface';
import {Company} from '../models';
import {convertBirthdayStringToDate} from '../utils/date-manipulation-functions';

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
    const birthday = convertBirthdayStringToDate(dataFromApi.inicioAtividade);
    this.corporateName = dataFromApi.razao;
    this.tradeName = dataFromApi.fantasia;
    this.uniqueId = dataFromApi.cnpj.replace(/\D/g, "");
    this.birthday = birthday;
    this.email = dataFromApi.email;
    this.responsible = dataFromApi.responsavel;
    this.businessActivityCode = dataFromApi.cnae;
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

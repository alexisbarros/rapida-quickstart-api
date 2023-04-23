import {IUser} from './user.model'

export interface IBusinessActivityCode {
  divisao: string
  grupo: string
  classe: string
  subclasse: string
  fiscal: string
  descricao: string
}

export interface ICompany {
  _id?: string
  corporateName: string
  tradeName?: string
  uniqueId: string
  birthday: number
  email?: string
  responsible: string
  businessActivityCode: IBusinessActivityCode[]
  userId?: string | IUser
}

export class Company {

  _id?: string;
  corporateName: string;
  tradeName?: string;
  uniqueId: string;
  birthday: number;
  email?: string;
  responsible: string;
  businessActivityCode: IBusinessActivityCode[];
  userId?: string | IUser;

  constructor(company: ICompany) {
    this._id = company._id;
    this.corporateName = company.corporateName;
    this.tradeName = company.tradeName;
    this.uniqueId = company.uniqueId;
    this.birthday = company.birthday;
    this.email = company.email;
    this.responsible = company.responsible;
    this.businessActivityCode = company.businessActivityCode;
    this.userId = company.userId;
  }

}

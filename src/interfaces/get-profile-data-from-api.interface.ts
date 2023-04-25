import {ICompany, IPerson} from '../domain/entities';

export interface IGetPersonProfileDataFromApi {
  execute(uniqueId: string): Promise<IPerson>
}

export interface IGetCompanyProfileDataFromApi {
  execute(uniqueId: string): Promise<ICompany>
}

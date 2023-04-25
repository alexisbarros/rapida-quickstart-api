import {Company} from '../domain/entities';
import {IGetCompanyProfileDataFromApi} from '../interfaces';
import {convertBirthdayStringToDate} from '../utils/date-manipulation-functions';
const fetch = require('node-fetch')

export class GetCompanyDataFromAPI implements IGetCompanyProfileDataFromApi {

  async execute(uniqueId: string): Promise<Company> {

    uniqueId = uniqueId.replace(/\D/g, "");

    const raw = await fetch(`${process.env.API_CPF_CNPJ}/6/${uniqueId}`);
    const response = await raw.json();

    if (!response.status) throw new Error('Company data not found in external API');

    const birthday = convertBirthdayStringToDate(response.inicioAtividade);

    return new Company({
      corporateName: response.razao,
      tradeName: response.fantasia,
      uniqueId: response.cnpj.replace(/\D/g, ""),
      birthday: birthday.getTime(),
      responsible: response.responsavel,
      email: response.email,
      businessActivityCode: response.cnae,
    });
  }

}

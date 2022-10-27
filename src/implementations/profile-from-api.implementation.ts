import {CompanyDTO} from '../dto/company.dto';
import {PersonDTO} from '../dto/person.dto';
import {AdditionalInfoModel} from '../entities/signup.entity';
import {IGetProfile} from '../interfaces/auth.interface';
import {ICompanyFromAPI} from '../interfaces/company.interface';
import {IPersonFromAPI} from '../interfaces/person.interface';
import {convertBirthdayStringToDate} from '../utils/date-manipulation-functions';
import {UserTypesEnum} from '../utils/general-functions';
import {CompanyRepository} from './../repositories/company.repository';
import {PersonRepository} from './../repositories/person.repository';
const fetch = require('node-fetch')

export class ProfileFromAPIImplementation implements IGetProfile {

  async getFullProfileInfo(
    uniqueId: string,
    userType: UserTypesEnum,
    additionalInfo?: AdditionalInfoModel,
    personCompanyRepository?: PersonRepository | CompanyRepository,
    countryId?: string,
  ): Promise<PersonDTO | CompanyDTO | null> {

    uniqueId = uniqueId.replace(/\D/g, "")

    let dataFromApi: IPersonFromAPI | ICompanyFromAPI | null = null

    if (!countryId) countryId = '633eb87dd618a22055bff9c8'

    switch (countryId) {
      case '633eb87dd618a22055bff9c8':
        dataFromApi = await this.brazil(uniqueId, userType)
        break;

      default:
        break;
    }

    if (!dataFromApi) return null

    const profileDTO: PersonDTO | CompanyDTO =
      userType === 'person' ?
        new PersonDTO({dataFromApi: dataFromApi as IPersonFromAPI, additionalInfo: additionalInfo as AdditionalInfoModel}) :
        new CompanyDTO({dataFromApi: dataFromApi as ICompanyFromAPI, additionalInfo: additionalInfo as AdditionalInfoModel})

    if (personCompanyRepository)
      await personCompanyRepository.create({...profileDTO})

    return profileDTO
  }

  private async brazil(uniqueId: string, userType: UserTypesEnum): Promise<IPersonFromAPI | ICompanyFromAPI | null> {
    let dataFromApi = await fetch(`${process.env.API_CPF_CNPJ}/${userType === 'person' ? 2 : 6}/${uniqueId.replace(/\D/g, "")}`)

    dataFromApi = await dataFromApi.json()

    if (!dataFromApi.status) return null

    if (userType === 'person') {
      const birthday = convertBirthdayStringToDate(dataFromApi.nascimento);

      return {
        name: dataFromApi.nome,
        uniqueId: dataFromApi.cpf.replace(/\D/g, ""),
        birthday,
        gender: dataFromApi.genero,
        mother: dataFromApi.mae,
        country: 'br',
      } as IPersonFromAPI
    } else {
      const birthday = convertBirthdayStringToDate(dataFromApi.inicioAtividade);

      return {
        corporateName: dataFromApi.razao,
        tradeName: dataFromApi.fantasia,
        uniqueId: dataFromApi.cnpj.replace(/\D/g, ""),
        birthday,
        responsible: dataFromApi.responsavel,
        email: dataFromApi.email,
        businessActivityCode: dataFromApi.cnae,
      } as ICompanyFromAPI
    }

  }

}

import {Company} from '../../domain/entities';
import {ICompanyRepository} from '../../domain/repositories';
import {GetCompanyDataFromAPI} from '../../services';

export class GetCompanyDataFromApi {

  private repository: ICompanyRepository;

  constructor(companyRepository: ICompanyRepository){
    this.repository = companyRepository;
  }

  public async execute(uniqueId: string): Promise<Company> {
    const company = await new GetCompanyDataFromAPI().execute(uniqueId);
    return await this.repository.create(company);
  }

}

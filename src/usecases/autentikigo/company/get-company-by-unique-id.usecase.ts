import {Company} from '../../../domain/entities';
import {ICompanyRepository} from '../../../domain/repositories';

export class GetCompanyByUniqueId {

  private repository: ICompanyRepository

  constructor(companyRepository: ICompanyRepository){
    this.repository = companyRepository;
  }

  public async execute(uniqueId: string): Promise<Company | null> {
    const companies = await this.repository.findAll({ uniqueId }, 1, 0);
    return companies.length > 0 ? companies[0] : null;
  }

}

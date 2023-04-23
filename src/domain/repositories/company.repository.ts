import {Company, ICompany} from '../entities'

export interface ICompanyRepository {
  create(company: ICompany): Promise<Company>
  findAll(filters: any, limit: number, page: number): Promise<Company[]>
  findById(id: string): Promise<Company>
  updateById(id: string, companyToUpdate: Partial<Company>): Promise<Company>
  replaceById(id: string, companyToUpdate: Company): Promise<Company>
  deleteById(id: string): Promise<void>
}

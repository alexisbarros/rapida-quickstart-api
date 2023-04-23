import {HttpErrors} from '@loopback/rest';
import mongoose from 'mongoose';
import {Company, ICompany} from '../../../domain/entities';
import {ICompanyRepository} from '../../../domain/repositories';
import {getPopulateObjFromSchema} from '../../../utils/general.util';
import {CompanyMongoModel} from './schemas/company.schema';
import {userSchema} from './schemas/user.schema';

if(mongoose.connection.readyState === 0){
  mongoose.connect(
    process.env.MONGO_URL ?? 'mongodb://localhost:27017/kunlatek',
    { dbName: process.env.DB! }
  ).then(() => console.log('Mongoose: Connected to db!!'))
}

export class CompanyRepository implements ICompanyRepository {
  async create(company: ICompany): Promise<Company> {
    const companyCreated = await CompanyMongoModel.create(company);
    return new Company(companyCreated);
  }

  async findAll(filters: any, limit: number, page: number): Promise<Company[]> {
    return (await CompanyMongoModel
      .find(filters)
      .populate(getPopulateObjFromSchema('userId', userSchema))
      .skip(page * limit)
      .limit(limit)
    ).map((data: any) => new Company(data));
  }

  async findById(id: string): Promise<Company> {
    const data = await CompanyMongoModel
      .findById(id)
      .populate(getPopulateObjFromSchema('userId', userSchema))
      .orFail(new HttpErrors[404]('Company not found'));

    return new Company(data);
  }

  async updateById(id: string, companyToUpdate: Partial<Company>): Promise<Company> {
    const data = await CompanyMongoModel
      .findByIdAndUpdate(id, companyToUpdate, {new: true})
      .populate(getPopulateObjFromSchema('userId', userSchema))
      .orFail(new HttpErrors[404]('Company not found'));

    return new Company(data);
  }

  async replaceById(id: string, companyToUpdate: Company): Promise<Company> {
    const data = await CompanyMongoModel
      .findOneAndReplace({_id: id}, companyToUpdate, {new: true})
      .populate(getPopulateObjFromSchema('userId', userSchema))
      .orFail(new HttpErrors[404]('Company not found'));

    return new Company(data);
  }

  async deleteById(id: string): Promise<void> {
    await CompanyMongoModel.findByIdAndDelete(id);
  }


}

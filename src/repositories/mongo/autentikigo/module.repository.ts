import {HttpErrors} from '@loopback/rest';
import mongoose from 'mongoose';
import {IModule, Module} from '../../../domain/entities';
import {IModuleRepository} from '../../../domain/repositories';
import {ModuleMongoModel} from './schemas/module.schema';

if(mongoose.connection.readyState === 0){
  mongoose.connect(
    process.env.MONGO_URL ?? 'mongodb://localhost:27017/kunlatek',
    { dbName: process.env.DB! }
  ).then(() => console.log('Mongoose: Connected to db!!'))
}

export class ModuleRepository implements IModuleRepository {
  async create(module: IModule): Promise<Module> {
    const moduleCreated = await ModuleMongoModel.create(module);
    return new Module(moduleCreated);
  }

  async findAll(filters: any, limit: number, page: number): Promise<Module[]> {
    return (await ModuleMongoModel
      .find(filters)
      .skip(page * limit)
      .limit(limit)
    ).map((data: any) => new Module(data));
  }

  async findById(id: string): Promise<Module> {
    const data = await ModuleMongoModel
      .findById(id)
      .orFail(new HttpErrors[404]('Module not found'));

    return new Module(data);
  }

  async updateById(id: string, moduleToUpdate: Partial<Module>): Promise<Module> {
    const data = await ModuleMongoModel
      .findByIdAndUpdate(id, moduleToUpdate, {new: true})
      .orFail(new HttpErrors[404]('Module not found'));

    return new Module(data);
  }

  async replaceById(id: string, moduleToUpdate: Module): Promise<Module> {
    const data = await ModuleMongoModel
      .findOneAndReplace({_id: id}, moduleToUpdate, {new: true})
      .orFail(new HttpErrors[404]('Module not found'));

    return new Module(data);
  }

  async deleteById(id: string): Promise<void> {
    await ModuleMongoModel.findByIdAndDelete(id);
  }

}

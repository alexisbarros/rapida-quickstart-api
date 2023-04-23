import {HttpErrors} from '@loopback/rest';
import mongoose from 'mongoose';
import {App, IApp} from '../../../domain/entities';
import {IAppRepository} from '../../../domain/repositories';
import {getPopulateObjFromSchema} from '../../../utils/general.util';
import {AppMongoModel} from './schemas/app.schema';
import {moduleSchema} from './schemas/module.schema';

if(mongoose.connection.readyState === 0){
  mongoose.connect(
    process.env.MONGO_URL ?? 'mongodb://localhost:27017/kunlatek',
    { dbName: process.env.DB! }
  ).then(() => console.log('Mongoose: Connected to db!!'))
}

export class AppRepository implements IAppRepository {
  async create(app: IApp): Promise<App> {
    const appCreated = await AppMongoModel.create(app);
    return new App(appCreated);
  }

  async findAll(filters: any, limit: number, page: number): Promise<App[]> {
    return (await AppMongoModel
      .find(filters)
      .populate(getPopulateObjFromSchema('modules', moduleSchema))
      .skip(page * limit)
      .limit(limit)
    ).map((data: any) => new App(data));
  }

  async findById(id: string): Promise<App> {
    const data = await AppMongoModel
      .findById(id)
      .populate(getPopulateObjFromSchema('modules', moduleSchema))
      .orFail(new HttpErrors[404]('App not found'));

    return new App(data);
  }

  async updateById(id: string, appToUpdate: Partial<IApp>): Promise<App> {
    const data = await AppMongoModel
      .findByIdAndUpdate(id, appToUpdate, {new: true})
      .populate(getPopulateObjFromSchema('modules', moduleSchema))
      .orFail(new HttpErrors[404]('App not found'));

    return new App(data);
  }

  async replaceById(id: string, appToUpdate: IApp): Promise<App> {
    const data = await AppMongoModel
      .findOneAndReplace({_id: id}, appToUpdate, {new: true})
      .populate(getPopulateObjFromSchema('modules', moduleSchema))
      .orFail(new HttpErrors[404]('App not found'));

    return new App(data);
  }

  async deleteById(id: string): Promise<void> {
    await AppMongoModel.findByIdAndDelete(id);
  }

}

import {HttpErrors} from '@loopback/rest';
import mongoose from 'mongoose';
import {IPermissionGroup, PermissionGroup, Person} from '../../../domain/entities';
import {IPermissionGroupRepository} from '../../../domain/repositories';
import {getPopulateObjFromSchema} from '../../../utils/general.util';
import {appSchema} from './schemas/app.schema';
import {moduleSchema} from './schemas/module.schema';
import {PermissionGroupMongoModel, permissionGroupSchema} from './schemas/permission-group.schema';

if(mongoose.connection.readyState === 0){
  mongoose.connect(
    process.env.MONGO_URL ?? 'mongodb://localhost:27017/kunlatek',
    { dbName: process.env.DB! }
  ).then(() => console.log('Mongoose: Connected to db!!'))
}

export class PermissionGroupRepository implements IPermissionGroupRepository {
  async create(permissionGroup: IPermissionGroup): Promise<PermissionGroup> {
    const permissionGroupCreated = await PermissionGroupMongoModel.create(permissionGroup);
    return new PermissionGroup(permissionGroupCreated);
  }

  async findAll(filters: any, limit: number, page: number): Promise<PermissionGroup[]> {
    return (await PermissionGroupMongoModel
      .find(filters)
      .populate(getPopulateObjFromSchema('app', appSchema))
      .populate(getPopulateObjFromSchema(
        'permissions',
        permissionGroupSchema,
        { relatedNode: 'module', model: moduleSchema }
      ))
      .skip(page * limit)
      .limit(limit)
    ).map((data: any) => new PermissionGroup(data));
  }

  async findById(id: string): Promise<PermissionGroup> {
    const data = await PermissionGroupMongoModel
      .findById(id)
      .populate(getPopulateObjFromSchema('app', appSchema))
      .populate(getPopulateObjFromSchema(
        'permissions',
        permissionGroupSchema,
        { relatedNode: 'module', model: moduleSchema }
      ))
      .orFail(new HttpErrors[404]('PermissionGroup not found'));

    return new PermissionGroup(data);
  }

  async updateById(id: string, appToUpdate: Partial<Person>): Promise<PermissionGroup> {
    const data = await PermissionGroupMongoModel
      .findByIdAndUpdate(id, appToUpdate, {new: true})
      .populate(getPopulateObjFromSchema('app', appSchema))
      .populate(getPopulateObjFromSchema(
        'permissions',
        permissionGroupSchema,
        { relatedNode: 'module', model: moduleSchema }
      ))
      .orFail(new HttpErrors[404]('PermissionGroup not found'));

    return new PermissionGroup(data);
  }

  async replaceById(id: string, appToUpdate: Person): Promise<PermissionGroup> {
    const data = await PermissionGroupMongoModel
      .findOneAndReplace({_id: id}, appToUpdate, {new: true})
      .populate(getPopulateObjFromSchema('app', appSchema))
      .populate(getPopulateObjFromSchema(
        'permissions',
        permissionGroupSchema,
        { relatedNode: 'module', model: moduleSchema }
      ))
      .orFail(new HttpErrors[404]('PermissionGroup not found'));

    return new PermissionGroup(data);
  }

  async deleteById(id: string): Promise<void> {
    await PermissionGroupMongoModel.findByIdAndDelete(id);
  }

}

import {HttpErrors} from '@loopback/rest';
import mongoose from 'mongoose';
import {IPermission, Permission} from '../../../domain/entities';
import {IPermissionRepository} from '../../../domain/repositories';
import {getPopulateObjFromSchema} from '../../../utils/general.util';
import {moduleSchema} from './schemas/module.schema';
import {permissionGroupSchema} from './schemas/permission-group.schema';
import {PermissionMongoModel} from './schemas/permission.schema';

if(mongoose.connection.readyState === 0){
  mongoose.connect(
    process.env.MONGO_URL ?? 'mongodb://localhost:27017/kunlatek',
    { dbName: process.env.DB! }
  ).then(() => console.log('Mongoose: Connected to db!!'))
}

export class PermissionRepository implements IPermissionRepository {
  async create(permission: IPermission): Promise<Permission> {
    const permissionCreated = await PermissionMongoModel.create(permission);
    return new Permission(permissionCreated);
  }

  async findAll(filters: any, limit: number, page: number): Promise<Permission[]> {
    return (await PermissionMongoModel
      .find(filters)
      .populate(getPopulateObjFromSchema(
        'permissionGroup',
        permissionGroupSchema,
        { relatedNode: 'module', model: moduleSchema }
      ))
      .skip(page * limit)
      .limit(limit)
    ).map((data: any) => new Permission(data));
  }

  async findById(id: string): Promise<Permission> {
    const data = await PermissionMongoModel
      .findById(id)
      .populate(getPopulateObjFromSchema(
        'permissionGroup',
        permissionGroupSchema,
        { relatedNode: 'module', model: moduleSchema }
      ))
      .orFail(new HttpErrors[404]('Permission not found'));

    return new Permission(data);
  }

  async updateById(id: string, appToUpdate: Partial<IPermission>): Promise<Permission> {
    const data = await PermissionMongoModel
      .findByIdAndUpdate(id, appToUpdate, {new: true})
      .populate(getPopulateObjFromSchema(
        'permissionGroup',
        permissionGroupSchema,
        { relatedNode: 'module', model: moduleSchema }
      ))
      .orFail(new HttpErrors[404]('Permission not found'));

    return new Permission(data);
  }

  async replaceById(id: string, appToUpdate: IPermission): Promise<Permission> {
    const data = await PermissionMongoModel
      .findOneAndReplace({_id: id}, appToUpdate, {new: true})
      .populate(getPopulateObjFromSchema(
        'permissionGroup',
        permissionGroupSchema,
        { relatedNode: 'module', model: moduleSchema }
      ))
      .orFail(new HttpErrors[404]('Permission not found'));

    return new Permission(data);
  }

  async deleteById(id: string): Promise<void> {
    await PermissionMongoModel.findByIdAndDelete(id);
  }

}

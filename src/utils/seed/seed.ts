import {ModuleMongoModel} from '../../repositories/mongo/autentikigo/schemas/module.schema';
import {PermissionMongoModel} from '../../repositories/mongo/autentikigo/schemas/permission.schema';

const main = async () => {
  const modules = await ModuleMongoModel.find();

  let adminPermissionGroup = {
    name: 'autentikigo-admin',
    description: 'admin',
    permissions: modules.map(module => {
      return  {
        module: module._id,
        actions: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE']
      }
    }),
  }

  await PermissionMongoModel.create(adminPermissionGroup);
}

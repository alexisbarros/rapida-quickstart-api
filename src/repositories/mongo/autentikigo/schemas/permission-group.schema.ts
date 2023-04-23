import mongoose from 'mongoose';
import {transformSchemaToMongooseModel} from '../../../../utils/general.util';
import {appSchema} from './app.schema';
import {moduleSchema} from './module.schema';

export const permissionGroupSchema = {
  name: { type: 'string', required: true },
  description: { type: 'string' },
  app: { type: 'string', ref: 'App', model: appSchema },
  permissions: [
    {
      type: 'object',
      properties: {
        module: { type: 'string', ref: 'Module', model: moduleSchema },
        actions: [ {type: 'string'} ],
      }
    }
  ],
  _createdBy: { type: 'string', required: false, default: '' },
  _ownerId: { type: 'string', required: false, default: '' },
}

const PermissionGroupMongoSchema = new mongoose.Schema(
  transformSchemaToMongooseModel(permissionGroupSchema),
  {
    timestamps: {
      createdAt: '_createdAt',
      updatedAt: '_updatedAt',
    }
  }
)
export const PermissionGroupMongoModel = mongoose.model('PermissionGroup', PermissionGroupMongoSchema, 'PermissionGroup');

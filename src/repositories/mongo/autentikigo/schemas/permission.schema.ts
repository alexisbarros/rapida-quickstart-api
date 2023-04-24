import mongoose from 'mongoose';
import {transformSchemaToMongooseModel} from '../../../../utils/general.util';
import {permissionGroupSchema} from './permission-group.schema';

export const permissionSchema = {
  user: { type: 'string', required: true },
  permissionGroup: { type: 'string', required: true, ref: 'PermissionGroup', model: permissionGroupSchema },
  _createdBy: { type: 'string', required: false, default: '' },
  _ownerId: { type: 'string', required: false, default: '' },
}

const PermissionMongoSchema = new mongoose.Schema(
  transformSchemaToMongooseModel(permissionSchema),
  {
    timestamps: {
      createdAt: '_createdAt',
      updatedAt: '_updatedAt',
    }
  }
)
export const PermissionMongoModel = mongoose.model('Permission', PermissionMongoSchema, 'Permission');

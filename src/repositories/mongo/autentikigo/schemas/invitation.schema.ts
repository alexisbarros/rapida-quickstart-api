import mongoose from 'mongoose';
import {transformSchemaToMongooseModel} from '../../../../utils/general.util';
import {permissionGroupSchema} from './permission-group.schema';

export const invitationSchema = {
  email: { type: 'string', required: true },
  permissionGroup: { type: 'string', required: true, ref: 'PermissionGroup', model: permissionGroupSchema },
  disabled: { type: 'boolean', default: false },
  _createdBy: { type: 'string', required: false, default: '' },
  _ownerId: { type: 'string', required: false, default: '' },
}

const InvitationMongoSchema = new mongoose.Schema(
  transformSchemaToMongooseModel(invitationSchema),
  {
    timestamps: {
      createdAt: '_createdAt',
      updatedAt: '_updatedAt',
    }
  }
)
export const InvitationMongoModel = mongoose.model('Invitation', InvitationMongoSchema, 'Invitation');

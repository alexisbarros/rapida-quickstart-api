import mongoose from 'mongoose';
import {transformSchemaToMongooseModel} from '../../../../utils/general.util';

export const moduleSchema = {
  name: { type: 'string', required: true },
  description: { type: 'string' },
  collectionName: { type: 'string', required: true },
  route: { type: 'string', required: true },
  _createdBy: { type: 'string', required: false, default: '' },
  _ownerId: { type: 'string', required: false, default: '' },
}

const ModuleMongoSchema = new mongoose.Schema(
  transformSchemaToMongooseModel(moduleSchema),
  {
    timestamps: {
      createdAt: '_createdAt',
      updatedAt: '_updatedAt',
    }
  }
)
export const ModuleMongoModel = mongoose.model('Module', ModuleMongoSchema, 'Module');

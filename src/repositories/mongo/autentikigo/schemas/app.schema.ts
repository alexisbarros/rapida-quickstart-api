import mongoose from 'mongoose';
import {transformSchemaToMongooseModel} from '../../../../utils/general.util';
import {moduleSchema} from './module.schema';

export const appSchema = {
  name: { type: 'string', required: true },
  icon: { type: 'string', required: true },
  url: { type: 'string', required: true },
  modules: [{type: 'string', ref: 'Module', model: moduleSchema}],
  _createdBy: { type: 'string', required: true },
  _ownerId: { type: 'string', required: true },
}

const AppMongoSchema = new mongoose.Schema(
  transformSchemaToMongooseModel(appSchema),
  {
    timestamps: {
      createdAt: '_createdAt',
      updatedAt: '_updatedAt',
    }
  }
)
export const AppMongoModel = mongoose.model('App', AppMongoSchema, 'App');

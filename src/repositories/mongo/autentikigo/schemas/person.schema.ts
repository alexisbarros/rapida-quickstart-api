import mongoose from 'mongoose';
import {transformSchemaToMongooseModel} from '../../../../utils/general.util';
import {userSchema} from './user.schema';

export const personSchema = {
  name: { type: 'string', required: true },
  uniqueId: { type: 'string' },
  birthday: { type: 'number' },
  gender: { type: 'string' },
  mother: { type: 'string' },
  country: { type: 'string' },
  username: { type: 'string' },
  nickname: { type: 'string' },
  genderIdentity: { type: 'string' },
  userId: { type: 'string', ref: 'User', model: userSchema },
}

const PersonMongoSchema = new mongoose.Schema(
  transformSchemaToMongooseModel(personSchema),
  {
    timestamps: {
      createdAt: '_createdAt',
      updatedAt: '_updatedAt',
    }
  }
)
export const PersonMongoModel = mongoose.model('Person', PersonMongoSchema, 'Person');

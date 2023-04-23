import mongoose from 'mongoose';
import {transformSchemaToMongooseModel} from '../../../../utils/general.util';

export const userSchema = {
  email: { type: 'string' },
  phoneNumber: { type: 'string' },
  googleId: { type: 'string' },
  appleId: { type: 'string' }
}

const UserMongoSchema = new mongoose.Schema(
  transformSchemaToMongooseModel(userSchema),
  {
    timestamps: {
      createdAt: '_createdAt',
      updatedAt: '_updatedAt',
    }
  }
)
export const UserMongoModel = mongoose.model('User', UserMongoSchema, 'User');

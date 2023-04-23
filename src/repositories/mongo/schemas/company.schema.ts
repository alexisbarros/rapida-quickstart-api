import mongoose from 'mongoose';
import {transformSchemaToMongooseModel} from '../../../utils/general.util';
import {userSchema} from './user.schema';

export const companySchema = {
  corporateName: { type: 'string', required: true },
  tradeName: { type: 'string' },
  uniqueId: { type: 'string', requried: true },
  birthday: { type: 'number', required: true },
  email: { type: 'string' },
  responsible: { type: 'string', required: true },
  businessActivityCode: {
    type: 'object',
    properties: {
      divisao: {type: 'string'},
      grupo: {type: 'string'},
      classe: {type: 'string'},
      subClasse: {type: 'string'},
      fiscal: {type: 'string'},
      descrição: {type: 'string'},
    },
  },
  userId: { type: 'string', ref: 'User', model: userSchema },
}

const CompanyMongoSchema = new mongoose.Schema(
  transformSchemaToMongooseModel(companySchema),
  {
    timestamps: {
      createdAt: '_createdAt',
      updatedAt: '_updatedAt',
    }
  }
)
export const CompanyMongoModel = mongoose.model('Company', CompanyMongoSchema, 'Company');

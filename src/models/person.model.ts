import {Entity, model, property} from '@loopback/repository';

@model()
export class Person extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {
      dataType: 'ObjectId'
    },
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    // required: true,
  })
  uniqueId?: string;

  @property({
    type: 'Date',
    // required: true,
  })
  birthday?: Date;

  @property({
    type: 'number',
    // required: true,
  })
  birthdayTimestamp?: number;

  @property({
    type: 'string',
    // required: true,
  })
  gender?: string;

  @property({
    type: 'string',
    // required: true,
  })
  mother?: string;

  @property({
    type: 'string',
    // required: true,
  })
  country?: string;

  @property({
    type: 'string',
  })
  username?: string;

  @property({
    type: 'string'
  })
  nickname?: string

  @property({
    type: 'string'
  })
  genderIdentity?: string

  @property({
    type: 'string',
  })
  userId?: string;

  // Rever se deve manter aqui as propriedades abaixo
  @property({
    type: 'number',
  })
  termsAcceptanceDate?: number;

  @property({
    type: 'boolean',
  })
  receivesSms?: boolean;

  @property({
    type: 'boolean',
  })
  receivesWhatsapp?: boolean;

  @property({
    type: 'string',
  })
  picture?: string;

  @property({
    type: 'string',
  })
  zipcode?: string;

  constructor(data?: Partial<Person>) {
    super(data);
  }
}

export interface PersonRelations {
  // describe navigational properties here
}

export type PersonWithRelations = Person & PersonRelations;

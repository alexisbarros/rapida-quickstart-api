import {RequestBodyObject, SchemaObject} from '@loopback/rest';
import {Schema} from 'mongoose';

interface ISwaggerProperties {
  [propertyName: string]: string | ISwaggerProperties | ISwaggerProperties[],
}

/**
 * Get mongoose populate object from a model schema
 * @param relatedNode
 * @param model
 * @param populate
 * @returns mongoose populate object
 */
export const getPopulateObjFromSchema = (
  relatedNode: string,
  model: any,
  populate?: any,
) => {
  let obj:any = {
    path: relatedNode,
    select: Object.keys(model).reduce((prev: string, current: string) => {
      return prev += `${current} `;
    }, '')
  }

  if(populate){
    obj.populate = getPopulateObjFromSchema(populate.relatedNode, populate.model, populate.populate);
  }

  return obj;
}

/**
 * Transform schema to mongoose model
 * @param schema
 * @returns mongoose model
 */
export const transformSchemaToMongooseModel = (
  schema: any,
) => {
  let mongooseModel: any = {};

  Object.keys(schema).forEach((key: string) => {
    if(Array.isArray(schema[key])){
      if(schema[key][0].ref)
        mongooseModel[key] = [{type: Schema.Types.ObjectId, ref: schema[key][0].ref}]
      else if (schema[key][0].type === 'string')
        mongooseModel[key] = [schema[key][0].type]
      else if (schema[key][0].type === 'object')
        mongooseModel[key] = [transformSchemaToMongooseModel(schema[key][0].properties)]
    } else if(schema[key].ref){
      delete schema[key].type;
      mongooseModel[key] = {
        ...schema[key],
        type: Schema.Types.ObjectId,
      };
    } else {
      mongooseModel[key] = schema[key];
    }
  });

  return mongooseModel;
}

/**
 * Get ObjectId properties from a model schema
 * @param model
 * @returns array of objectId properties
 */
export const getObjectIdPropertiesFromSchema = (model: any) => {

  return (Object.keys(model) || [])
    .map((key:string) => {
      if(model[key].model) return key;
      else return null;
    })
  .filter((el: any) => el !== null);

}

/**
 * Change an key value object to an regex key value object
 * @param object
 * @param model
 * @returns regex key value object
 */
export const changeValueToRegexInKeyValue = (object: any, model?: any) => {

  let newObject: any = {}

  let objectIdProperties: any[] = []
  if(model) objectIdProperties = getObjectIdPropertiesFromSchema(model)

  Object.keys(object).forEach((key: string) => {
    if(
      typeof object[key] === 'string' &&
      !objectIdProperties.includes(key)
    )
      newObject[key] = {$regex: object[key], $options: 'i'}
    else
      newObject[key] = object[key]
  });


  return newObject;
}

/**
 * Get model schema DTO
 * @param model
 * @param data
 * @returns objct
 */
export const schemaDTO = (model: any, data: any) => {
  let dataDTO: any = {
    _id: data._id,
  };

  Object.keys(model).forEach((key: string) => {
    dataDTO[key] = data[key];
  });

  return dataDTO;
}

/**
 * Remove accent from a string
 * @param term string to remove accent
 * @returns string without accent
 */
export const removeAccent = (term: string) : string => {
  return term.normalize('NFD').replace(/[^\w\s]/gi, ' ').replace(/[\u0300-\u036f]/g, "");
}

/**
 * Get open api request body documentation object
 * @param model
 * @param deletedAttr array of attributes to delete
 * @returns open api request body object
 */
export const getSwaggerRequestBodySchema = (
  model: any,
  deletedAttr: string[],
): Partial<RequestBodyObject> => {

  const data = getSwaggerSchema(model, false, deletedAttr);

  return {
    'content': {
        'application/json': {
          'schema': data,
        }
    },
  }
}

/**
 * Get open api response documentation object
 * @param model
 * @param isArray
 * @returns open api response object
 */
export const getSwaggerResponseSchema = (
  model?: any,
  isArray?: boolean,
): SchemaObject => {

  const data = model ?
    getSwaggerSchema(
      {
        _id: {type: 'string'},
        ...model,
      },
      isArray, ['_deletedAt'], true
    ) : null;

  return {
    'content': {
        'application/json': {
          'schema': {
            type: 'object',
            properties: {
              statusCode: { type: 'number' },
              data,
              message: { type: 'string' },
            }
          }
        }
    },
  }
}

/**
 * Get open api schema
 * @param model
 * @param isArray
 * @param deleteAttr array of attributes to delete
 * @param populateDeepAttr is deep populate?
 * @returns schema object
 */
const getSwaggerSchema = (
  model: any,
  isArray?: boolean,
  deleteAttr?: string[],
  populateDeepAttr?: boolean,
): SchemaObject => {

  const properties: ISwaggerProperties = transformSchemaInSwaggerObject(model, deleteAttr);

  let propertiesTyped: any = {}
  Object.keys(properties).forEach((key: string) => {
    if(typeof properties[key] === 'string'){
      propertiesTyped[key] = {type: properties[key]};
    } else if(Array.isArray(properties[key]) && properties[key].length){
      if(typeof (properties[key] as ISwaggerProperties[])[0] === 'string'){
        propertiesTyped[key] = { type: 'array', items: { type: (properties[key] as ISwaggerProperties[])[0] } };
      } else if((properties[key] as ISwaggerProperties[])[0]._id && !populateDeepAttr){
        propertiesTyped[key] = { type: 'array', items: { type: 'string' } };
      } else {
        const arrayProperty = (properties[key] as ISwaggerProperties[])[0];
        propertiesTyped[key] = {
          type: 'array',
          items: {
            type: 'object',
            ...getSwaggerSchema(arrayProperty),
          },
        }
      }
    } else if(
      typeof properties[key] === 'object' &&
      Object.keys(properties[key]).includes('_objectFlag')
    ) {
      propertiesTyped[key] = getSwaggerSchema(properties[key]);
      delete propertiesTyped[key]['properties']['_objectFlag']
    } else if(!populateDeepAttr){
      propertiesTyped[key] = {type: 'string'};
    } else
      propertiesTyped[key] = getSwaggerSchema(properties[key], false, ['_deletedAt'], true);
    }
  )

  return !isArray ?
    {
      type: 'object',
      properties: propertiesTyped
    } :
    {
      type: 'object',
      properties: {
        result: {
          type: 'array',
          items: {
            type: 'object',
            properties: propertiesTyped,
          }
        },
        total: { type: 'number' },
        page: { type: 'number' },
      }
    }
}

/**
 * Get an open api object from a model schema
 * @param model
 * @param deleteAttr array of attributes to delete
 * @returns open api object
 */
const transformSchemaInSwaggerObject = (
  model: any,
  deleteAttr?: string[],
): ISwaggerProperties => {
  let obj:ISwaggerProperties = {};

  deleteAttr = deleteAttr ?? [];

  Object.keys(model).forEach((key: string) => {
    let type;

    if(model[key]){
      if(Array.isArray(model[key])){
        if(typeof model[key][0] === 'string') type = [model[key][0]];
        else if(model[key][0].ref) type = [{_id: { type: 'string' }, ...model[key][0]['model']}];
        else if(model[key][0]['type'] === 'object' && Object.keys(model[key][0]['properties']))
          type = transformSchemaInSwaggerObject({...model[key][0]['properties'], _objectFlag: { type: 'string' }});
        else if(model[key][0].type === 'string') type = ['string'];
        else type = [transformSchemaInSwaggerObject(model[key][0])];
      } else if(model[key]['type'] === 'object' && Object.keys(model[key]['properties']).length){
        type = transformSchemaInSwaggerObject({...model[key]['properties'], _objectFlag: { type: 'string' }});
      } else {
        type = model[key]['model'] ?? model[key]['type'];
      }

      if(!deleteAttr?.includes(key))
        obj[key] = type;
    }
  })

  return obj;
}

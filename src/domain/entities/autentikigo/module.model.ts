export interface IModule {
  _id?: string
  name: string
  description?: string
  collectionName: string
  route: string
  _createdBy: string
  _ownerId: string
}

export class Module {

  public _id?: string;
  public name: string;
  public description?: string;
  public collectionName: string;
  public route: string;
  public _createdBy: string;
  public _ownerId: string;

  constructor(module: IModule){
    this._id = module._id;
    this.name = module.name;
    this.description = module.description;
    this.collectionName = module.collectionName;
    this.route = module.route;
    this._createdBy = module._createdBy;
    this._ownerId = module._ownerId;
  }
}

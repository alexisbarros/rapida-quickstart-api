import {IModule} from './module.model'

export interface IApp {
  _id?: string
  name: string
  icon?: string
  url?: string
  modules: string[] | IModule[]
  _createdBy: string
  _ownerId: string
}

export class App {

  public _id?: string;
  public name: string;
  public icon?: string;
  public url?: string;
  public modules: string[] | IModule[];
  public _createdBy: string;
  public _ownerId: string;

  constructor(app: IApp){
    this._id = app._id;
    this.name = app.name;
    this.icon = app.icon;
    this.url = app.url;
    this.modules = app.modules;
    this._createdBy = app._createdBy;
    this._ownerId = app._ownerId;
  }

}

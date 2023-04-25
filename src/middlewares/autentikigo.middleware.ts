import {AuthenticationBindings, AuthenticationMetadata, AuthenticationStrategy} from '@loopback/authentication';
import {Getter, inject} from '@loopback/core';
import {model, repository} from '@loopback/repository';
import {Request, Response, RestBindings} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {IPermissionGroupRepository, IPermissionRepository} from '../domain/repositories';
import {PermissionGroupRepository, PermissionRepository} from '../repositories';
import {RefreshJwt, VerifyJwt} from '../usecases/autentikigo/jwt';
import {UserHasPermission} from '../usecases/autentikigo/permission';

@model()
export class Lb4User implements UserProfile {

  [securityId]: string;
  userId: string;

  constructor(data?: Partial<Lb4User>) {
    Object.assign(this, data);
  }
}

export class Autentikigo implements AuthenticationStrategy {
  name = 'autentikigo'


  constructor(
    @inject.getter(AuthenticationBindings.METADATA) readonly getMetaData: Getter<AuthenticationMetadata>,
    @inject(RestBindings.Http.RESPONSE) private response: Response,

    @repository(PermissionGroupRepository) private permissionGroupRepository: IPermissionGroupRepository,
    @repository(PermissionRepository) private permissionRepository: IPermissionRepository,
  ) { }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = request.headers.authorization;

    try {
      // Só consegui acessar as options do metadata especificando ele como any
      const metadata = await this.getMetaData() as any
      const collection = metadata['0']['options']['collection']
      const action = metadata['0']['options']['action']

      const payload = new VerifyJwt().execute(token);
      const userId = payload.id;

      if(!userId) throw new Error('User not found');

      const userHasPermission = await new UserHasPermission(
        this.permissionRepository, this.permissionGroupRepository,
      ).execute({userId, collection, action});

      if(!userHasPermission) throw new Error('User does not have permission to access this route');

      const userProfile = new Lb4User({ userId, [securityId]: userId.toString() })
      return userProfile

    } catch (err) {

      if(err.name === 'TokenExpiredError'){
        try {
          const newToken = new RefreshJwt().execute(token!);
          this.response.cookie(
            'auth-token',
            newToken,
            { expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)) },
          );

          return
        } catch(childErr) {}
      }

      this.response.status(401)
      this.response.send({
        statusCode: 401,
        message: err.message,
        logMessage: err.message
      })

      return
    }
  }
}

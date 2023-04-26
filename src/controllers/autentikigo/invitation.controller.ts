import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Request, Response, RestBindings, api, del, get, param, patch, post, put, requestBody, response} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {IInvitation} from '../../domain/entities';
import {IInvitationRepository} from '../../domain/repositories';
import {InvitationRepository} from '../../repositories';
import {invitationSchema} from '../../repositories/mongo/autentikigo/schemas/invitation.schema';
import {SendMailByNodemailer} from '../../services';
import {getSwaggerRequestBodySchema, getSwaggerResponseSchema} from '../../utils/general.util';
import {IHttpResponse, badRequestErrorHttpResponse, createHttpResponse, noContentHttpResponse, notFoundErrorHttpResponse, okHttpResponse} from '../../utils/http-response.util';

@api({ basePath: 'autentikigo' })
export class InvitationController {

  constructor(
    @inject(RestBindings.Http.REQUEST) private httpRequest: Request,
    @inject(RestBindings.Http.RESPONSE) private httpResponse: Response,

    @repository(InvitationRepository) private invitationRepository: IInvitationRepository,

    @inject(SecurityBindings.USER, {optional: true}) private user?: UserProfile,
  ){}

  @authenticate({
    strategy: 'autentikigo',
    options: {collection: 'Invitation', action: 'POST'}
  })
  @post('invitations')
  @response(201, getSwaggerResponseSchema())
  async create(
    @requestBody(getSwaggerRequestBodySchema(invitationSchema, ['_id', '_createdBy', '_ownerId']))
    data: IInvitation
  ): Promise<IHttpResponse> {
    try {
      const dataCreated = await this.invitationRepository.create({
        ...data,
        _createdBy: this.user?.userId,
        _ownerId: this.user?.userId,
      });

      return createHttpResponse({
        data: dataCreated,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    } catch(err) {
      const errorData = {
        request: this.httpRequest,
        response: this.httpResponse,
        message: err.message,
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }

  @authenticate({
    strategy: 'autentikigo',
    options: {collection: 'Invitation', action: 'GET'}
  })
  @get('invitations')
  @response(200, getSwaggerResponseSchema(invitationSchema, true))
  async findAll(
    @param.query.string('filters') filters?: any,
    @param.query.number('limit') limit?: number,
    @param.query.number('page') page?: number,
  ): Promise<IHttpResponse> {
    try {
      const data = await this.invitationRepository.findAll(
        filters ?? {},
        limit ?? 100,
        page ?? 0,
      );

      return okHttpResponse({
        data,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    } catch(err) {
      const errorData = {
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }

  @authenticate({
    strategy: 'autentikigo',
    options: {collection: 'Invitation', action: 'GET'}
  })
  @get('invitations/{id}')
  @response(200, getSwaggerResponseSchema(invitationSchema, false))
  async findOne(
    @param.path.string('id') id: string,
  ): Promise<IHttpResponse> {
    try {
      const data = await this.invitationRepository.findById(id);

      return okHttpResponse({
        data,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    } catch(err) {
      const errorData = {
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }

  @authenticate({
    strategy: 'autentikigo',
    options: {collection: 'Invitation', action: 'GET'}
  })
  @get('invitations/{id}/send')
  @response(200, getSwaggerResponseSchema())
  async sendInvitation(
    @param.path.string('id') id: string,
  ): Promise<IHttpResponse> {
    try {
      const invitation = await this.invitationRepository.findById(id);

      const mailBody = `
        <p>
          <a href='${process.env.OAUTH_REDIRECT_URI}/auth/login/google?invitation-id=${id}'>Login com convite</a>
        </p>
      `

      await new SendMailByNodemailer().execute(invitation.email, mailBody);

      return noContentHttpResponse({
        request: this.httpRequest,
        response: this.httpResponse,
      });
    } catch(err) {
      const errorData = {
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }

  @authenticate({
    strategy: 'autentikigo',
    options: {collection: 'Invitation', action: 'PUT'}
  })
  @put('invitations/{id}')
  @response(200, getSwaggerResponseSchema(invitationSchema, false))
  async replace(
    @param.path.string('id') id: string,
    @requestBody(getSwaggerRequestBodySchema(invitationSchema, ['_id', '_createdBy', '_ownerId']))
    data: IInvitation
  ): Promise<IHttpResponse> {
    try {
      const dataUpdated = await this.invitationRepository.replaceById(id, data)

      return okHttpResponse({
        data: dataUpdated,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    } catch(err) {
      const errorData = {
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }

  @authenticate({
    strategy: 'autentikigo',
    options: {collection: 'Invitation', action: 'PATCH'}
  })
  @patch('invitations/{id}')
  @response(200, getSwaggerResponseSchema(invitationSchema, false))
  async update(
    @param.path.string('id') id: string,
    @requestBody(getSwaggerRequestBodySchema(invitationSchema, ['_id', '_createdBy', '_ownerId']))
    data: Partial<IInvitation>
  ): Promise<IHttpResponse> {
    try {
      const dataUpdated = await this.invitationRepository.updateById(id, data)

      return okHttpResponse({
        data: dataUpdated,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    } catch(err) {
      const errorData = {
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }

  @authenticate({
    strategy: 'autentikigo',
    options: {collection: 'Invitation', action: 'DELETE'}
  })
  @del('invitations/{id}')
  @response(200, getSwaggerResponseSchema())
  async delete(
    @param.path.string('id') id: string
  ): Promise<IHttpResponse> {
    try {
      await this.invitationRepository.deleteById(id);

      return okHttpResponse({
        request: this.httpRequest,
        response: this.httpResponse,
      })
    } catch(err) {
      const errorData = {
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }

}

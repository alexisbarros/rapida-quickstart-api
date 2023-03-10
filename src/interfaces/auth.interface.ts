import {Request, Response} from '@loopback/rest';
import {CompanyDTO} from '../dto/company.dto';
import {PersonDTO} from '../dto/person.dto';
import {AdditionalInfoModel} from '../entities/signup.entity';
import {LocaleEnum} from '../enums/locale.enum';
import {UserTypesEnum} from '../utils/general-functions';
import {CompanyRepository} from './../repositories/company.repository';
import {PersonRepository} from './../repositories/person.repository';
import {IOAuthUser} from './user.interface';

export interface ILoginUserInfo {
  email?: string;
  googleId?: string;
  appleId?: string;
  phoneNumber?: string;
  verificationCode?: string;
  invitationId?: string;
}

export interface ILoginResponse {
  authToken: string,
  authRefreshToken: string,
  userData: {} | null,
}

export interface IRefreshTokenResponse {
  authToken: string,
  authRefreshToken: string,
}

export interface IPasswordlessUserData {
  phoneNumber: string;
  verificationCode: string;
  invitationId?: string;
};

export interface IPasswordlessPersonData {
  name: string;
  uniqueId?: string;
  termsAcceptanceDate?: number,
  receivesSms?: boolean,
  receivesWhatsapp?: boolean,
  picture?: string,
  zipcode?: string,
  birthdayTimestamp?: number,
  gender?: string
};

export interface IAuthToken {
  verifyAuthToken(token: string, secret: string, request: Request, response: Response, locale?: LocaleEnum): boolean,
  getLoginUserInfoFromToken(token: string): ILoginUserInfo,
  getUserIdFromToken(token: string): string,
}

export interface IOAuthLogin {
  getOAuthLoginPageUrl(params?: string): Promise<string>,
  getOAuthUser(code?: string): Promise<IOAuthUser>,
  createOAuthToken(oAuthUser: IOAuthUser, invitationId?: string | null, clientRedirectUri?: string): string,
}

export interface IPasswordlessAuth {
  sendVerificationCode(phoneNumber: string, verificationCode: string): Promise<string>,
  createAuthToken(phoneNumber: string, verificationCode: string): string,
}

export interface IGetProfile {
  getFullProfileInfo(
    uniqueId: string,
    userType: UserTypesEnum,
    additionalInfo?: AdditionalInfoModel,
    personCompanyRepository?: PersonRepository | CompanyRepository,
    countryId?: string,
  ): Promise<PersonDTO | CompanyDTO | null>
}

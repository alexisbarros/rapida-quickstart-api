import {service} from '@loopback/core'
import {repository} from '@loopback/repository'
import jwt from 'jsonwebtoken'
import {LocaleEnum} from '../enums/locale.enum'
import {ILoginResponse, IPasswordlessAuth, IPasswordlessPersonData, IPasswordlessUserData} from '../interfaces/auth.interface'
import {Company, Person} from '../models'
import {PersonRepository, UserRepository} from '../repositories'
import {serverMessages} from '../utils/server-messages'
import {AuthService} from './auth.service'

export class PasswordlessAuthService {

  constructor(
      @repository(UserRepository) private userRepository: UserRepository,
      @repository(PersonRepository) private personRepository: PersonRepository,

      @service(AuthService) private authService: AuthService,
  ) { }

  public createPasswordlessToken(): string {
    const token = Math.floor(100000 + Math.random() * 900000);
    return token.toString();
  }

  public async sendPasswordlessToken(passwordless: IPasswordlessAuth, phoneNumber: string, token: string): Promise<string> {
    return await passwordless.sendVerificationCode(phoneNumber, token);
  }

  public async passwordlessSignup(
    userInfo: IPasswordlessUserData,
    personInfo: IPasswordlessPersonData
  ): Promise<ILoginResponse> {

    const userAlreadyCreated = await this.userRepository.findOne({
      where: {phoneNumber: userInfo?.phoneNumber}
    });
    if(userAlreadyCreated) throw new Error('User already created');

    const profile = personInfo.uniqueId ?
        await this.personRepository.findOne({where: {uniqueId: personInfo.uniqueId}}) ??
          await this.createProfile(personInfo)
        :
        await this.createProfile(personInfo);


    const newUser = await this.userRepository.create({
      phoneNumber: userInfo?.phoneNumber,
    })

    // if (userInfo?.invitationId) {
    //   const permissionGroupId = await this.authService.getPermissionGroupIdFromInvitation(userInfo?.invitationId, userInfo?.email!, locale)
    //   await this.authService.giveTheUserPermission(permissionGroupId, newUser._id!)
    // }

    await this.personRepository.updateById(profile._id as string,
      { userId: newUser?._id as string }
    )

    const user = await this.userRepository.findById(newUser?._id, {include: ['person', 'company']})

    return {
      authToken: jwt.sign({
        id: user?._id,
      }, process.env.AUTENTIKIGO_SECRET!, {
        expiresIn: '1d'
      }),
      authRefreshToken: jwt.sign({
        id: user?._id,
      }, process.env.AUTENTIKIGO_SECRET!, {
        expiresIn: '7d'
      }),
      userData: user
    }
  }

  public async createProfile(profileData: IPasswordlessPersonData): Promise<Person | Company> {
    try {
      const profileCreated = await this.personRepository.create(profileData)

      return profileCreated

    } catch (err) {

      throw new Error(serverMessages['auth']['createProfileError'][LocaleEnum['pt-BR']]);

    }
  }

  public async passwordlessLogin(phoneNumber: string): Promise<ILoginResponse | null> {

    const user = await this.userRepository.findOne({
      where: { phoneNumber: {like: phoneNumber} },
      include: ['person', 'company']
    })

    if (!user) return null

    return {
      authToken: jwt.sign({
        id: user?._id,
      }, process.env.AUTENTIKIGO_SECRET!, {
        expiresIn: '1d'
      }),
      authRefreshToken: jwt.sign({
        id: user?._id,
      }, process.env.AUTENTIKIGO_SECRET!, {
        expiresIn: '7d'
      }),
      userData: user
    }

  }
}


import {IHttpDocumentation, IHttpResponseToClient} from '../interfaces/http.interface';
import {ISendMessage} from '../interfaces/send-message.interface';
import {HttpLb4DocImplementation} from './http-lb4-doc.implementation';
import {HttpLb4ResponseImplementation} from './http-lb4-response.implementation';
import {JwtTokenImplementation} from './jwt-token.implementation';
import {TwilioSendMessageImplementation} from './twilio-send-message.implementation';

const HttpDocumentation: IHttpDocumentation = new HttpLb4DocImplementation()
const HttpResponseToClient: IHttpResponseToClient = new HttpLb4ResponseImplementation()
const JwtToken: JwtTokenImplementation = new JwtTokenImplementation()
const SendMessage: ISendMessage = new TwilioSendMessageImplementation()

export {
  HttpDocumentation,
  HttpResponseToClient,
  JwtToken,
  SendMessage,
};

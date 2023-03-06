import {IMessageData, ISendMessage} from '../interfaces/send-message.interface';
require('dotenv').config()

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
const twilio = require('twilio')(twilioAccountSid, twilioAuthToken)

export class TwilioSendMessageImplementation implements ISendMessage {
  async sendSms(messageData: IMessageData): Promise<boolean> {
    const message = await twilio.messages
      .create({
          body: messageData.body,
          from: process.env.TWILIO_PHONE_SENDER,
          to: messageData.number,
      })

    return message ? true : false;
  }

  async sendWhatsapp(messageData: IMessageData): Promise<boolean> {
    const message = await twilio.messages
      .create({
          body: messageData.body,
          from: process.env.TWILIO_PHONE_SENDER,
          to: messageData.number,
      })

    return message ? true : false;
  }

}

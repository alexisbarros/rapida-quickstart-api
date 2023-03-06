export enum MessangerEnum {
  sms = 'sms',
  whatsapp = 'whatsapp',
}

export interface IMessageData {
  number: string,
  body: string,
}

export interface ISendMessage {
  sendSms(messageData: IMessageData): Promise<boolean>;
  sendWhatsapp(messageData: IMessageData): Promise<boolean>;
}

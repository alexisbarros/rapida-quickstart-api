import * as nodemailer from 'nodemailer';
import {ISendMail} from '../interfaces';

export class SendMailByNodemailer implements ISendMail {

  public async execute(mailTo: string, body: string): Promise<void> {
    const mailOptions = {
      from: '"Autentikigo" <noreply@autentikigo.com.br>',
      to: mailTo,
      subject: 'Convite Autentikigo',
      html: body
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
      tls: {rejectUnauthorized: false}
    });

    transporter.sendMail(mailOptions, (error) => {
      if (error) throw new Error(error.message);
    })
  }

}

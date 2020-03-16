import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import generateCode from '../util/generateCode';
import Knex from 'knex';
import Mail from 'nodemailer/lib/mailer';

/** Registers new user */
export const handleSendCode = (db: Knex, transport: Mail) => async (req: Request, res: Response) => {
  // const confirmationCode = generateCode(6);
  // // send mail with defined transport object
  // const info = await transporter.sendMail({
  //   from: '"FILMIK APP" <filmikWeAre@gmail.com>',
  //   to: email,
  //   subject: 'Confirmation code',
  //   text: `Hello, ${username}! This is your confirmation code for FILMIK APP! ${confirmationCode}`,
  //   html: `Hello, ${username}! This is your confirmation code for FILMIK APP! <h1>${confirmationCode}</h1>`
  // });
  // console.log('Message sent: %s', info.messageId);
};

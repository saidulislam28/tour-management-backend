/* eslint-disable @typescript-eslint/no-unused-vars */
import nodemailer from 'nodemailer'
import { envVars } from '../configs/env'
import path from 'path'
import AppError from '../helpers/CustomError';
import ejs from 'ejs';

const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
});

interface options {
  to: string;
  subject: string;
  templateName: string
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string,
    contentType: string;
  }[]

}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments
}: options) => {
  try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData)
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType
      }))
    })

    console.log(`email sent to ${to} ${info.messageId}`)

  } catch (error: any) {
    console.error("error message:", error.message)
    console.log("error message>>>", error)
    throw new AppError(401, "Email Error")
  }
}
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('NODEMAILER_EMAIL'),
        pass: this.configService.get('NODEMAILER_PASSWORD'),
      },
    });
  }

  async sendMail(to: string, subject: string, text?: string, html?: string) {
    const info = await this.transporter.sendMail({
      from: this.configService.get('NODEMAILER_EMAIL'),
      to: to,
      subject: subject,
      text: text, // plain‑text body
      html: html, // HTML body
    });

    console.log('Message sent:', info.messageId);
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE'),
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, text?: string, html?: string) {
    const info = await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: to,
      subject: subject,
      text: text, // plain‑text body
      html: html, // HTML body
    });

    console.log('Message sent:', info.messageId);
  }
}

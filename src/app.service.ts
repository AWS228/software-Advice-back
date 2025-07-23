import { Injectable } from '@nestjs/common';
import { ContactusDto } from './dto/contactus.dto';
import { MailService } from './mail/mail.service';

@Injectable()
export class AppService {
  constructor(private mailService: MailService) {}

  getHello(): string {
    return 'Hello World!';
  }
  
  async contactUs(contactusDto: ContactusDto) {
    console.log('contactusDto',contactusDto)
    const { name, email, subject, message } = contactusDto;
    await this.mailService.sendMail(
      email,
      subject,
      undefined,
      `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Contact Form Submission</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f8f9fa;
                margin: 0;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
              }
              h2 {
                color: #333333;
                margin-top: 0;
              }
              .label {
                font-weight: bold;
              }
              .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #999999;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>New Contact Form Submission</h2>
              <p><span class="label">Name:</span> ${name}</p>
              <p><span class="label">Email:</span> ${email}</p>
              <p><span class="label">Subject:</span> ${subject}</p>
              <p><span class="label">Message:</span></p>
              <p>${message}</p>
              <div class="footer">
                Sent from your website contact form.
              </div>
            </div>
          </body>
        </html>
      `,
    );
    return {
      message: 'Email sent successfully',
    };
  }
}

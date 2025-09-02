import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ContactusDto } from './dto/contactus.dto';
import { MailService } from './mail/mail.service';
import axios from 'axios';

@Injectable()
export class AppService {
  constructor(private mailService: MailService) {}

  getHello(): string {
    return 'Welcome to TechBolted!';
  }

  async contactUs(contactusDto: ContactusDto) {
    const { name, email, subject, message } = contactusDto;

    // get all contacts
    const getContactsRes = await axios.get(
      'https://api.hubapi.com/crm/v3/objects/contacts',
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_TOKEN}`,
        },
      },
    );
    if (getContactsRes.status !== 200) {
      throw new InternalServerErrorException();
    }
    const existingContact = getContactsRes.data.results.find(
      (item: any) => item.properties.email == email,
    );
    if (existingContact) {
      // update contact
      await axios.patch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${existingContact.id}`,
        {
          properties: {
            firstname: name,
            email,
            subject,
            message,
            hs_lead_status: 'NEW',
            lead_source: 'Website',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } else {
      // create contact
      await axios.post(
        'https://api.hubapi.com/crm/v3/objects/contacts',
        {
          properties: {
            firstname: name,
            email,
            subject,
            message,
            hs_lead_status: 'NEW',
            lead_source: 'Website',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );
    }

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

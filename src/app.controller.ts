import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ContactusDto } from './dto/contactus.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('contact-us')
  @UseInterceptors(NoFilesInterceptor())
  @HttpCode(HttpStatus.OK)
  contactUs(@Body() contactusDto:ContactusDto){
    return this.appService.contactUs(contactusDto)
  }
}

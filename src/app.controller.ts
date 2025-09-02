import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ContactusDto } from './dto/contactus.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Throttle({default:{limit: 3, ttl: 60000}})
  @Post('contact-us')
  @UseInterceptors(NoFilesInterceptor())
  @HttpCode(HttpStatus.OK)
  contactUs(@Body() contactusDto:ContactusDto){
    return this.appService.contactUs(contactusDto)
  }
}

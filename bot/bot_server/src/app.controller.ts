import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BotService } from './bot.service';
import { User } from './schemas/user.schema';

@Controller('api')
export class AppController {
  constructor(private readonly appService: BotService) {}

  @Get('users')
  async getUsers(): Promise<User[]> {
    return await this.appService.findAll();
  }
}

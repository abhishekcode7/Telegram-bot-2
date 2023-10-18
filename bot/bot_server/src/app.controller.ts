import { Body, Controller, Get, Post, Req } from '@nestjs/common';
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

  @Post('deleteUser')
  async deleteUser(@Body() body: User): Promise<Boolean> {
    return await this.appService.deleteUserFromDb(body.id);
  }

  @Post('blockUser')
  async blockUser(@Body() body: User): Promise<Boolean> {
    return await this.appService.blockUser(body.id,true);
  }

  @Post('unblockUser')
  async unblockUser(@Body() body: User): Promise<Boolean> {
    return await this.appService.blockUser(body.id,false);
  }
}

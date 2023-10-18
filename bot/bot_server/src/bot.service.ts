import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { env } from 'process';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios/dist';
const Agent = require('socks5-https-client/lib/Agent');
@Injectable()
export class BotService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly httpService: HttpService,
  ) {}

  token: String;
  bot: any = null;
  city: string = null;
  TelegramBot = require('node-telegram-bot-api');
  onModuleInit() {
    this.token = process.env.TELEGRAM_BOT_TOKEN.toString();

    if (this.bot == null)
      this.bot = new this.TelegramBot(this.token, { polling: true });

    this.botMessage();
    // this.userModel.deleteMany().exec()
  }

  botMessage() {
    this.bot.onText(/\/start/, (msg, match) => {
      this.handleBlockedUser(msg.from.id).then((isBlocked) => {
        if (isBlocked == true) return;

        this.findUser(msg.from.id.toString()).then((user) => {
          if (user == null) {
            this.bot.sendMessage(
              msg.from.id,
              'Hello ' +
                msg.from.first_name +
                ', I am weather forecast Bot. Type " /subscribe <city_name> "' +
                ' ( without double quotes ) ' +
                'to get ' +
                'daily weather updates',
            );
          }
        });
      });
    });

    this.bot.onText(/\/subscribe (.+)/, (msg, match) => {
      this.handleBlockedUser(msg.from.id).then((isBlocked) => {
        if (isBlocked == true) return;

        this.city = match[1];
        this.saveUser({
          id: msg.from.id.toString(),
          name: msg.from.first_name,
          city: this.city,
          isBlocked: false,
        }).then(
          (_) => {
            this.bot.sendMessage(
              msg.from.id,
              msg.from.first_name +
                ' you have subscribed to the weather updates.' +
                ' Thank You',
            );
          },
          (_) => {
            this.bot.sendMessage(
              msg.from.id,
              'Subscribe Failed. Please try again /subscribe',
            );
          },
        );

        this.findAll().then((r) => {
          console.log(r);
        });
      });
    });

    this.bot.onText(/\/leave/, (msg, match) => {
      this.handleBlockedUser(msg.from.id).then((isBlocked) => {
        if (isBlocked == true) return;

        this.findUser(msg.from.id.toString()).then((user) => {
          if (user != null) {
            this.deleteUser(msg.from.id.toString());
          } else {
            this.bot.sendMessage(
              msg.from.id,
              'You are not subscribed to weather updates.',
            );
          }
        });
      });
    });
  }

  async saveUser(userDto: CreateUserDto): Promise<User> {
    this.findUser(userDto.id).then((r) => {
      if (r == null) {
        const createdUser = new this.userModel(userDto);
        console.log('new user');
        return createdUser.save();
      } else {
        console.log('User already exists');
        return null;
      }
    });
    return null;
  }

  async findUser(id: String): Promise<User> {
    return this.userModel.findOne({ id: id }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async deleteUser(id: String) {
    this.userModel.deleteOne({ id: id }).then(
      () => {
        this.bot.sendMessage(id, 'You have successfully unsubscribed.');
      },
      (_) => {
        this.bot.sendMessage(
          id,
          'Something went wrong , please try the command again',
        );
      },
    );
  }

  async deleteUserFromDb(id: String): Promise<Boolean> {
    return this.userModel
      .deleteOne({ id: id })
      .exec()
      .then(
        (res) => {
          return true;
        },
        () => {
          return false;
        },
      );
  }

  async blockUser(id: string, block: boolean): Promise<Boolean> {
    return this.userModel
      .findOneAndUpdate({ id: id }, { isBlocked: block })
      .exec()
      .then(
        () => {
          return true;
        },
        () => {
          return false;
        },
      );
  }

  async updateKey(key: string): Promise<Boolean> {
    this.bot = null;
    this.bot = new this.TelegramBot(key, {
      polling: true,
      request: {
        agentClass: Agent,
        agentOptions: {
          socksHost: process.env.PROXY_SOCKS5_HOST,
          socksPort: parseInt(process.env.PROXY_SOCKS5_PORT),
        },
      },
    });
    return this.bot != null;
  }

  async handleBlockedUser(id: string): Promise<boolean> {
    const r = await this.findAll();
    r.forEach((user) => {
      if (user.id == id && user.isBlocked == true) {
        this.bot.sendMessage(id, 'You have been blocked by the admin');
        return user.isBlocked;
      }
    });
    return false;
  }

  @Cron('0 0 8 * * *', {
    timeZone: 'Asia/Kolkata',
  })
  sendWeatherUpdates() {
    this.findAll().then((users) => {
      users.forEach((user) => {
        const query =
          'http://api.openweathermap.org/data/2.5/weather?q=' +
          user.city +
          '&appid=aa59028daae8ba01ab3074bf99165100';

        let resp = this.httpService.get(query);
        resp.toPromise().then((response) => {
          let res = response.data;
          const temp = Math.round(parseInt(res.main.temp_min) - 273.15);

          const pressure = Math.round(parseInt(res.main.pressure) - 1013.15);

          const rise = new Date(parseInt(res.sys.sunrise) * 1000);

          const set = new Date(parseInt(res.sys.sunset) * 1000);

          this.bot.sendMessage(
            user.id,
            '**** ' +
              res.name +
              ' ****\nTemperature: ' +
              String(temp) +
              '°C\nHumidity: ' +
              res.main.humidity +
              ' %\nWeather: ' +
              res.weather[0].description +
              '\nPressure: ' +
              String(pressure) +
              ' atm\nSunrise: ' +
              rise.toLocaleTimeString() +
              ' \nSunset: ' +
              set.toLocaleTimeString() +
              '\nCountry: ' +
              res.sys.country,
          );
        });
      });
    });
  }
}

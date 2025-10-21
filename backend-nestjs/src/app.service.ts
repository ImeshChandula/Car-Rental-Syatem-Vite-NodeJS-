import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    const port = this.configService.get<string>('PORT', 'defaultValue');
    console.log('Server running on port ', port);

    return 'Server is running...!';
  }
}

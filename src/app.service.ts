import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  
  async getHello(): Promise<string> {
    try {
      console.log('hello');
      const prisma = new  PrismaClient();
      
     await prisma.user.create({
        data: {
          email: 'test@gmail.com',
          name: 'test',
          gender: true,
          password: '123456'
        },
      });
      return 'Hello World!';
    } catch (error) {
      console.log(error);
      return 'Error';
    }
  }
}

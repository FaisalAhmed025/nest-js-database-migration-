import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';

import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User)
  private userModel:typeof User, private sequelize:Sequelize){}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  findOne(id: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }

  async createMany() {
    try {
      await this.sequelize.transaction(async t => {
        const transactionHost = { transaction: t };
  
        await this.userModel.create(
            { firstName: 'Abraham', lastName: 'Lincoln' },
            transactionHost,
        );
        await this.userModel.create(
            { firstName: 'John', lastName: 'Boothe' },
            transactionHost,
        );
      });
    } catch (err) {
      // Transaction has been rolled back
      // err is whatever rejected the promise chain returned to the transaction callback
    }
  }
  
}

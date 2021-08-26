import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(login): Promise<any> {
    return await this.usersRepository.findOne({ login });
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = (await this.usersRepository.create(createUserDto)).save();
      const { password, ...data } = await user;
      return data;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return {
          message:
            'Użytkownik o takim loginie lub imieniu i nazwisku już istnieje.',
        };
      }
    }
  }

  async findAll() {
    return await this.usersRepository.find();
  }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }
  //
  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}

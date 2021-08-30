import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findById(id: number) {
    return await this.usersRepository.findOne(id);
  }

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
  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.currentPassword) {
      const user = await this.findById(id);
      if (await compare(updateUserDto.currentPassword, user.password)) {
        for (const prop in updateUserDto) user[prop] = updateUserDto[prop];
        if (updateUserDto['password'])
          user.password = await hash(user.password, 10);
        return await user.save();
      }
    } else return;
  }

  async patch(id: number, patchUserDto: PatchUserDto) {
    patchUserDto['isVerified'] = patchUserDto['isVerified'] === 'true';
    return await this.usersRepository.update(id, patchUserDto);
  }

  async remove(id: number) {
    return await this.usersRepository.delete(id);
  }
}

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

  // Znajdź jednego użytkownika
  async findById(id: number) {
    return await this.usersRepository.findOne(id);
  }

  // Znajdź jednego użytkownika na podstawie jego loginu
  async findOne(login): Promise<any> {
    return await this.usersRepository.findOne({ login });
  }

  // Utwórz nowego użytkownika
  async create(createUserDto: CreateUserDto) {
    try {
      const user = (await this.usersRepository.create(createUserDto)).save();
      // Wydzieł hasło z całego obiektu użytkownika (przypisanie destrukturyzujące / object destructuring)
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

  // Znajdź wszystkich użytkowników
  async findAll() {
    return await this.usersRepository.find();
  }

  // Zaktualizuj użytkownika
  async update(id: number, updateUserDto: UpdateUserDto) {
    // Jeżeli wprowadzono aktualne hasło
    if (updateUserDto.currentPassword) {
      const user = await this.findById(id);
      // Jeżeli aktualne hasło odpowiada temu zapisanemu w bazie danych
      if (await compare(updateUserDto.currentPassword, user.password)) {
        for (const prop in updateUserDto) user[prop] = updateUserDto[prop];
        // Zaszyfruj hasło przed wprowadzeniem do bazy danych
        if (updateUserDto['password'])
          user.password = await hash(user.password, 10);
        return await user.save();
      }
    } else return;
  }

  // Zaktualizuj użytkownika (status weryfikacji)
  async patch(id: number, patchUserDto: PatchUserDto) {
    patchUserDto['isVerified'] = patchUserDto['isVerified'] === 'true';
    return await this.usersRepository.update(id, patchUserDto);
  }

  // Usuń użytkownika
  async remove(id: number) {
    return await this.usersRepository.delete(id);
  }
}

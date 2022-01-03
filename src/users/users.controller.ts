import {
  Controller,
  Post,
  Body, Patch, Param, Delete, Put
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../common/decorators/public.decorator';
import { PatchUserDto } from './dto/patch-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Węzęł końcowy (endpoint) ustawiony jako publiczny, żeby udostępnić rejestację użytkownikom
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() patchUserDto: PatchUserDto) {
    return await this.usersService.patch(+id, patchUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}

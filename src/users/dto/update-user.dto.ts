import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  name?: string;
  login?: string;

  @IsNotEmpty()
  currentPassword!: string;
}

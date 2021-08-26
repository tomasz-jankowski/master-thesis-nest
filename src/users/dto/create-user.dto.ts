import { IsNotEmpty, Matches, MinLength, NotEquals } from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Imię i nazwisko nie mogą być puste.' })
  name!: string;

  @IsNotEmpty({ message: 'Login nie może być pusty.' })
  @NotEquals('root')
  login!: string;

  @IsNotEmpty({ message: 'Hasło nie może być puste.' })
  @MinLength(8, { message: 'Hasło musi zawierać min. 8 znaków.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Hasło musi zawierać małą literę, dużą literę i cyfrę lub znak specjalny.',
  })
  password!: string;

  @IsNotEmpty()
  @Match('password')
  passwordConfirm!: string;
}

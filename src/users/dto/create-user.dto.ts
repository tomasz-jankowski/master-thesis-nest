import { IsNotEmpty, Matches, MinLength, NotEquals } from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export class CreateUserDto {
  // Pole nie może być puste, w przeciwnym wypadku odrzuć i zwróć wiadomość "message"
  @IsNotEmpty({ message: 'Imię i nazwisko nie mogą być puste.' })
  name!: string;

  @IsNotEmpty({ message: 'Login nie może być pusty.' })
  @NotEquals('root', {
    message: 'Nie można dodać użytkownika o loginie "root".',
  })
  login!: string;

  @IsNotEmpty({ message: 'Hasło nie może być puste.' })
  // Pole musi zawierać minimum 8 znaków
  @MinLength(8, { message: 'Hasło musi zawierać min. 8 znaków.' })
  // Pole musi spełniać jeden z warunków:
  //   - mała litera
  //   - duża litera
  //   - cyfra lub znak specjalny
  // Określone przez wyrażenie regularne (regular expression/regex)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Hasło musi zawierać małą literę, dużą literę i cyfrę lub znak specjalny.',
  })
  password!: string;

  @IsNotEmpty()
  // Pole musi być zgodne z polem "password"
  @Match('password')
  passwordConfirm!: string;
}

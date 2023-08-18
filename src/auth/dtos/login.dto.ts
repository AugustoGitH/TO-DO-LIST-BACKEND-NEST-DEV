import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({
    message: 'O email é requirido!',
  })
  @IsEmail(
    {},
    {
      message: 'O nome é requirido!',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'A senha é requirida!',
  })
  @MinLength(6, {
    message: 'A senha deve conter no minimo 6 caracteres!',
  })
  password: string;
}

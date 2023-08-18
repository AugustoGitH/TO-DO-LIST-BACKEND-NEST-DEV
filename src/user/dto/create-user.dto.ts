import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'O nome é requirido!',
  })
  @IsString({
    message: 'O nome precisa ser uma string!',
  })
  name: string;

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
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/, {
    message:
      'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número.',
  })
  password: string;
}

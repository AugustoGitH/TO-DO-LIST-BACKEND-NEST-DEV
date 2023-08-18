import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({
    message: 'O nome é requirido!',
  })
  name: string;
}

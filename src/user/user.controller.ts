import {
  Param,
  Controller,
  Delete,
  Get,
  ParseUUIDPipe,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get('user')
  async getUsers() {
    return await this.appService.findAll();
  }

  @Post('user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.appService.create(createUserDto);
  }

  @Delete('user/:id')
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.appService.delete({ id });
  }
}

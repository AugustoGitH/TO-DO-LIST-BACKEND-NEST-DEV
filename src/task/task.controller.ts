import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtTokenFromCookie } from 'src/decorators/jwt-cookie.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';

import { IFieldsTaskUpdated } from './interfaces/task.interface';

@Controller('api')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly appService: TaskService) {}

  @Get('task')
  getTasks(@JwtTokenFromCookie() token: string) {
    return this.appService.getTasks(token);
  }

  @Post('task')
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @JwtTokenFromCookie() token: string,
  ) {
    return this.appService.createTask(createTaskDto, token);
  }
  // @Query() updateTaskDto: UpdateTaskDto
  @Put('task')
  updateTask(
    @Query() queryParams: IFieldsTaskUpdated & { id: string },
    @JwtTokenFromCookie() token: string,
  ) {
    return this.appService.updateTask(queryParams, token);
  }

  @Delete('task/:id')
  deleteTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @JwtTokenFromCookie() token: string,
  ) {
    return this.appService.deleteTask(id, token);
  }
}

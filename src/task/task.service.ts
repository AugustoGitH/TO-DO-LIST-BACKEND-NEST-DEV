import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

import { UserService } from 'src/user/user.service';
import { IFieldsTaskUpdated, ITask } from './interfaces/task.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  async getTasks(token: string) {
    const idUser = await this.authService.getUserIdFromToken(token);
    try {
      const user = await this.userService.findOneOurFail({
        where: { id: idUser },
      });
      return {
        message: 'Tasks resgatas com sucesso!',
        tasks: user.tasks,
      };
    } catch (error) {
      throw new NotFoundException();
    }
  }
  async createTask(createTaskDto: CreateTaskDto, token: string) {
    const idUser = await this.authService.getUserIdFromToken(token);
    const newTask: ITask = {
      ...createTaskDto,
      id: uuidv4(),
      wasFinished: false,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    const taskCreated = await this.userService.addTaskToUser(idUser, newTask);

    return {
      message: 'Task criada com sucesso!',
      taskCreated,
    };
  }
  async updateTask(
    queryParams: IFieldsTaskUpdated & { id: string },
    token: string,
  ) {
    const { id: taskId, ...fieldsEdited } = queryParams;
    console.log(fieldsEdited);
    const idUser = await this.authService.getUserIdFromToken(token);
    const idTaskDeleted = await this.userService.updateTaskToUser(
      taskId,
      idUser,
      {
        ...(fieldsEdited?.name !== undefined && { name: fieldsEdited.name }),
        ...(fieldsEdited?.wasFinished !== undefined && {
          wasFinished: Boolean(fieldsEdited.wasFinished),
        }),
      },
    );

    return {
      message: 'Taks atualizada com sucesso!',
      idTaskDeleted,
    };
  }
  async deleteTask(idTask: string, token: string) {
    const idUser = await this.authService.getUserIdFromToken(token);
    const idTaskDeleted = await this.userService.removeTaskToUser(
      idTask,
      idUser,
    );
    return {
      message: 'Task deletada com sucesso!',
      idTaskDeleted,
    };
  }
}

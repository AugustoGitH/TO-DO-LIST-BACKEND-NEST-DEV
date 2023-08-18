import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashSync } from 'bcrypt';
import { UserEntity } from './interfaces/user.entity';
import { IFieldsTaskUpdated, ITask } from 'src/task/interfaces/task.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOneOurFail(options: FindOneOptions<UserEntity>) {
    try {
      return await this.userRepository.findOneOrFail(options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async create(
    createUserDto: CreateUserDto,
    cryptoPassword = true,
  ): Promise<UserEntity> {
    return await this.userRepository.save({
      ...createUserDto,
      password: cryptoPassword
        ? hashSync(createUserDto.password, 10)
        : createUserDto.password,
    });
  }

  async delete({ id }) {
    try {
      const deleteResult = await this.userRepository.delete(id);
      return deleteResult.affected > 0;
    } catch (error) {
      throw new NotFoundException('User não encontrado!');
    }
  }
  async updateTaskToUser(
    taskId: string,
    userId: string,
    { name, wasFinished }: IFieldsTaskUpdated,
  ) {
    const user = await this.findOneOurFail({ where: { id: userId } });
    try {
      const taskSelected = user.tasks.find((task) => task.id === taskId);
      user.tasks = [
        ...user.tasks.filter((task) => task.id !== taskId),
        {
          ...taskSelected,
          ...(name !== undefined && { name }),
          ...(wasFinished !== undefined && { wasFinished }),
        },
      ];

      await this.userRepository.save(user);

      return taskId;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException();
    }
  }
  async removeTaskToUser(taskId: string, userId: string) {
    const user = await this.findOneOurFail({ where: { id: userId } });
    try {
      user.tasks = user.tasks.filter((task) => task.id !== taskId);

      await this.userRepository.save(user);

      return taskId;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException();
    }
  }
  async addTaskToUser(userId: string, newTask: ITask) {
    const user = await this.findOneOurFail({ where: { id: userId } });
    try {
      user.tasks.push(newTask);

      await this.userRepository.save(user);

      return newTask;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}

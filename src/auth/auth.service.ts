import {
  ConflictException,
  Injectable,
  NotFoundException,
  Res,
} from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import { compareSync } from 'bcrypt';
import { UserEntity } from 'src/user/interfaces/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: CreateUserDto) {
    const user = await this.validateUser(
      registerDto.email,
      registerDto.password,
    );
    if (user)
      throw new ConflictException('Email já está registrado em nosso sistema!');

    try {
      await this.userService.create(registerDto);
      return {
        message: 'Usuário registrado com sucesso!',
      };
    } catch (error) {
      throw new ConflictException('Ocorreu um erro ao realizar registro!');
    }
  }

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      res.status(401).send({
        message: 'Email ou senha incorretos!',
      });
      return;
    }

    const access_token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.status(200).send({
      message: 'Login realizado com sucesso!',
    });
  }

  async validateUser(email: string, passoword: string) {
    let user: UserEntity;
    try {
      user = await this.userService.findOneOurFail({ where: { email } });
    } catch (error) {
      return null;
    }

    const isPasswordValid = compareSync(passoword, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  async getUserIdFromToken(token: string): Promise<string | null> {
    try {
      const decodedToken = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      return decodedToken.sub;
    } catch (error) {
      return null;
    }
  }
}

import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

import * as bcryptjs from "bcryptjs";

import { CreateUserDto, UpdateAuthDto, LoginDto, RegisterUserDto } from './dto';
import { User } from './entities/user.entity';

import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ){}

  async create(createUserDto: CreateUserDto):Promise<User> {
    
    try {
      const { password, ...userData } = createUserDto;
      const newUser = new this.userModel( {
        password: bcryptjs.hashSync( password, 10 ),
        ...userData
      } );
      
      await newUser.save();
      const { password:_, ...user } = newUser.toJSON();

      return user;
      
      
    } catch (error) {
      if (error.code === 11000){
        throw new BadRequestException(`${ createUserDto.email } already exists`)
      }
      throw new InternalServerErrorException('something terribel happend')
    }
  }
  async register( registerDto:RegisterUserDto ):Promise<LoginResponse>{

    const user = await this.create( registerDto )

    return {
      user:user,
      token:this.getJwtToken({id:user._id})
    }

  }

  async login(loginDto:LoginDto):Promise<LoginResponse>{

   const {email, password} = loginDto;
   const user = await this.userModel.findOne({email})
   if( !user ){
    throw new UnauthorizedException('Not valid credentials - email')
   }
   if ( !bcryptjs.compareSync( password, user.password ) ){
    throw new UnauthorizedException('Not valid credentials - password')
   }

   const {password:_, ...rest} = user.toJSON();

   return {
    user:rest,
    token: this.getJwtToken({ id:user.id }),
   }
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const token = this.jwtService.sign({ userId: user._id }, { expiresIn: '1h' });
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Para restablecer tu contraseña, visita el siguiente enlace: ${resetUrl}`,
    });

    return { message: 'Correo enviado' };
  }

  async resetPassword(token: string, newPassword: string) {
    const payload = this.jwtService.verify(token);
    const user = await this.findById(payload.userId);
  
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
  
    user.password = await bcryptjs.hash(newPassword, 10); // Usa bcrypt para encriptar la contraseña
    await this.update(user._id, user);
  
    return { message: 'Contraseña actualizada' };
  }

  findAll():Promise<User[]> {
    return this.userModel.find();
  }

  //para restablecer la contraseña
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  // para no mostrar la contraseña
  async findUserById(id:string){
    const user = await this.userModel.findById(id);
    const { password, ...rest } = user.toJSON();
    return rest;
  }

  // Actualizar un usuario
  async update(userId: string, updateData: Partial<User>): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }


  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument } from '../schemas/admin.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  sub: string; // User ID
  username: string;
  role: 'admin' | 'user';
  userRole?: string; // For users: LOVER, FRIEND, COLLEAGUE, FAMILY
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async adminLogin(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const admin = await this.adminModel.findOne({ username });
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: admin._id.toString(),
      username: admin.username,
      role: 'admin',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: admin._id,
        username: admin.username,
        role: 'admin',
      },
    };
  }

  async userLogin(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user._id.toString(),
      username: user.username,
      role: 'user',
      userRole: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        role: 'user',
        userRole: user.role,
        luckyMoneyStatus: user.luckyMoneyStatus,
      },
    };
  }

  async validateUser(userId: string, role: 'admin' | 'user') {
    if (role === 'admin') {
      return this.adminModel.findById(userId).select('-password');
    } else {
      return this.userModel.findById(userId).select('-password');
    }
  }
}

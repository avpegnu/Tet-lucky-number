import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, LuckyMoneyStatus } from '../schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(adminId: string, createUserDto: CreateUserDto) {
    const { username, password, role, availableAmounts } = createUserDto;

    // Check if username already exists
    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Hash password (class-validator ensures it's not empty)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      username,
      password: hashedPassword,
      role,
      createdBy: adminId,
      availableAmounts,
      luckyMoneyStatus: LuckyMoneyStatus.NOT_PLAYED,
    });

    await newUser.save();

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  }

  async updateUser(
    adminId: string,
    userId: string,
    updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check ownership
    if (user.createdBy.toString() !== adminId) {
      throw new ForbiddenException('You can only update users you created');
    }

    // Update password if provided
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Update role if provided (only allow user roles, not ADMIN)
    if (updateUserDto.role) {
      user.role = updateUserDto.role;
    }

    // Update available amounts if provided
    if (updateUserDto.availableAmounts) {
      user.availableAmounts = updateUserDto.availableAmounts;
    }

    await user.save();

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async getUsersByAdmin(adminId: string) {
    const users = await this.userModel
      .find({ createdBy: adminId })
      .select('-password')
      .exec();

    return users;
  }

  async getUserById(adminId: string, userId: string) {
    const user = await this.userModel.findById(userId).select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check ownership
    if (user.createdBy.toString() !== adminId) {
      throw new ForbiddenException('You can only view users you created');
    }

    return user;
  }

  async deleteUser(adminId: string, userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check ownership
    if (user.createdBy.toString() !== adminId) {
      throw new ForbiddenException('You can only delete users you created');
    }

    await this.userModel.findByIdAndDelete(userId);

    return { message: 'User deleted successfully' };
  }
}

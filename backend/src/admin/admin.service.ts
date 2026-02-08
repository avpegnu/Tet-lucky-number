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
    const { username, password, role, availableAmounts, name, customGreeting } =
      createUserDto;

    // Check if username already exists
    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new ConflictException('Tên đăng nhập đã tồn tại');
    }

    // Hash password (class-validator ensures it's not empty)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      username,
      name: name || null,
      password: hashedPassword,
      role,
      createdBy: adminId,
      availableAmounts,
      customGreeting: customGreeting || null,
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
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Check ownership
    if (user.createdBy.toString() !== adminId) {
      throw new ForbiddenException(
        'Bạn chỉ có thể cập nhật người dùng do bạn tạo',
      );
    }

    // Update name if provided
    if (updateUserDto.name !== undefined) {
      user.name = updateUserDto.name || null;
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

    // Update customGreeting if provided (allow clearing by setting empty)
    if (updateUserDto.customGreeting !== undefined) {
      user.customGreeting = updateUserDto.customGreeting || null;
    }

    await user.save();

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async getUsersByAdmin(
    adminId: string,
    options?: {
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
      status?: string;
    },
  ) {
    const filter: Record<string, unknown> = { createdBy: adminId };

    // Search by username or name
    if (options?.search) {
      const regex = new RegExp(options.search, 'i');
      filter.$or = [{ username: regex }, { name: regex }];
    }

    // Filter by role
    if (options?.role) {
      filter.role = options.role;
    }

    // Filter by status
    if (options?.status === 'PLAYED' || options?.status === 'NOT_PLAYED') {
      filter.luckyMoneyStatus = options.status;
    } else if (options?.status === 'TRANSFERRED') {
      filter.luckyMoneyStatus = 'PLAYED';
      filter.isTransferred = true;
    } else if (options?.status === 'NOT_TRANSFERRED') {
      filter.luckyMoneyStatus = 'PLAYED';
      filter.isTransferred = { $ne: true };
    }

    const query = this.userModel
      .find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    if (options?.page && options?.limit) {
      const skip = (options.page - 1) * options.limit;
      const [users, total] = await Promise.all([
        query.skip(skip).limit(options.limit).exec(),
        this.userModel.countDocuments(filter),
      ]);

      return {
        users,
        pagination: {
          page: options.page,
          limit: options.limit,
          total,
          totalPages: Math.ceil(total / options.limit),
        },
      };
    }

    const users = await query.exec();
    return { users, pagination: null };
  }

  async getUserById(adminId: string, userId: string) {
    const user = await this.userModel.findById(userId).select('-password');

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Check ownership
    if (user.createdBy.toString() !== adminId) {
      throw new ForbiddenException(
        'Bạn chỉ có thể xem người dùng do bạn tạo',
      );
    }

    return user;
  }

  async deleteUser(adminId: string, userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Check ownership
    if (user.createdBy.toString() !== adminId) {
      throw new ForbiddenException(
        'Bạn chỉ có thể xóa người dùng do bạn tạo',
      );
    }

    await this.userModel.findByIdAndDelete(userId);

    return { message: 'Xóa người dùng thành công' };
  }

  async resetUserStatus(adminId: string, userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    if (user.createdBy.toString() !== adminId) {
      throw new ForbiddenException(
        'Bạn chỉ có thể reset người dùng do bạn tạo',
      );
    }

    user.luckyMoneyStatus = LuckyMoneyStatus.NOT_PLAYED;
    user.wonAmount = 0;
    user.bankInfo = null;
    user.isTransferred = false;
    await user.save();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async toggleTransferred(adminId: string, userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    if (user.createdBy.toString() !== adminId) {
      throw new ForbiddenException(
        'Bạn chỉ có thể cập nhật người dùng do bạn tạo',
      );
    }

    user.isTransferred = !user.isTransferred;
    await user.save();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }
}

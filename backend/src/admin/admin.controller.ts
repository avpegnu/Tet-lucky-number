import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { AdminGuard } from '../auth/guards/admin.guard';

interface AuthUser {
  userId: string;
  username: string;
  role: string;
}

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('users')
  async createUser(
    @Request() req: { user: AuthUser },
    @Body() createUserDto: CreateUserDto,
  ) {
    const adminId = req.user.userId;
    return this.adminService.createUser(adminId, createUserDto);
  }

  @Put('users/:id')
  async updateUser(
    @Request() req: { user: AuthUser },
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const adminId = req.user.userId;
    return this.adminService.updateUser(adminId, userId, updateUserDto);
  }

  @Get('users')
  async getUsers(@Request() req: { user: AuthUser }) {
    const adminId = req.user.userId;
    return this.adminService.getUsersByAdmin(adminId);
  }

  @Get('users/:id')
  async getUserById(
    @Request() req: { user: AuthUser },
    @Param('id') userId: string,
  ) {
    const adminId = req.user.userId;
    return this.adminService.getUserById(adminId, userId);
  }

  @Delete('users/:id')
  async deleteUser(
    @Request() req: { user: AuthUser },
    @Param('id') userId: string,
  ) {
    const adminId = req.user.userId;
    return this.adminService.deleteUser(adminId, userId);
  }
}

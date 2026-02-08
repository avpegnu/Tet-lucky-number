import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
  async getUsers(
    @Request() req: { user: AuthUser },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    const adminId = req.user.userId;
    return this.adminService.getUsersByAdmin(adminId, {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search: search || undefined,
      role: role || undefined,
      status: status || undefined,
    });
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

  @Post('users/:id/reset')
  async resetUser(
    @Request() req: { user: AuthUser },
    @Param('id') userId: string,
  ) {
    const adminId = req.user.userId;
    return this.adminService.resetUserStatus(adminId, userId);
  }

  @Post('users/:id/toggle-transferred')
  async toggleTransferred(
    @Request() req: { user: AuthUser },
    @Param('id') userId: string,
  ) {
    const adminId = req.user.userId;
    return this.adminService.toggleTransferred(adminId, userId);
  }
}

import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard) // Protect all routes
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Roles('superadmin')  // Only superadmin can create permissions
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.createPermission(createPermissionDto);
  }

  @Get()
  async findAll() {
    return this.permissionsService.getPermissions();
  }
}

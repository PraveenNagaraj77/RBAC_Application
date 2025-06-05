import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard) // Protect all routes here
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Create a new role - only superadmin
  @Post()
  @Roles('superadmin')
  async create(@Body() createRoleDto: CreateRoleDto): Promise<any> {
    return this.rolesService.createRole(createRoleDto);
  }

  // Get all roles - accessible to authenticated users with any role
  @Get()
  async findAll(): Promise<any[]> {
    return this.rolesService.getRoles();
  }

  // Add permissions to a role by role id - only superadmin
  @Post(':id/permissions')
  @Roles('superadmin')
  async addPermissions(
    @Param('id') id: string,
    @Body('permissionIds') permissionIds: string[],
  ): Promise<any> {
    const role = await this.rolesService.addPermissionsToRole(id, permissionIds);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { RoleDocument } from '../roles/schemas/role.schema';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  async seedSuperAdmin() {
    try {
      let superAdminRole: RoleDocument | null = await this.rolesService.findByName('superadmin');

      if (!superAdminRole) {
        superAdminRole = await this.rolesService.createRole({ name: 'superadmin' });
        this.logger.log('Created superadmin role');
      } else {
        this.logger.log('Superadmin role already exists');
      }

      let superAdminUser: UserDocument | null = await this.usersService.findByEmail('superadmin@example.com');

      if (!superAdminUser) {
        superAdminUser = await this.usersService.create({
          email: 'superadmin@example.com',
          password: 'SuperSecret123',
        });
        this.logger.log('Created superadmin user');
      } else {
        this.logger.log('Superadmin user already exists');
      }

      const roleIdStr = superAdminRole._id.toString();
      const userRoleIds = superAdminUser.roles.map((roleId: Types.ObjectId) => roleId.toString());

      if (!userRoleIds.includes(roleIdStr)) {
        await this.usersService.assignRoles(
          superAdminUser._id.toString(),
          [roleIdStr],
        );
        this.logger.log('Assigned superadmin role to user');
      } else {
        this.logger.log('Superadmin user already has the superadmin role');
      }

      return { superAdminUser, superAdminRole };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to seed superadmin:', error.message);
      } else {
        this.logger.error('Failed to seed superadmin:', String(error));
      }
      throw error;
    }
  }
}

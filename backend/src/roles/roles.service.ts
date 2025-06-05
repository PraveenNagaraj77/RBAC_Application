import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>) {}

  /**
   * Find a role by its name
   * @param name string role name
   * @returns RoleDocument or null if not found
   */
  async findByName(name: string): Promise<RoleDocument | null> {
    return this.roleModel.findOne({ name }).exec();
  }

  /**
   * Create a new role document
   * @param createRoleDto data to create role
   * @returns newly created RoleDocument
   */
  async createRole(createRoleDto: CreateRoleDto): Promise<RoleDocument> {
    const newRole = new this.roleModel(createRoleDto);
    return newRole.save();
  }

  /**
   * Get all roles, populated with permissions
   * @returns array of RoleDocument
   */
  async getRoles(): Promise<RoleDocument[]> {
    return this.roleModel.find().populate('permissions').exec();
  }

  /**
   * Add permissions to a role by IDs, avoiding duplicates
   * @param roleId string role ObjectId as string
   * @param permissionIds array of permission ObjectId strings
   * @returns updated RoleDocument populated with permissions
   * @throws NotFoundException if role not found
   */
  async addPermissionsToRole(roleId: string, permissionIds: string[]): Promise<RoleDocument> {
    const role = await this.roleModel.findById(roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Convert existing and new permission IDs to strings for deduplication
    const existingPermissionIds = (role.permissions as Types.ObjectId[]).map(p => p.toString());
    const newPermissionIds = permissionIds.map(id => id.toString());

    // Combine and deduplicate IDs
    const combinedIds = Array.from(new Set([...existingPermissionIds, ...newPermissionIds]));

    // Map back to ObjectId instances
    role.permissions = combinedIds.map(id => new Types.ObjectId(id));

    // Save updated role
    await role.save();

    // Re-fetch updated role with populated permissions
    const updatedRole = await this.roleModel.findById(roleId).populate('permissions').exec();

    if (!updatedRole) {
      // This is very unlikely, but handle just in case
      throw new NotFoundException(`Role with ID ${roleId} not found after update`);
    }

    return updatedRole;
  }
}

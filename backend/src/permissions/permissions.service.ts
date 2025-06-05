import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>,
  ) {}

  async createPermission(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const existing = await this.permissionModel.findOne({ name: createPermissionDto.name });
    if (existing) {
      throw new ConflictException('Permission already exists');
    }
    const permission = new this.permissionModel(createPermissionDto);
    return permission.save();
  }

  async getPermissions(): Promise<Permission[]> {
    return this.permissionModel.find().exec();
  }
}

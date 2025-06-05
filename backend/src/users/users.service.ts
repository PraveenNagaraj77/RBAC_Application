import { Injectable, NotFoundException , BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().populate('roles').exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).populate('roles').exec();
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  // New method: getProfile is same as findOne but semantically clearer
  async getProfile(userId: string): Promise<UserDocument> {
    return this.findOne(userId);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
  return this.userModel
    .findOne({ email })
    .select('+password')    // <-- Add this line to include password field
    .populate('roles')
    .exec();
}

  async create(userDto: { email: string; password: string }): Promise<UserDocument> {
  const newUser = new this.userModel({
    email: userDto.email,
    password: userDto.password, // ✅ Already hashed in AuthService
    roles: [],
  });
  return newUser.save();
}

  async update(id: string, updateDto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    if (updateDto.email) user.email = updateDto.email;

    if (updateDto.password) {
  const salt = await bcrypt.genSalt(10); // 👈 Explicit salt generation
  user.password = await bcrypt.hash(updateDto.password, salt);
}

    if (updateDto.role) {
      if (Array.isArray(updateDto.role)) {
        user.roles = updateDto.role.map((id) => new Types.ObjectId(id));
      } else {
        user.roles = [new Types.ObjectId(updateDto.role)];
      }
    }

    await user.save();

    // Return populated user with roles
    return (await this.userModel.findById(id).populate('roles').exec())!;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`User with ID ${id} not found`);
    return { deleted: true };
  }

  



  async findByIdWithRolesAndPermissions(userId: string): Promise<UserDocument | null> {
  return this.userModel
    .findById(userId)
    .populate({
      path: 'roles',
      populate: {
        path: 'permissions',
        model: 'Permission',
      },
    })
    .exec();
}



async assignRoles(userId: string, roleIds: string | string[]): Promise<UserDocument> {
    if (!roleIds || (Array.isArray(roleIds) && roleIds.length === 0)) {
      throw new BadRequestException('roleIds must be a non-empty string or array');
    }

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    if (typeof roleIds === 'string') {
      user.roles = [new Types.ObjectId(roleIds)];
    } else {
      user.roles = roleIds.map((id) => new Types.ObjectId(id));
    }

    await user.save();

    return (await this.userModel.findById(userId).populate('roles').exec())!;
  }


}

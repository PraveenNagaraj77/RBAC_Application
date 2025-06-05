// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from '../../roles/schemas/role.schema';

@Schema({ timestamps: true }) // Good practice for tracking createdAt, updatedAt
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: Role.name }], default: [] })
  roles: (Types.ObjectId | Role)[];

  // Optional: explicitly declare _id if used in services
  _id: Types.ObjectId;
}

export type UserDocument = User & Document & { _id: Types.ObjectId };

export const UserSchema = SchemaFactory.createForClass(User);

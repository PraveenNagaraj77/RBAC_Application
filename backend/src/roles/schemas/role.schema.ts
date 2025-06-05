// src/roles/schemas/role.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Permission } from './permission.schema';

@Schema()
export class Role {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Permission' }], default: [] })
  permissions: Types.ObjectId[] | Permission[];

  // Add this line to explicitly declare the _id field type:
  _id: Types.ObjectId;
}

// Tell TS the document type explicitly includes _id as ObjectId
export type RoleDocument = Role & Document & { _id: Types.ObjectId };

export const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.set('timestamps', true);

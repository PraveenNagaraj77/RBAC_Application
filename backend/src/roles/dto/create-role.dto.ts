import { IsString, IsArray, ArrayNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsArray()
  @IsOptional()
  permissions?: string[]; // array of permission IDs
}

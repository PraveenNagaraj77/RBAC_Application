// src/users/dto/create-user.dto.ts
export class CreateUserDto {
  email: string;
  password: string;
  role?: string;  // Optional role ID string if assigning role at creation
}

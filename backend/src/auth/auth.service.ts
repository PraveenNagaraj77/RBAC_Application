import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rolesService: RolesService,
  ) {}

  async validateUser(email: string, password: string) {
    const normalizedEmail = email.toLowerCase();
    this.logger.debug(`Validating user with email: ${normalizedEmail}`);

    const user = await this.usersService.findByEmail(normalizedEmail);
    if (!user) {
      this.logger.warn(`User not found with email: ${normalizedEmail}`);
      return null;
    }

    this.logger.debug(`Stored password hash: ${user.password}`);
    const passwordValid = await bcrypt.compare(password, user.password);
    this.logger.debug(`Password valid? ${passwordValid}`);

    if (!passwordValid) {
      this.logger.warn(`Invalid password for user: ${normalizedEmail}`);
      return null;
    }

    this.logger.log(`User validated: ${normalizedEmail}`);
    return user;
  }

  async login(user: any) {
    this.logger.log(`Generating token for user: ${user.email}`);

    const payload = {
      sub: user._id,
      email: user.email,
      roles: user.roles?.map(r => r.name) || [],
      permissions: user.permissions?.map(p => p.name) || [],
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: user.email,
        roles: user.roles,
        permissions: user.permissions,
      },
    };
  }

  async register(email: string, password: string) {
    const normalizedEmail = email.toLowerCase();
    this.logger.log(`Registering new user: ${normalizedEmail}`);

    const salt = await bcrypt.genSalt(10);
    this.logger.debug(`Generated salt: ${salt}`);

    const hashedPassword = await bcrypt.hash(password, salt);
    this.logger.debug(`Hashed password: ${hashedPassword}`);

    const newUser = await this.usersService.create({
      email: normalizedEmail,
      password: hashedPassword,
    });

    this.logger.log(`New user created with ID: ${newUser._id}`);

    const userRole = await this.rolesService.findByName('user');
    if (userRole) {
      await this.usersService.assignRoles(newUser._id.toString(), [userRole._id.toString()]);
      this.logger.log(`Assigned 'user' role to: ${normalizedEmail}`);
    } else {
      this.logger.warn(`Default 'user' role not found`);
    }

    const userWithDetails = await this.usersService.findByEmail(normalizedEmail);
    this.logger.log(`User with roles/permissions ready. Logging in...`);

    return this.login(userWithDetails);
  }
}

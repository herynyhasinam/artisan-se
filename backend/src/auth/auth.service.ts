import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Prisma, Role, User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    if (await this.users.findByEmail(email)) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const role = dto.accountType === 'ARTISAN' ? Role.ARTISAN : Role.USER;
    if (role === Role.ARTISAN && (await this.users.artisanPhoneExists(dto.phone!))) {
      throw new ConflictException('Un artisan avec ce numéro existe déjà');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    try {
      const user = await this.users.create({
        name: dto.name,
        email,
        passwordHash,
        role,
        artisan:
          role === Role.ARTISAN
            ? {
                trade: dto.trade!,
                neighborhood: dto.neighborhood!,
                city: dto.city!,
                phone: dto.phone!,
                description: dto.description,
              }
            : undefined,
      });
      return this.buildResponse(user);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Email déjà utilisé');
      }
      throw e;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email.toLowerCase());
    const valid = user && (await bcrypt.compare(dto.password, user.passwordHash));
    if (!user || !valid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    return this.buildResponse(user);
  }

  private buildResponse(user: User) {
    const accessToken = this.jwt.sign({ sub: user.id, role: user.role });
    return {
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }
}

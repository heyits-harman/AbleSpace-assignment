import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string, name: string) {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Generate JWT
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });

    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }

  async login(email: string, password: string) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate JWT
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });

    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }

  async guestLogin() {
    // Create/return guest user
    let guestUser = await this.prisma.user.findUnique({
      where: { email: 'guest@pyramid.com' },
    });

    if (!guestUser) {
      guestUser = await this.prisma.user.create({
        data: {
          email: 'guest@pyramid.com',
          password: 'guest-password',
          name: 'Guest User',
        },
      });
    }

    // Generate JWT for guest
    const token = this.jwtService.sign({
      id: guestUser.id,
      email: guestUser.email,
    });

    return { user: { id: guestUser.id, email: guestUser.email, name: guestUser.name }, token };
  }

  async validateUser(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }
}
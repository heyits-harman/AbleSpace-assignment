import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() body: { email: string; password: string; name: string },
  ) {
    try {
      return await this.authService.signup(body.email, body.password, body.name);
    } catch (error) {
      throw new HttpException('Signup failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      return await this.authService.login(body.email, body.password);
    } catch (error) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('guest-login')
  async guestLogin() {
    try {
      return await this.authService.guestLogin();
    } catch (error) {
      throw new HttpException('Guest login failed', HttpStatus.BAD_REQUEST);
    }
  }
}
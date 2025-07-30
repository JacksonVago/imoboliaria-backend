import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { AuthService } from '../auth.service';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/roles.enum';

export class AuthenticateUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword({})
  password: string;
}

@Roles(Role.PUBLIC)
@Controller('/login')
export class AuthenticateUserController {
  constructor(private authService: AuthService) { }

  @Post()
  @HttpCode(200)
  async handle(@Body() data: AuthenticateUserDTO) {
    console.log(data);

    const { email, password } = data;
    const result = await this.authService.authenticateUser(email, password);
    return {
      access_token: result,
    };
  }
}

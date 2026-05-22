import { Body, Controller, Param, Post, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto)
    }

    @Post()
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto)
    }

    @Post()
    async activateUser(@Query('id') id: string, @Query('signed') signed: string) {
        return this.authService.activateUser(id, signed)
    }

    @Post()
    async forgotPassword(@Body() email: string) {
        return this.authService.forgotPassword(email)
    }

    @Post()
    async resetPassword(@Query('id') id: string, @Body() password: string) {
        return this.authService.resetPassword(id, password)
    }
}
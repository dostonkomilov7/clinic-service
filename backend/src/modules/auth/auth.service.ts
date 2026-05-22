import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../users/model/user.model";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UserRole } from "@/core/constants/constants";

@Injectable()
export class AuthService {
    constructor(@InjectModel(User) private readonly userModel: typeof User) {}

    async register(dto: RegisterDto) {
        
    }

    async login(dto: LoginDto) {

    }
    
    async activateUser(userId: string, signed: string ) {

    }

    async forgotPassword(email: string) {

    }

    async resetPassword(id: string, password: string) {

    }

    private async generateAccessToken(payload: {id: string, role: UserRole}) {

    }

    private async generateRefreshToken(payload: {id: string, role: UserRole}) {

    }

    private async hashPassword(password: string) {

    }
    private async comparePassword(originalPassword: string, hashedPassword: string) {

    }
}
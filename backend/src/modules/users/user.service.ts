import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./model/user.model";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private readonly userModel: typeof User) {}

    async getUsers() {
        const users = await this.userModel.findAll()

        return {
            success: true,
            data: users
        }
    }

    async updateUser(id: string, dto: UpdateUserDto) {
        const user = await this.userModel.findOne({where: {id}})

        if(!user) {
            throw new NotFoundException("User is not found")
        }

        await this.userModel.update(dto, {where: {id}})
        
        return {
            success: true,
            message: "Successfully updated"
        }
    }

    async deleteUser(id: string) {
        const user = await this.userModel.findOne({where: {id}})

        if(!user) {
            throw new NotFoundException("User is not found")
        }

        await this.userModel.destroy({where: {id}})

        return {
            success: true,
            message: "Successfully deleted"
        }
    }
}
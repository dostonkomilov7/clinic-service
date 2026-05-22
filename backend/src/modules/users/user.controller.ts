import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getUsers() {
        return await this.userService.getUsers();
    }

    @Patch('id')
    async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return await this.userService.updateUser(id, dto)
    }

    @Delete('id')
    async deleteUser(@Param('id') id: string) {
        return await this.userService.deleteUser(id)
    }
}
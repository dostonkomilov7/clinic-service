import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { SequelizeModule } from "@nestjs/sequelize";
import { Chat } from "./model/chat.model";

@Module({
    imports: [SequelizeModule.forFeature([Chat])],
    providers: [ChatGateway],
})

export class ChatModule { }
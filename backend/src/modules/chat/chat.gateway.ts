import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: '*',
    }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private readonly server: Server

    afterInit(server: Server) {
        console.log("Websocket initialiaze ⚠️")
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log("Client connected ✅ :", client.id)
        client.join(`user_room_${client.handshake.auth.id}`)
        console.log(`Foydalanuvchi ${client.handshake.auth.id} yangi soket bilan ulandi: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log("Client disconnected ❌ :", client.id)
    }

    @SubscribeMessage('message')
    async sendMessage(@MessageBody() data: { message: string, userId: string }, @ConnectedSocket() client: Socket) {
        console.log(data.message, client.id)

        this.server.to(`user_room_${data.userId}`).emit('message', { message: data.message, userId: client.id })
    }

    // @SubscribeMessage('join_room')
    // async joinRoom(@MessageBody() data: { roomId: string }, @ConnectedSocket() client: Socket) {
    //     client.join(data.roomId);
    //     console.log(`User ${client.id} joined room session: ${data.roomId}`);
    // }

    // @SubscribeMessage('room_message')
    // async roomMessage(@MessageBody() data: { message: string, roomId: string }, @ConnectedSocket() client: Socket) {
    //     console.log(
    //         `Room [${data.roomId}] Message: ${data.message} from ${client.id}`,
    //     );

    //     this.server.to(data.roomId).emit('room_message', { message: data.message, userId: client.id})
    // }
}
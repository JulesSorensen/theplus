import { Injectable, UnauthorizedException } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { User } from "src/users/entities/user.entity";

@Injectable()
@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private authService: AuthService) {}

  private clients: Map<string, { socket: Socket; user: any }> = new Map();

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.authorization;
      if (!token || !token.startsWith("Bearer "))
        throw new UnauthorizedException("Token format is invalid");

      const jwt = token.split(" ")[1];
      const payload = await this.authService.parseJwt(jwt);

      client.data.user = payload;
      this.clients.set(payload.id.toString(), {
        socket: client,
        user: payload,
      });
    } catch (error) {
      console.error("Connection rejected:", error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.data?.user?.id);
  }

  sendMessage(message: any, members?: User[], isUpdated = false) {
    for (const client of this.clients.values()) {
      if (message.user?.id == client.user.id) continue; // Do not send message to the himself
      if (members && !members.some((m) => m.id == client.user.id)) continue; // Do not send message to unauthorized users

      client.socket.emit(isUpdated ? "updateMessage" : "message", message);
    }
  }

  removeMessage(message: any) {
    for (const client of this.clients.values()) {
      client.socket.emit("removeMessage", { id: message.id });
    }
  }

  sendInvit(invite: any, userId: number) {
    const client = this.clients.get(userId.toString());
    if (client) client.socket.emit("invite", invite);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { IUserInfos, UserInfos } from "src/decorators/user.decorator";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessagesService } from "./messages.service";

@Controller("messages")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createMessageDto: CreateMessageDto,
    @UserInfos() user: IUserInfos,
  ) {
    return this.messagesService.create(createMessageDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.messagesService.findAll(query);
  }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateMessageDto: UpdateMessageDto) {
  //   return this.messagesService.update(+id, updateMessageDto);
  // }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string, @UserInfos() user: IUserInfos) {
    return this.messagesService.remove(+id, user);
  }
}

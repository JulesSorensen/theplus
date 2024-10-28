import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { IUserInfos, UserInfos } from "src/decorators/user.decorator";
import { CreateGroupDto } from "./dto/group.dto";
import { GroupsService } from "./groups.service";

@Controller("groups")
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() data: CreateGroupDto, @UserInfos() user: IUserInfos) {
    return this.groupsService.create(data, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@UserInfos() user: IUserInfos) {
    return this.groupsService.findAll(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id/leave")
  leaveGroup(@Param("id") id: string, @UserInfos() user: IUserInfos) {
    return this.groupsService.leaveGroup(+id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/kick/:userId")
  kickMember(
    @Param("id") id: string,
    @Param("userId") userId: string,
    @UserInfos() user: IUserInfos,
  ) {
    return this.groupsService.removeMember(+id, +userId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string, @UserInfos() user: IUserInfos) {
    return this.groupsService.remove(+id, user);
  }
}

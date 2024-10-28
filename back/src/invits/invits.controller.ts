import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IUserInfos, UserInfos } from 'src/decorators/user.decorator';
import { CreateInvitDto } from './dto/create-invit.dto';
import { UpdateInvitDto } from './dto/update-invit.dto';
import { InvitsService } from './invits.service';

@Controller('invits')
export class InvitsController {
  constructor(private readonly invitsService: InvitsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createInvitDto: CreateInvitDto, @UserInfos() user: IUserInfos) {
    return this.invitsService.create(createInvitDto , user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvitDto: UpdateInvitDto, @UserInfos() user: IUserInfos) {
    return this.invitsService.update(+id, updateInvitDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@UserInfos() user: IUserInfos) {
    return this.invitsService.findAll(user);
  }
}

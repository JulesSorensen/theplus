import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupsModule } from "src/groups/groups.module";
import { UsersModule } from "src/users/users.module";
import { Invit } from "./entities/invit.entity";
import { InvitsController } from "./invits.controller";
import { InvitsService } from "./invits.service";

@Module({
  imports: [TypeOrmModule.forFeature([Invit]), UsersModule, GroupsModule],
  controllers: [InvitsController],
  providers: [InvitsService],
})
export class InvitsModule {}

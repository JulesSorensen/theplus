import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IUserInfos } from "src/decorators/user.decorator";
import { GroupsService } from "src/groups/groups.service";
import { MessagesService } from "src/messages/messages.service";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { CreateInvitDto } from "./dto/create-invit.dto";
import { UpdateInvitDto } from "./dto/update-invit.dto";
import { Invit } from "./entities/invit.entity";
import { EInvitStatus } from "./models";

@Injectable()
export class InvitsService {
  constructor(
    @InjectRepository(Invit) private invitsRepository: Repository<Invit>,
    @Inject(UsersService) private readonly userService: UsersService,
    @Inject(GroupsService) private readonly groupservice: GroupsService,
    @Inject(MessagesService) private readonly messagesService: MessagesService,
  ) {}

  async create(createInvitDto: CreateInvitDto, user: IUserInfos) {
    const users = await this.userService.findAllByIds(createInvitDto.userIds);
    if (!users) throw new ForbiddenException(["User not found"]);

    if (users.length < 1)
      throw new ForbiddenException(["You must invite at least one user"]);

    if (users.some((u) => u.id === user.id))
      throw new ForbiddenException(["You can't invite yourself"]);

    const invits = [];
    await Promise.all(
      users.map(async (userToInvit) => {
        const existingInvitQb = this.invitsRepository
          .createQueryBuilder("invit")
          .where("invit.groupId = :groupId", {
            groupId: createInvitDto.groupId,
          })
          .andWhere("invit.receiverId = :receiverId", {
            receiverId: userToInvit.id,
          })
          .andWhere("invit.status IN (:...statuses)", {
            statuses: [EInvitStatus.PENDING, EInvitStatus.ACCEPTED],
          });

        const existingInvit = await existingInvitQb.getOne();
        if (!existingInvit) {
          const invit = await this.invitsRepository.save({
            sender: { id: user.id },
            receiver: { id: userToInvit.id },
            group: { id: createInvitDto.groupId },
            status: EInvitStatus.PENDING,
          });
          invits.push(invit);

          this.messagesService.sendInvitation(invit, userToInvit.id);
        }
      }),
    );

    return invits;
  }

  async update(id: number, updateInvitDto: UpdateInvitDto, user: IUserInfos) {
    const invit = await this.invitsRepository.findOne({
      where: { id },
      relations: ["receiver", "group"],
    });

    if (!invit || invit.receiver.id !== user.id)
      throw new ForbiddenException(["Invit not found"]);

    if (invit.status !== EInvitStatus.PENDING)
      throw new ForbiddenException(["Invit already answered"]);

    if (updateInvitDto.status === EInvitStatus.ACCEPTED) {
      await this.groupservice.addMember(invit.group.id, user.id);
    }

    return this.invitsRepository.save({
      ...invit,
      status: updateInvitDto.status,
    });
  }

  async findAll(user: IUserInfos) {
    const invits = await this.invitsRepository.find({
      where: { receiver: { id: user.id }, status: EInvitStatus.PENDING },
      relations: ["sender", "group"],
    });

    return invits.map((invit) => {
      delete invit.sender?.password;
      delete invit.sender?.email;
      delete invit.sender?.createdAt;
      delete invit.sender?.updatedAt;

      return invit;
    });
  }
}

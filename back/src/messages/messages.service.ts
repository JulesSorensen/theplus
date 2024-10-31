import { HttpException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as sha256 from "sha256";
import { IUserInfos } from "src/decorators/user.decorator";
import { GroupsService } from "src/groups/groups.service";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { Message } from "./entities/message.entity";
import { MessagesGateway } from "./messages.gateway";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @Inject(GroupsService) private groupsService: GroupsService,
    private messagesGateway: MessagesGateway,
  ) {}

  async sendInvitation(invite: any, userId: number) {
    this.messagesGateway.sendInvit(invite, userId);
  }

  async create(createMessageDto: CreateMessageDto, author: IUserInfos) {
    const messageToCreate: Message | any = {
      ...createMessageDto,
      user: {
        id: author.id,
      },
    };

    let members: Partial<User[]> | any | undefined = undefined;
    if (createMessageDto.groupId) {
      const groups = await this.groupsService.findAllOfUser(author.id);
      if (!groups) throw new HttpException("Group not found", 404);

      const group = groups.find((g) => g.id === createMessageDto.groupId);
      if (!group) throw new HttpException("Group not found", 404);

      members = group.groupsUsers.map((gu) => ({ id: gu.user.id }));
      messageToCreate.group = { id: createMessageDto.groupId };
    }

    const msg = await this.messageRepository.save(messageToCreate);

    msg.user = {
      id: author.id,
      name: author.name,
      hashedName: sha256(author.name),
    };

    this.messagesGateway.sendMessage(msg, members, false);

    return msg;
  }

  async findOne(id: number) {
    const msg = await this.messageRepository.findOne({
      where: { id },
      relations: ["user", "group", "group.groupsUsers"],
    });

    msg.user = {
      ...msg.user,
      hashedName: sha256(msg.user.name),
    };

    return msg;
  }

  async findAll(query: any) {
    const queryBuilder = this.messageRepository
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.user", "user")
      .leftJoinAndSelect("message.group", "group")
      .where("message.deletedAt IS NULL");

    if (query.name) {
      queryBuilder.andWhere("user.name = :name", { name: query.name });
    }

    if (query.groupId) {
      queryBuilder.andWhere("group.id = :groupId", { groupId: query.groupId });
    } else {
      queryBuilder.andWhere("message.groupId IS NULL");
    }

    const msgs = await queryBuilder.getMany();

    return msgs.map((msg) => {
      return {
        ...msg,
        user: {
          id: msg.user.id,
          name: msg.user.name,
          hashedName: sha256(msg.user.name),
          email: msg.user.email,
        },
      };
    });
  }

  async update(
    id: number,
    updateMessageDto: UpdateMessageDto,
    user: IUserInfos,
  ) {
    const msg = await this.findOne(id);
    if (!msg) throw new Error("Message not found");
    if (msg.user.id !== user.id)
      throw new Error("You are not allowed to update this message");

    const updatedMsg = {
      ...msg,
      content: updateMessageDto.content,
    };

    await this.messageRepository.save(updatedMsg);
    let members: Partial<User[]> | any | undefined = undefined;
    if (msg.group?.id) {
      members = msg.group.groupsUsers.map((gu) => ({ id: gu.user.id }));
    }
    this.messagesGateway.sendMessage(msg, members, true);

    return updatedMsg;
  }

  async remove(id: number, user: IUserInfos) {
    const message = await this.findOne(id);
    if (message.user.id !== user.id)
      throw new HttpException(
        "You are not allowed to delete this message",
        403,
      );

    message.deletedAt = new Date();
    await this.messageRepository.save(message);

    this.messagesGateway.removeMessage(message);

    return true;
  }
}

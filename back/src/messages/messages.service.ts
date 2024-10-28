import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IUserInfos } from "src/decorators/user.decorator";
import { Repository } from "typeorm";
import { CreateMessageDto } from "./dto/create-message.dto";
import { Message } from "./entities/message.entity";
import { MessagesGateway } from "./messages.gateway";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private usersRepository: Repository<Message>,
    private messagesGateway: MessagesGateway,
  ) {}

  async create(createMessageDto: CreateMessageDto, author: IUserInfos) {
    const messageToCreate: Message | any = {
      ...createMessageDto,
      user: {
        id: author.id,
      },
    };

    const msg = await this.usersRepository.save(messageToCreate);

    this.messagesGateway.sendMessage(msg);

    return msg;
  }

  async findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  async findAll(query: any) {
    return this.usersRepository.find({
      where: { ...query, deletedAt: null },
      relations: ["user"],
    });
  }

  // update(id: number, updateMessageDto: UpdateMessageDto) {
  //   return `This action updates a #${id} message`;
  // }

  async remove(id: number, user: IUserInfos) {
    const message = await this.findOne(id);
    if (message.user.id !== user.id)
      throw new Error("You are not allowed to delete this message");

    message.deletedAt = new Date();
    await this.usersRepository.save(message);

    return true;
  }
}

import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { IUserInfos } from "src/decorators/user.decorator";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      ...createUserDto,
      password: bcrypt.hashSync(createUserDto.password, 8),
    });

    const existingUser = await this.usersRepository.findBy({
      email: user.email,
    });
    if (existingUser.length > 0)
      throw new ForbiddenException(["Email already used"]);

    const newUser = await this.usersRepository.save(user);
    delete newUser.password;

    return newUser;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findBy({ email });

    return user[0];
  }

  async update(updateUserDto: UpdateUserDto, user: IUserInfos) {
    const userToUpdate = await this.usersRepository.findOne({
      where: { id: user.id },
    });
    if (!userToUpdate) throw new ForbiddenException(["User not found"]);

    if (updateUserDto.password)
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 8);

    const updatedUser = await this.usersRepository.save({
      ...userToUpdate,
      ...updateUserDto,
      id: user.id,
    });

    return updatedUser;
  }
}

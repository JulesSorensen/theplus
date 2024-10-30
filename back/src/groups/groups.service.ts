import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as sha256 from "sha256";
import { IUserInfos } from "src/decorators/user.decorator";
import { Repository } from "typeorm";
import { CreateGroupDto } from "./dto/group.dto";
import { Group, GroupUser } from "./entities/Group.entity";

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group) private groupsRepository: Repository<Group>,
    @InjectRepository(GroupUser)
    private groupsUsersRepository: Repository<GroupUser>,
  ) {}

  async create(data: CreateGroupDto, user: IUserInfos) {
    const group = await this.groupsRepository.save(data);
    await this.groupsUsersRepository.save({ group, user, isAdmin: true });
    return group;
  }

  async addMember(groupId: number, userId: number) {
    const group = await this.groupsRepository.findOne({
      where: { id: groupId },
    });
    if (!group) throw new ForbiddenException(["Group not found"]);

    return await this.groupsUsersRepository.save({
      group: { id: groupId },
      user: { id: userId },
      isAdmin: false,
    });
  }

  async removeMember(groupId: number, userId: number, user: IUserInfos) {
    const group = await this.groupsRepository.findOne({
      where: { id: groupId },
    });
    if (!group) throw new ForbiddenException(["Group not found"]);

    const groupMembers = await this.groupsUsersRepository.find({
      where: { group: { id: groupId } },
    });
    const groupMember = groupMembers.find((c) => c.user.id === userId);

    if (
      !groupMember ||
      (groupMember.user.id !== user.id && !groupMember.isAdmin)
    )
      throw new ForbiddenException([
        "You are not allowed to delete this member",
      ]);

    return this.groupsUsersRepository.delete(groupMember.id);
  }

  async leaveGroup(groupId: number, user: IUserInfos) {
    const group = await this.groupsRepository.findOne({
      where: { id: groupId },
    });
    if (!group) throw new ForbiddenException(["Group not found"]);

    const groupMembers = await this.groupsUsersRepository.find({
      where: { group: { id: groupId } },
    });
    const groupMember = groupMembers.find((c) => c.user.id === user.id);
    if (!groupMember)
      throw new ForbiddenException(["You are not in this group"]);

    return this.groupsUsersRepository.delete(groupMember.id);
  }

  async deleteGroup(groupId: number, user: IUserInfos) {
    const group = await this.groupsRepository.findOne({
      where: { id: groupId },
    });
    const groupMembers = await this.groupsUsersRepository.find({
      where: { group: { id: groupId } },
    });
    const userInGroup = groupMembers.find((c) => c.user.id === user.id);

    if (!group || !userInGroup || !userInGroup.isAdmin)
      throw new ForbiddenException([
        "You are not allowed to delete this group",
      ]);

    await this.groupsUsersRepository.delete({ group: { id: groupId } });

    return this.groupsRepository.delete(groupId);
  }

  async findAll(user: IUserInfos) {
    const groupsOfUser = await this.groupsUsersRepository.find({
      where: { user: { id: user.id } },
      relations: ["group"],
    });

    const groupIds = groupsOfUser.map((c) => c.group.id);

    const groups = await this.groupsRepository
      .createQueryBuilder("group")
      .where("group.id IN (:...ids)", { ids: groupIds })
      .leftJoinAndSelect("group.groupsUsers", "groupsUsers")
      .leftJoinAndSelect("groupsUsers.user", "user")
      .getMany();

    return groups.map((c) => ({
      ...c,
      groupsUsers: c.groupsUsers.map((c) => {
        delete c.user.password;
        delete c.user.email;
        delete c.user.createdAt;
        delete c.user.updatedAt;

        c.user.hashedName = sha256(c.user.name);

        return c;
      }),
    }));
  }

  async findAllOfUser(userId: number) {
    const groupsOfUser = await this.groupsUsersRepository.find({
      where: { user: { id: userId } },
      relations: ["group"],
    });

    const groupIds = groupsOfUser.map((c) => c.group.id);

    const groups = await this.groupsRepository
      .createQueryBuilder("group")
      .where("group.id IN (:...ids)", { ids: groupIds })
      .leftJoinAndSelect("group.groupsUsers", "groupsUsers")
      .leftJoinAndSelect("groupsUsers.user", "user")
      .getMany();

    return groups;
  }

  async remove(id: number, user: IUserInfos) {
    const Group = await this.findAll(user);

    if (!Group || !Group.length || !Group.find((c) => c.id === id))
      throw new ForbiddenException([
        "You are not allowed to delete this Group",
      ]);

    return this.groupsRepository.delete(id);
  }
}

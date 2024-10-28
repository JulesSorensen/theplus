import { Invit } from "src/invits/entities/invit.entity";
import { Message } from "src/messages/entities/message.entity";
import { User } from "src/users/entities/user.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("groups")
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Message, (message) => message.group)
  messages: Message[];

  @OneToMany(() => GroupUser, (groupUser) => groupUser.group)
  groupsUsers: GroupUser[];

  @OneToMany(() => Invit, (invit) => invit.group)
  invits: Invit[];

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}

@Entity("groups_users")
export class GroupUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Group, (group) => group.groupsUsers)
  group: Group;

  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  @Column()
  isAdmin: boolean;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  joinedAt: Date;
}

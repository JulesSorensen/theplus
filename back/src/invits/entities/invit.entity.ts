import { Group } from "src/groups/entities/group.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EInvitStatus } from "../models";

@Entity("invits")
export class Invit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => User)
  receiver: User;

  @ManyToOne(() => Group, (group) => group.invits)
  group: Group;

  @Column({ default: EInvitStatus.PENDING })
  status: EInvitStatus;
}

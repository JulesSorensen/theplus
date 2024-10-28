import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  content: string;

  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "datetime", default: null, select: false })
  deletedAt?: Date;
}

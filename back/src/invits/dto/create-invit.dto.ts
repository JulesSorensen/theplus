import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty } from "class-validator";

export class CreateInvitDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  userIds: number[];

  @IsNotEmpty()
  @IsInt()
  groupId: number;
}

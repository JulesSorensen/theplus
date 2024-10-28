import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  name: string;
}

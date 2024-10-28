import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  content: string;
}

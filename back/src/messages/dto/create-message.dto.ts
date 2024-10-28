import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  content: string;

  @IsOptional()
  @IsInt()
  groupId?: number;
}

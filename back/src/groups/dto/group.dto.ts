import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateGroupDto {
  @IsNotEmpty({ message: "Le nom du groupe est obligatoire" })
  @IsString({ message: "Le nom du groupe doit être une chaîne de caractères" })
  @Length(1, 20, {
    message: "Le nom du groupe doit être compris entre 1 et 20 caractères",
  })
  name: string;
}

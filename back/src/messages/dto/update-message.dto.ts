import { IsNotEmpty, IsString, Length } from "class-validator";

export class UpdateMessageDto {
  @IsNotEmpty({ message: "Vous devez renseigner un contenu" })
  @IsString({ message: "Le contenu doit être une chaîne de caractères" })
  @Length(1, 1000, {
    message: "Le contenu doit être compris entre 1 et 1000 caractères",
  })
  content: string;
}

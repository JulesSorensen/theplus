import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty } from "class-validator";

export class CreateInvitDto {
  @IsNotEmpty({ message: "Vous devez renseigner au moins un utilisateur" })
  @IsArray({ message: "Vous devez renseigner au moins un utilisateur" })
  @ArrayNotEmpty({ message: "Vous devez renseigner au moins un utilisateur" })
  @IsInt({
    each: true,
    message: "Les identifiants des utilisateurs doivent être des nombres",
  })
  userIds: number[];

  @IsNotEmpty({ message: "Vous devez renseigner un groupe" })
  @IsInt({ message: "L'identifiant du groupe doit être un nombre" })
  groupId: number;
}
